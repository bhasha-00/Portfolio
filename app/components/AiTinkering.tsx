"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { PILL_H, tinkers } from "../content/ai";
import Origami from "./companion/Origami";
import PerchPuff from "./companion/PerchPuff";
import styles from "./AiTinkering.module.css";

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const easeOut = (t: number) => 1 - (1 - t) ** 3; // one strong ease-out; never ease-in
const N = tinkers.length; // 3: one in front, one each side
const PERCH = 0; // the crane perches on the card that starts in front
const SWIPE = 40; // px of horizontal travel that counts as a swipe

/** Where card i sits when card `front` is in front: 0 front, 1 left, 2 right (a ring). */
const roleOf = (i: number, front: number) => (i - front + N) % N;
const ROLE = ["front", "left", "right"] as const;

// AI Tinkering. Three cards in a spread (ai.svg): one in front, the other two smaller, tucked behind
// it on either side. Clicking or tapping a side card turns the ring, bringing it to the front (transform
// only, CSS on .pos); on phones a swipe does the same, and the arrow keys do it from the keyboard.
// On the way in, the cards fan out of a centred stack into the spread, one by one, left to right,
// each swinging through its fan angle and landing upright: scrubbed by scroll from 768 (pinned),
// on phones as the row comes into view. Reduced motion: the cards sit in place and swap instantly.
export default function AiTinkering() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const slots = useRef<(HTMLDivElement | null)[]>([]);
  const fly = useRef<HTMLSpanElement>(null);
  const swipe = useRef<{ x: number; y: number; done: boolean } | null>(null);
  const [front, setFront] = useState(0);
  const [prev, setPrev] = useState(0); // the card that was in front before the last turn
  const frontRef = useRef(front);
  frontRef.current = front;

  const craneWidth = useCallback(() => (fly.current?.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0, []);

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

      // Progress: from 768 scrubbed through the pinned stretch; on phones as the row comes into view.
      let p: number;
      if (wide.matches) {
        const r = sec.getBoundingClientRect();
        const lead = innerHeight * 0.6, run = sec.offsetHeight - innerHeight;
        p = clamp((lead - r.top) / (lead + run * 0.75));
      } else {
        p = clamp((innerHeight * 0.98 - st.getBoundingClientRect().top) / (innerHeight * 0.6));
      }
      if (still) p = 1;

      tinkers.forEach((c, i) => {
        const el = slots.current[i];
        if (!el) return;
        const role = roleOf(i, frontRef.current);
        // One by one, left to right: left, front, right each get their own slice of the scroll.
        const k = role === 1 ? 0 : role === 0 ? 1 : 2;
        const t = easeOut(clamp((p - k * 0.2) / 0.5));
        // The stack: each card pulled back towards the centre (undoing its side offset on .pos),
        // slightly fanned so it reads as a stack. The phones' row also rises 48px into place.
        const side = role === 1 ? -1 : role === 2 ? 1 : 0;
        const sx = -side * dx * el.offsetWidth + (k - 1) * 6;
        const sy = wide.matches ? (k - 1) * 4 : 48;
        const a = still ? 0 : (wide.matches ? c.swing : c.tilt) * Math.sin(Math.PI * t);
        el.style.transform = `translate(${sx * (1 - t)}px, ${sy * (1 - t)}px) rotate(${a}deg)`;
      });
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
  const onPointerDown = (e: PointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY, done: false };
  };
  const onPointerUp = (e: PointerEvent) => {
    const s = swipe.current;
    if (!s) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(dy)) {
      s.done = true; // the click that follows a drag is not a tap
      bring((front + (dx < 0 ? 2 : 1)) % N);
    }
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const next = (front + (e.key === "ArrowLeft" ? 1 : 2)) % N;
    bring(next);
    // Keep focus on the card that came to the front.
    slots.current[next]?.querySelector("button")?.focus({ preventScroll: true });
  };

  return (
    <section ref={section} id="ai-tinkering" className={styles.ai} aria-labelledby="ai-tinkering-title">
      <h2 id="ai-tinkering-title" className="sr-only">
        AI Tinkering
      </h2>
      {/* Full width, so the side cards peek in to the screen edge and are clipped there. */}
      <div className={`container ${styles.pin}`}>
        <div
          ref={stage}
          className={styles.stage}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipe.current = null)}
          onKeyDown={onKeyDown}
        >
          {tinkers.map((c, i) => {
            const role = roleOf(i, front);
            const isFront = role === 0;
            // Front on top; the card leaving the front next; the one crossing behind lowest.
            const z = isFront ? 3 : i === prev ? 2 : 1;
            return (
              <div
                key={c.name}
                ref={(el) => {
                  slots.current[i] = el;
                }}
                className={styles.slot}
                style={{ zIndex: z }}
              >
                <div className={styles.pos} data-role={ROLE[role]}>
                  <button
                    type="button"
                    className={styles.card}
                    aria-current={isFront || undefined}
                    aria-label={isFront ? undefined : `Bring ${c.name} to the front`}
                    onClick={() => {
                      if (swipe.current?.done) return;
                      if (!isFront) bring(i);
                    }}
                  >
                    <span className={styles.deep} aria-hidden="true" />
                    <span className={styles.media}>
                      {c.media && (
                        <Image
                          src={c.media.src}
                          alt=""
                          fill
                          sizes="(max-width: 767px) 80vw, 560px"
                          quality={80}
                          className={styles.mediaImg}
                        />
                      )}
                    </span>
                    <span className={styles.foot}>
                      <Image
                        src={c.pill.src}
                        alt={c.name}
                        width={c.pill.w}
                        height={PILL_H}
                        className={styles.pill}
                        unoptimized
                      />
                      <span className={styles.line}>{c.line}</span>
                    </span>
                  </button>

                  {i === PERCH && (
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
