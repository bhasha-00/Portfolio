"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { aboutLine, crafts, DESK, PHONE } from "../content/about";
import styles from "./About.module.css";

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const easeOut = (t: number) => 1 - (1 - t) ** 3; // one strong ease-out; never ease-in
const pct = (v: number) => `${(v * 100).toFixed(3)}%`;

// About, after the AI Tinkering fan and the stamp reference: the line centred on top; below it the
// craft cards start as one stack and fan out, one by one, into an overlapping upright collage,
// scrubbed by scroll (transform only). Each swings through its fan angle mid-flight and lands
// upright. Hover, focus or tap brings a card to the front, lifts it 8px and deepens its shadow.
// Phones: a tighter, taller collage; each card swings in as it comes into view. Reduced motion:
// the cards sit in their final places.
export default function About() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const slots = useRef<(HTMLDivElement | null)[]>([]);
  const [pressed, setPressed] = useState(-1);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const wide = matchMedia("(min-width: 768px)");
    let raf = 0;

    const place = (el: HTMLDivElement, dx: number, dy: number, a: number) => {
      el.style.transform = `translate(-50%, -50%) translate(${dx}px, ${dy}px) rotate(${a}deg)`;
      el.style.setProperty("--a", `${a}deg`); // the hover straightens by exactly this much
    };

    const update = () => {
      raf = 0;
      const sec = section.current, st = stage.current;
      if (!sec || !st) return;
      const still = reduce.matches;

      if (wide.matches) {
        // Progress runs from "section top at 60% of the screen" through the pinned stretch.
        const r = sec.getBoundingClientRect();
        const lead = innerHeight * 0.6, run = sec.offsetHeight - innerHeight;
        const p = still ? 1 : clamp((lead - r.top) / (lead + run * 0.8));
        const W = st.offsetWidth, H = st.offsetHeight;
        crafts.forEach((c, i) => {
          const el = slots.current[i];
          if (!el) return;
          // One by one: each card has its own slice of the scroll.
          const t = easeOut(clamp((p - i * 0.1) / 0.45));
          // From the centred stack (slightly offset, so it reads as a stack) to its spot.
          const sx = (0.5 - c.desk.x / DESK.w) * W + (i - 2.5) * 5;
          const sy = (0.5 - c.desk.y / DESK.h) * H + (i - 2.5) * 3;
          place(el, sx * (1 - t), sy * (1 - t), still ? 0 : c.swing * Math.sin(Math.PI * t));
        });
      } else {
        // Phones: each card rises and swings in as it comes into view, landing upright.
        crafts.forEach((c, i) => {
          const el = slots.current[i];
          if (!el) return;
          const top = st.getBoundingClientRect().top + (c.phone.y / PHONE.h) * st.offsetHeight;
          const t = still ? 1 : easeOut(clamp((innerHeight * 1.02 - top) / (innerHeight * 0.45)));
          place(el, 0, 48 * (1 - t), still ? 0 : c.swing * 0.5 * Math.sin(Math.PI * t));
        });
      }
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

  return (
    <section ref={section} id="about" className={styles.about} aria-labelledby="about-title">
      <h2 id="about-title" className="sr-only">
        About
      </h2>
      <div className={styles.pin}>
        <p className={styles.line}>{aboutLine}</p>
        <div ref={stage} className={styles.stage}>
          {crafts.map((c, i) => {
            const ratio = c.w / c.h;
            return (
              <div
                key={c.src}
                ref={(el) => {
                  slots.current[i] = el;
                }}
                className={styles.slot}
                style={
                  {
                    "--dx": pct(c.desk.x / DESK.w),
                    "--dy": pct(c.desk.y / DESK.h),
                    "--dw": pct((DESK.cardH * ratio) / DESK.w),
                    "--dz": c.desk.z,
                    "--px": pct(c.phone.x / PHONE.w),
                    "--py": pct(c.phone.y / PHONE.h),
                    "--pw": pct((PHONE.cardH * ratio) / PHONE.w),
                    "--pz": c.phone.z,
                    "--ratio": `${c.w} / ${c.h}`,
                  } as CSSProperties
                }
              >
                <button
                  type="button"
                  className={styles.card}
                  aria-pressed={pressed === i}
                  onClick={() => setPressed((p) => (p === i ? -1 : i))}
                  onBlur={() => setPressed((p) => (p === i ? -1 : p))}
                >
                  <span className={styles.deep} aria-hidden="true" />
                  {/* Served as exported (3x), not resized, so the cards stay sharp when zoomed. */}
                  <Image src={c.src} alt={c.name} width={c.w} height={c.h} className={styles.art} unoptimized />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
