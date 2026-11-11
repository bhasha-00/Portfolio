"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

// The three-card spread shared by AI Tinkering and About (Spread.module.css): one card in front, the
// other two smaller, tucked behind it on either side. Bringing a side card to the front turns the
// ring (CSS transition on .pos). On the way in the cards fan out of a centred stack into the spread,
// one by one, left to right, each swinging through its angle and landing upright, and gather back as
// the section leaves (from 768): scrubbed by scroll
// from 768 (the section is pinned), on phones as the row comes into view. Swipe and the arrow keys
// turn the ring too. Reduced motion: no fan, and the CSS durations are 0, so turns are instant.

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const easeOut = (t: number) => 1 - (1 - t) ** 3; // one strong ease-out; never ease-in
const N = 3;
const SWIPE = 40; // px of horizontal travel that counts as a swipe

/** Where card i sits when card `front` is in front: 0 front, 1 left, 2 right (a ring). */
export const roleOf = (i: number, front: number) => (i - front + N) % N;
export const ROLE = ["front", "left", "right"] as const;

/** Swing angles of the fan, in degrees: `swing` from 768, `tilt` on phones. */
export type Fan = { swing: number; tilt: number };

export function useSpread(fan: Fan[]) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const slots = useRef<(HTMLDivElement | null)[]>([]);
  const swipe = useRef<{ x: number; y: number; done: boolean } | null>(null);
  const settled = useRef(false); // the fan has finished
  const [front, setFront] = useState(0);
  const [prev, setPrev] = useState(0); // the card that was in front before the last turn
  const frontRef = useRef(front);
  frontRef.current = front;
  const fanRef = useRef(fan);
  fanRef.current = fan;

  const bring = useCallback((i: number) => {
    if (i === frontRef.current) return;
    setPrev(frontRef.current);
    setFront(i);
  }, []);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const wide = matchMedia("(min-width: 768px)");
    let raf = 0;

    const update = () => {
      raf = 0;
      const sec = section.current, st = stage.current;
      if (!sec || !st) return;
      const still = reduce.matches;
      const dx = parseFloat(getComputedStyle(st).getPropertyValue("--dx")) / 100 || 0;

      let p: number;
      if (wide.matches) {
        // In, hold, out: the cards fan out as the section arrives, sit spread through the middle of
        // the pinned stretch, and gather back into the stack as it leaves (scrolling down past it
        // mirrors scrolling up into it). `s` is the scroll since the section's top crossed 60%.
        const r = sec.getBoundingClientRect();
        const lead = innerHeight * 0.6, run = sec.offsetHeight - innerHeight;
        const s = lead - r.top;
        const inEnd = lead + run * 0.45; // fully spread
        const outStart = lead + run * 0.8; // start gathering
        const outEnd = lead + run + innerHeight * 0.4; // stacked as the section's bottom passes 60%
        p = s < outStart ? clamp(s / inEnd) : clamp(1 - (s - outStart) / (outEnd - outStart));
      } else {
        p = clamp((innerHeight * 0.98 - st.getBoundingClientRect().top) / (innerHeight * 0.6));
      }
      if (still) p = 1;

      let done = true;
      fanRef.current.forEach((c, i) => {
        const el = slots.current[i];
        if (!el) return;
        const role = roleOf(i, frontRef.current);
        // One by one, left to right: left, front, right each get their own slice of the scroll.
        const k = role === 1 ? 0 : role === 0 ? 1 : 2;
        const t = easeOut(clamp((p - k * 0.2) / 0.5));
        if (t < 1) done = false;
        // The stack: each card pulled back towards the centre (undoing its side offset on .pos),
        // slightly fanned so it reads as a stack. On phones the row also rises 48px into place.
        const side = role === 1 ? -1 : role === 2 ? 1 : 0;
        const sx = -side * dx * el.offsetWidth + (k - 1) * 6;
        const sy = wide.matches ? (k - 1) * 4 : 48;
        const a = still ? 0 : (wide.matches ? c.swing : c.tilt) * Math.sin(Math.PI * t);
        el.style.transform = `translate(${sx * (1 - t)}px, ${sy * (1 - t)}px) rotate(${a}deg)`;
      });
      settled.current = done;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    reduce.addEventListener("change", onScroll);
    wide.addEventListener("change", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      reduce.removeEventListener("change", onScroll);
      wide.removeEventListener("change", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Swipe (phones, or a mouse drag): left brings the right card to the front, right the left one.
  const stageProps = {
    onPointerDown: (e: PointerEvent) => {
      swipe.current = { x: e.clientX, y: e.clientY, done: false };
    },
    onPointerUp: (e: PointerEvent) => {
      const s = swipe.current;
      if (!s) return;
      const dx = e.clientX - s.x, dy = e.clientY - s.y;
      if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(dy)) {
        s.done = true; // the click that follows a drag is not a tap
        bring((frontRef.current + (dx < 0 ? 2 : 1)) % N);
      }
    },
    onPointerCancel: () => {
      swipe.current = null;
    },
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      const next = (frontRef.current + (e.key === "ArrowLeft" ? 1 : 2)) % N;
      bring(next);
      // Keep focus on the card that came to the front.
      slots.current[next]?.querySelector<HTMLElement>("button, a")?.focus({ preventScroll: true });
    },
  };

  /** True right after a swipe: the click it fires is not a tap. Asked once per click. */
  const swiped = () => {
    const d = !!swipe.current?.done;
    if (d) swipe.current = null;
    return d;
  };

  /** Stacking: front on top, the card leaving the front next, the one crossing behind lowest. */
  const zOf = (i: number) => (roleOf(i, front) === 0 ? 3 : i === prev ? 2 : 1);

  return { section, stage, slots, front, bring, settled, stageProps, swiped, zOf };
}
