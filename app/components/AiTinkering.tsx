"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { tinkers } from "../content/ai";
import Origami from "./companion/Origami";
import PerchPuff from "./companion/PerchPuff";
import styles from "./AiTinkering.module.css";

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const easeOut = (t: number) => 1 - (1 - t) ** 3; // one strong ease-out; never ease-in
const MIDDLE = 1; // the crane perches on the middle card

// AI Tinkering. After the last case study, three cards sprawl from a centred stack to their slots,
// one by one, left to right, scrubbed by scroll (transform only). Hover, focus or tap straightens a
// card to 0°, lifts it 8px and deepens its shadow. Phones: a vertical stack with small alternating
// tilts and the same one-by-one reveal. Reduced motion: the cards sit in their final places.
export default function AiTinkering() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const slots = useRef<(HTMLDivElement | null)[]>([]);
  const fly = useRef<HTMLSpanElement>(null);
  const [pressed, setPressed] = useState(-1);

  const craneWidth = useCallback(() => (fly.current?.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0, []);

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
        // Fan: progress runs from "section top at 60% of the screen" through the pinned stretch.
        const r = sec.getBoundingClientRect();
        const lead = innerHeight * 0.6, run = sec.offsetHeight - innerHeight;
        const p = still ? 1 : clamp((lead - r.top) / (lead + run * 0.75));
        const W = st.offsetWidth, H = st.offsetHeight;
        tinkers.forEach((c, i) => {
          const el = slots.current[i];
          if (!el) return;
          // One by one, left to right: each card has its own slice of the scroll.
          const t = easeOut(clamp((p - i * 0.2) / 0.5));
          // From the centred stack (slightly offset, so the stack reads as a stack) to its slot.
          const sx = ((50 - c.x) / 100) * W + (i - 1) * 6, sy = ((50 - c.y) / 100) * H + (i - 1) * 4;
          place(el, sx * (1 - t), sy * (1 - t), c.angle * t);
        });
      } else {
        // Phones: each card slides up and tilts as it comes into view.
        tinkers.forEach((c, i) => {
          const el = slots.current[i];
          if (!el) return;
          const r = el.getBoundingClientRect();
          const t = still ? 1 : easeOut(clamp((innerHeight * 0.98 - r.top) / (innerHeight * 0.5)));
          el.style.transform = `translateY(${48 * (1 - t)}px) rotate(${c.tilt * t}deg)`;
          el.style.setProperty("--a", `${c.tilt * t}deg`);
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
    <section ref={section} id="ai-tinkering" className={styles.ai} aria-labelledby="ai-tinkering-title">
      <h2 id="ai-tinkering-title" className="sr-only">
        AI Tinkering
      </h2>
      <div className={styles.pin}>
        <div ref={stage} className={styles.stage}>
          {tinkers.map((c, i) => (
            <div
              key={c.name}
              ref={(el) => {
                slots.current[i] = el;
              }}
              className={styles.slot}
              style={{ "--x": `${c.x}%`, "--y": `${c.y}%`, "--ratio": `${c.w} / ${c.h}`, zIndex: i + 1 } as CSSProperties}
            >
              <button
                type="button"
                className={styles.card}
                aria-pressed={pressed === i}
                onClick={() => setPressed((p) => (p === i ? -1 : i))}
                onBlur={() => setPressed((p) => (p === i ? -1 : p))}
              >
                <span className={styles.deep} aria-hidden="true" />
                <Image src={c.art} alt="" width={Math.round(c.w)} height={Math.round(c.h)} className={styles.art} unoptimized />
                <span className="sr-only">
                  {c.name}: {c.line}
                </span>
              </button>

              {i === MIDDLE && (
                // The crane's last perch: on this card's top edge, near its right corner.
                <span className={styles.perch} data-perch="ai" aria-hidden="true">
                  <PerchPuff at="ai" size={craneWidth} />
                  <span ref={fly} className={styles.fly} data-fly="">
                    <Origami className={styles.craneArt}>
                      <Image
                        src="/assets/crane-sm.webp"
                        alt=""
                        width={320}
                        height={236}
                        quality={90}
                        sizes="(max-width: 767px) 12vw, 80px"
                        className={styles.craneImg}
                      />
                    </Origami>
                  </span>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
