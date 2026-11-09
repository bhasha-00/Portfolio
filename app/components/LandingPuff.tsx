"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./LandingPuff.module.css";

type Props = {
  /** Touchdown point, in px inside the nearest positioned ancestor. */
  x: number;
  y: number;
  /** Crane width in px: puffs and shadow scale from it. */
  size: number;
  /** 1.5px ink outline and inner curls on each cloud. On by default. */
  stroke?: boolean;
  /** Called once the burst has finished (or straight away with reduced motion). */
  onDone?: () => void;
};

const DUR = 1500; // slow and calm: the clouds drift out and settle, nothing snaps
// Ring directions in degrees (0 = right, 90 = down): two clouds to each side, one tucked behind.
const ANGLES = [195, 160, -15, 20, -95];
// Cloud outline in a 120 × 76 box: flat-ish base, rounded bumps on top.
const CLOUD =
  "M22 64C10 64 5 53 12 46C8 34 21 26 32 31C34 17 52 11 62 21C71 9 93 13 93 29C106 27 115 40 107 50C113 59 105 67 95 65C89 73 71 73 64 67C56 73 39 73 34 66C29 69 22 68 22 64Z";
const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

// One landing under the crane's foot: small cartoon clouds drift gently out to the sides, swell a
// little and fade, while a contact shadow spreads and sharpens, then settles. Plays once, then
// unmounts itself. Web Animations only (cancelled on unmount), so re-mounting with a new `key`
// interrupts a burst cleanly. Never takes taps, focus or space.
export default function LandingPuff({ x, y, size, stroke = true, onDone }: Props) {
  const uid = useId().replace(/:/g, "");
  const puffs = useRef<(HTMLSpanElement | null)[]>([]);
  const soft = useRef<HTMLSpanElement>(null);
  const sharp = useRef<HTMLSpanElement>(null);
  const [over, setOver] = useState(false);
  const done = useRef(onDone);
  done.current = onDone;

  // Per-cloud variation, fixed for this landing: direction, width and start delay.
  const [ring] = useState(() =>
    ANGLES.map((deg, i) => ({
      a: ((deg + rand(-8, 8)) * Math.PI) / 180,
      w: size * (i === 4 ? 0.5 : 0.68) * rand(0.88, 1.12),
      delay: i * 70 + rand(0, 50),
    })),
  );

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOver(true);
      done.current?.();
      return;
    }
    const anims: Animation[] = [];
    const r0 = size * 0.12, r1 = size * 0.62, rise = size * 0.1;

    ring.forEach((p, i) => {
      const el = puffs.current[i];
      if (!el) return;
      // Spread wide, travel shallow: clouds roll out along the desk and lift a touch as they go.
      const cx = Math.cos(p.a), cy = Math.sin(p.a) * 0.45;
      const at = (r: number, up: number, s: number) =>
        `translate(${cx * r}px, ${cy * r - up}px) scale(${s})`;
      const timing = { duration: DUR, delay: p.delay, fill: "both" as const };
      anims.push(
        el.animate([{ transform: at(r0, 0, 0.55) }, { transform: at(r1, rise, 1.05) }], {
          ...timing,
          easing: "cubic-bezier(.22,.61,.36,1)", // long, soft ease-out
        }),
        // Fades in softly, holds, then dissolves over the last 60%.
        el.animate(
          [
            { opacity: 0 },
            { opacity: 1, offset: 0.16, easing: "linear" },
            { opacity: 1, offset: 0.4, easing: "cubic-bezier(.4,0,.6,1)" },
            { opacity: 0 },
          ],
          { ...timing, easing: "linear" },
        ),
      );
    });

    // Shadow: the soft one spreads on impact, the sharp one flashes in tight, both settle away.
    // Two fixed blurs crossfading stand in for "sharpening" (blur itself never animates).
    if (soft.current)
      anims.push(
        soft.current.animate(
          [
            { transform: "scale(.6)", opacity: 0 },
            { transform: "scale(1.25)", opacity: 0.32, offset: 0.3 },
            { transform: "scale(1)", opacity: 0 },
          ],
          { duration: DUR, easing: "cubic-bezier(.2,.8,.3,1)", fill: "both" },
        ),
      );
    if (sharp.current)
      anims.push(
        sharp.current.animate(
          [
            { transform: "scale(.5)", opacity: 0 },
            { transform: "scale(1.1)", opacity: 0.5, offset: 0.18 },
            { transform: "scale(1)", opacity: 0.25, offset: 0.45 },
            { transform: "scale(1)", opacity: 0 },
          ],
          { duration: DUR, easing: "ease-out", fill: "both" },
        ),
      );

    let live = true;
    Promise.all(anims.map((a) => a.finished))
      .then(() => {
        if (!live) return;
        setOver(true);
        done.current?.();
      })
      .catch(() => {}); // cancelled: a newer burst or unmount took over
    return () => {
      live = false;
      anims.forEach((a) => a.cancel());
    };
  }, [ring, size]);

  if (over) return null;

  return (
    <span
      className={styles.root}
      style={{ transform: `translate(${x}px, ${y}px)` }}
      aria-hidden="true"
    >
      <span
        ref={soft}
        className={`${styles.shadow} ${styles.soft}`}
        style={{ width: size * 0.7, height: size * 0.16 }}
      />
      <span
        ref={sharp}
        className={`${styles.shadow} ${styles.sharp}`}
        style={{ width: size * 0.42, height: size * 0.09 }}
      />
      {ring.map((p, i) => (
        <span
          key={i}
          ref={(el) => {
            puffs.current[i] = el;
          }}
          className={styles.puff}
          style={{ width: p.w, height: (p.w * 76) / 120 }}
        >
          {/* Cartoon cloud: bumpy top, soft underside shade, two inner curls (after the brief's image). */}
          <svg viewBox="0 0 120 76" width="100%" height="100%">
            <defs>
              <clipPath id={`${uid}-${i}`}>
                <path d={CLOUD} />
              </clipPath>
            </defs>
            <path d={CLOUD} className={styles.body} />
            <ellipse cx="60" cy="74" rx="58" ry="15" className={styles.under} clipPath={`url(#${uid}-${i})`} />
            {stroke && (
              <>
                <path d={CLOUD} className={styles.line} />
                <path d="M64 44c5-6 14-4 15 3" className={styles.line} />
                <path d="M30 46c3-5 10-4 11 1" className={styles.line} />
              </>
            )}
          </svg>
        </span>
      ))}
    </span>
  );
}
