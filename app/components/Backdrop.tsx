"use client";

import { useEffect, useRef } from "react";
import styles from "./Backdrop.module.css";

// The page background: red, a muted CSS dot grid (from Bhasha's type + texture test) and bg.svg's
// light "burst" shape (1522 × 768 frame). It is fixed: everything scrolls
// over it. On arrival the burst sits low and a touch larger (as home.svg: its centre 261.5 units
// lower, 7.6% bigger); over the first screen of scrolling it rises to the centre (as bg.svg) and
// stays. Transform only. Reduced motion: it starts centred and never moves.
const FRAME = { w: 1522, h: 768 };
const CENTRE = { x: 781, y: 368 }; // the burst's centre in bg.svg
const DROP = 261.5; // how much lower it starts (home.svg), in frame units
const GROW = 0.076; // how much larger it starts

// A comic "boom" burst (Bhasha's reference, 2026-11-19): 14 sharp points round the same centre and
// footprint as bg.svg's shape, each side curving in between point and notch.
const BURST =
  "M756.1 8.3 Q820.3 131.7 904.2 137.0 Q974.2 141.0 1140.8 31.5 Q1053.9 152.2 1103.6 165.0 Q1151.0 182.7 1383.5 107.7 Q1205.6 218.9 1239.9 255.4 Q1309.4 284.7 1643.1 272.3 Q1337.5 326.1 1310.0 358.9 Q1343.7 404.9 1658.6 469.5 Q1326.3 452.3 1266.5 477.2 Q1198.9 508.8 1340.1 610.8 Q1131.7 543.7 1098.7 564.4 Q1061.4 571.2 1164.3 679.6 Q989.2 593.7 918.2 620.7 Q855.4 624.6 829.9 756.7 Q749.6 619.5 653.7 607.9 Q593.5 591.0 439.6 685.5 Q520.1 573.2 470.1 563.6 Q391.3 536.8 117.6 594.5 Q318.0 504.3 286.9 482.2 Q268.7 447.8 -5.6 453.4 Q242.1 399.1 220.2 360.4 Q222.3 337.4 -54.9 299.0 Q240.5 294.7 265.6 253.6 Q331.1 225.5 171.7 126.0 Q415.0 193.6 475.2 174.1 Q501.9 146.8 389.0 9.0 Q568.1 127.5 640.8 125.9 Q714.9 127.3 756.1 8.3Z";

export default function Backdrop() {
  const burst = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = burst.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    const update = () => {
      raf = 0;
      const vw = innerWidth, vh = el.clientHeight || innerHeight;
      const s = Math.max(vw / FRAME.w, vh / FRAME.h); // the frame is drawn with "slice", like cover
      const ox = (vw - FRAME.w * s) / 2 + CENTRE.x * s;
      const oy = (vh - FRAME.h * s) / 2 + CENTRE.y * s;
      const p = reduce.matches ? 1 : Math.min(1, Math.max(0, scrollY / (innerHeight * 0.9)));
      const t = 1 - (1 - p) ** 3; // ease-out
      el.style.transformOrigin = `${ox.toFixed(1)}px ${oy.toFixed(1)}px`;
      el.style.transform = `translateY(${(DROP * s * (1 - t)).toFixed(1)}px) scale(${(1 + GROW * (1 - t)).toFixed(4)})`;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    reduce.addEventListener("change", on);
    return () => {
      removeEventListener("scroll", on);
      removeEventListener("resize", on);
      reduce.removeEventListener("change", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={styles.backdrop} aria-hidden="true">
      <div className={styles.texture} />
      <svg ref={burst} className={styles.burst} viewBox={`0 0 ${FRAME.w} ${FRAME.h}`} preserveAspectRatio="xMidYMid slice">
        <path d={BURST} />
      </svg>
      {/* Printed-ink texture on the red (make-ink-texture.py): slow cloudy mottle, then fine speck. */}
      <div className={styles.inkMottle} />
      <div className={styles.inkSpeck} />
    </div>
  );
}
