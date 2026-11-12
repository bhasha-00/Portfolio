"use client";

import { useEffect, useRef, type ReactNode } from "react";
import cs from "../CaseStudy.module.css";
import styles from "./Flip.module.css";

// Two artifacts on one card that turns over as you scroll (as What I understood does on LSNeo): it pins
// in the screen with its heading, shows `front`, then flips to `back`. The frame is sized to hold the
// taller of the two whole, so nothing moves once it has turned. Transform only; layout is measured
// on resize, never on scroll. Reduced motion: no pin, no flip; one after the other.

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => t * t * (3 - 2 * t);

export default function Flip({ heading, front, back }: { heading: string; front: ReactNode; back: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const spacer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const t = track.current, p0 = pin.current, c = card.current, sp = spacer.current;
    if (!t || !p0 || !c || !sp) return;
    const faces = [...c.children] as HTMLElement[];
    let raf = 0;

    const measure = () => {
      const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-offset")) || 0;
      const vh = document.documentElement.clientHeight;
      const head = p0.offsetHeight - c.offsetHeight; // heading and the gap under it
      const need = Math.max(...faces.map((f) => (f.firstElementChild as HTMLElement | null)?.offsetHeight ?? 0));
      c.style.height = `${need}px`;
      p0.style.top = `${Math.round(Math.max(nav + 8, nav + (vh - nav - head - need) / 2))}px`;
      update();
    };

    const update = () => {
      raf = 0;
      if (reduce.matches) return;
      const run = sp.offsetHeight;
      const d = Math.min(run, Math.max(0, p0.getBoundingClientRect().top - t.getBoundingClientRect().top));
      const q = ease(clamp((d - run * 0.25) / (run * 0.5))); // hold, turn, hold
      c.style.transform = `rotateY(${180 * q}deg)`;
    };

    const clear = () => {
      for (const el of [p0, c]) el.removeAttribute("style");
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const remeasure = () => !reduce.matches && measure();
    const onReduce = () => (reduce.matches ? clear() : measure());
    const ro = new ResizeObserver(remeasure);
    faces.forEach((f) => f.firstElementChild && ro.observe(f.firstElementChild));
    if (reduce.matches) clear();
    else measure();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", remeasure);
    reduce.addEventListener("change", onReduce);
    return () => {
      removeEventListener("scroll", on);
      removeEventListener("resize", remeasure);
      reduce.removeEventListener("change", onReduce);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={track} className={styles.track}>
      <div ref={pin} className={styles.pin}>
        <h2 className={`${cs.h2} ${styles.heading}`}>{heading}</h2>
        <div ref={card} className={styles.card}>
          <div className={styles.face}>{front}</div>
          <div className={`${styles.face} ${styles.back}`}>{back}</div>
        </div>
      </div>
      <div ref={spacer} className={styles.spacer} aria-hidden="true" />
    </div>
  );
}
