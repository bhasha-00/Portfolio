"use client";

import { useEffect, useRef } from "react";
import styles from "./Backdrop.module.css";

// The page background, from bg.svg (1522 × 768): red, two halftone plates (pre-composited into
// public/bg/texture.webp, kept pixelated) and a light "burst" shape. It is fixed: everything scrolls
// over it. On arrival the burst sits low and a touch larger (as home.svg: its centre 261.5 units
// lower, 7.6% bigger); over the first screen of scrolling it rises to the centre (as bg.svg) and
// stays. Transform only. Reduced motion: it starts centred and never moves.
const FRAME = { w: 1522, h: 768 };
const CENTRE = { x: 781, y: 368 }; // the burst's centre in bg.svg
const DROP = 261.5; // how much lower it starts (home.svg), in frame units
const GROW = 0.076; // how much larger it starts

const BURST =
  "M-66.2352 507.039C60.1046 480.71 284.961 363.786 173.668 106.719C241.794 187.965 409.653 301.268 536.078 104.508C760.984 123.914 765.906 33.9258 739.05 -16.7349C738.39 -17.9179 737.737 -19.0947 737.091 -20.2651C737.76 -19.1117 738.414 -17.9343 739.05 -16.7349C817.173 123.245 998.461 349.593 1114.87 161.137C1320.43 281.597 1466.26 192.591 1531.9 112.064C1539.45 100.741 1547.01 89.9251 1554.45 79.7569C1548.5 89.9814 1540.96 100.942 1531.9 112.064C1426.77 269.768 1325.47 525.756 1631.91 498.175C1465.69 528.738 1108.36 621.305 1008.86 747.064C990.006 683.363 897.786 586.209 679.762 707.202C667.505 664.117 612.54 604.245 490.74 709.44C463.815 633.374 361.135 517.873 165.818 664.395C193.672 615.984 186.258 516.736 -66.2352 507.039Z";

export default function Backdrop() {
  const burst = useRef<SVGSVGElement>(null);
  const root = useRef<HTMLDivElement>(null);

  // The texture loads once the page has (see Backdrop.module.css).
  useEffect(() => {
    const ready = () => root.current?.setAttribute("data-ready", "");
    if (document.readyState === "complete") ready();
    else addEventListener("load", ready, { once: true });
    return () => removeEventListener("load", ready);
  }, []);

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
    <div ref={root} className={styles.backdrop} aria-hidden="true">
      <div className={styles.texture} />
      <svg ref={burst} className={styles.burst} viewBox={`0 0 ${FRAME.w} ${FRAME.h}`} preserveAspectRatio="xMidYMid slice">
        <path d={BURST} />
      </svg>
    </div>
  );
}
