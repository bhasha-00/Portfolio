"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./LandingPuff.module.css";

type Props = {
  /** Touchdown point, in px inside the nearest positioned ancestor. */
  x: number;
  y: number;
  /** Crane width in px: puffs and shadow scale from it. */
  size: number;
  /** 1.5px ink outline on each puff. */
  stroke?: boolean;
  /** Called once the burst has finished (or straight away with reduced motion). */
  onDone?: () => void;
};

const PUFFS = 5;
const DUR = 600;
const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

// One landing burst under the crane's foot, seen from above: five paper-coloured puffs push out in
// a ring and fade, while a contact shadow spreads and sharpens, then settles. Plays once, then
// unmounts itself. Web Animations only (cancelled on unmount), so re-mounting with a new `key`
// interrupts a burst cleanly. Never takes taps, focus or space.
export default function LandingPuff({ x, y, size, stroke = false, onDone }: Props) {
  const puffs = useRef<(HTMLSpanElement | null)[]>([]);
  const soft = useRef<HTMLSpanElement>(null);
  const sharp = useRef<HTMLSpanElement>(null);
  const [over, setOver] = useState(false);
  const done = useRef(onDone);
  done.current = onDone;

  // Per-puff variation, fixed for this burst: ring angle, size and start delay.
  const [ring] = useState(() => {
    const turn = rand(0, 360);
    return Array.from({ length: PUFFS }, (_, i) => ({
      a: ((turn + (i * 360) / PUFFS + rand(-14, 14)) * Math.PI) / 180,
      d: size * 0.3 * rand(0.82, 1.18),
      delay: i * 28 + rand(0, 24),
    }));
  });

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOver(true);
      done.current?.();
      return;
    }
    const anims: Animation[] = [];
    const r0 = size * 0.08, r1 = size * 0.5;

    ring.forEach((p, i) => {
      const el = puffs.current[i];
      if (!el) return;
      const cx = Math.cos(p.a), cy = Math.sin(p.a);
      const at = (r: number, s: number) => `translate(${cx * r}px, ${cy * r}px) scale(${s})`;
      const timing = { duration: DUR, delay: p.delay, fill: "both" as const };
      anims.push(
        el.animate([{ transform: at(r0, 0.4) }, { transform: at(r1, 1.3) }], {
          ...timing,
          easing: "cubic-bezier(.2,.8,.3,1)",
        }),
        // Fully there for the first 40%, gone over the last 60%.
        el.animate([{ opacity: 1 }, { opacity: 1, offset: 0.4 }, { opacity: 0 }], { ...timing, easing: "linear" }),
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
          style={{ width: p.d, height: p.d }}
        >
          <svg viewBox="0 0 20 20" width="100%" height="100%">
            <circle
              cx="10"
              cy="10"
              r={stroke ? 9.25 : 10}
              className={stroke ? styles.stroked : undefined}
            />
          </svg>
        </span>
      ))}
    </span>
  );
}
