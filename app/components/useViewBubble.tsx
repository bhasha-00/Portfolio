"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import styles from "./ViewBubble.module.css";

// The "View ↗" bubble: follows a mouse over a card. Desktop pointers only (touch never shows it).
// It trails the cursor a little (eased toward it each frame) rather than being pinned to it, so it
// moves with some momentum; it appears where the cursor is, never flying in from elsewhere.
// Reduced motion: it sits right on the cursor, no trail. Used by the case studies and AI Tinkering.
// Render `bubble` outside any element with containment or a transform (it is position: fixed).
export function useViewBubble() {
  const view = useRef<HTMLDivElement>(null);
  const fine = useRef(false);
  const reduced = useRef(false);
  const trail = useRef({ x: 0, y: 0, tx: 0, ty: 0, on: false, raf: 0 });

  useEffect(() => {
    fine.current = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const rm = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => (reduced.current = rm.matches);
    sync();
    rm.addEventListener("change", sync);
    const t = trail.current;
    return () => {
      rm.removeEventListener("change", sync);
      cancelAnimationFrame(t.raf);
    };
  }, []);

  const step = () => {
    const t = trail.current, v = view.current;
    t.raf = 0;
    if (!v) return;
    t.x += (t.tx - t.x) * 0.3;
    t.y += (t.ty - t.y) * 0.3;
    if (Math.abs(t.tx - t.x) < 0.5 && Math.abs(t.ty - t.y) < 0.5) (t.x = t.tx), (t.y = t.ty);
    else t.raf = requestAnimationFrame(step);
    v.style.translate = `${t.x}px ${t.y}px`;
  };

  const follow = (e: PointerEvent) => {
    const v = view.current, t = trail.current;
    if (!fine.current || e.pointerType !== "mouse" || !v) return;
    t.tx = e.clientX;
    t.ty = e.clientY;
    if (!t.on || reduced.current) {
      // Appearing (or reduced motion): start right at the cursor.
      t.x = t.tx;
      t.y = t.ty;
      v.style.translate = `${t.x}px ${t.y}px`;
    } else if (!t.raf) t.raf = requestAnimationFrame(step);
    t.on = true;
    v.style.transform = "scale(1)";
    v.style.opacity = "1";
  };

  const unfollow = () => {
    const v = view.current, t = trail.current;
    if (!v) return;
    t.on = false;
    v.style.transform = "";
    v.style.opacity = ""; // fades and shrinks in place; it reappears at the cursor next time
  };

  const bubble = (
    <div ref={view} className={styles.view} aria-hidden="true">
      View ↗
    </div>
  );

  return { bubble, follow, unfollow };
}
