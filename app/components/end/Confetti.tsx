"use client";

import { useEffect, useRef } from "react";
import styles from "./Confetti.module.css";

// A one-off burst of paper confetti when the crab is finished (CrabFold.tsx): small strips in
// vermilion, gold, cream and sand fly out from the middle of the paper, flutter (they flip over, as
// paper does) and drift down, with a few gold four-point sparkles popping in between. About 1.8s,
// then the layer is empty. Transform and opacity only (Web Animations). It never takes a tap, so the
// "fold again" button works throughout. The parent mounts it only when motion is allowed.
const STRIPS = 44;
const SPARKS = 8;
const TONES = [styles.vermilion, styles.gold, styles.cream, styles.sand];
const r = (a: number, b: number) => a + Math.random() * (b - a);

export default function Confetti() {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const size = el.getBoundingClientRect().width || 300; // the paper square: the burst scales with it
    const anims: Animation[] = [];

    for (let k = 0; k < STRIPS; k++) {
      const s = document.createElement("span");
      s.className = `${styles.strip} ${TONES[k % TONES.length]}`;
      s.style.width = `${r(8, 14).toFixed(1)}px`;
      s.style.height = `${r(4, 6).toFixed(1)}px`;
      el.appendChild(s);
      // Out on a spread biased upward, then a fall a little wider than the throw.
      const a = r(-Math.PI, 0) + r(-0.5, 0.5);
      const d = size * r(0.35, 0.9);
      const x = Math.cos(a) * d, y = Math.sin(a) * d;
      const fall = size * r(0.5, 0.9), drift = x * 0.25 + r(-20, 20);
      const turn = r(-540, 540);
      const dur = r(1500, 2000);
      anims.push(
        s.animate(
          [
            // Burst out fast and slow to the top of the throw, then flutter (flip over) on the way
            // down, speeding up a little as it falls, and fade only in the last stretch.
            { transform: "translate(-50%,-50%) translate(0,0) rotate(0deg) scale(0.4,0.4)", opacity: 1, offset: 0, easing: "cubic-bezier(0.16,1,0.3,1)" },
            { transform: `translate(-50%,-50%) translate(${x}px,${y}px) rotate(${turn * 0.35}deg) scale(1,1)`, opacity: 1, offset: 0.3, easing: "cubic-bezier(0.45,0,0.55,1)" },
            { transform: `translate(-50%,-50%) translate(${x + drift * 0.5}px,${y + fall * 0.45}px) rotate(${turn * 0.65}deg) scale(-1,1)`, opacity: 1, offset: 0.65, easing: "cubic-bezier(0.4,0,1,1)" },
            { transform: `translate(-50%,-50%) translate(${x + drift}px,${y + fall}px) rotate(${turn}deg) scale(1,1)`, opacity: 0, offset: 1 },
          ],
          { duration: dur, delay: r(0, 90), fill: "both" },
        ),
      );
    }

    for (let k = 0; k < SPARKS; k++) {
      const s = document.createElement("span");
      s.className = styles.spark;
      const big = k < 2;
      s.style.width = s.style.height = `${big ? r(26, 34) : r(12, 20)}px`;
      const a = r(-Math.PI, Math.PI), d = size * r(0.3, 0.85);
      s.style.left = `calc(50% + ${(Math.cos(a) * d).toFixed(1)}px)`;
      s.style.top = `calc(50% + ${(Math.sin(a) * d * 0.8).toFixed(1)}px)`;
      el.appendChild(s);
      anims.push(
        s.animate(
          [
            { transform: "translate(-50%,-50%) scale(0) rotate(0deg)", opacity: 0, easing: "cubic-bezier(0.16,1,0.3,1)" },
            { transform: "translate(-50%,-50%) scale(1) rotate(20deg)", opacity: 1, offset: 0.35, easing: "cubic-bezier(0.4,0,1,1)" },
            { transform: "translate(-50%,-50%) scale(0) rotate(45deg)", opacity: 0 },
          ],
          { duration: r(700, 1000), delay: r(80, 700), fill: "both" },
        ),
      );
    }

    // Empty the layer once everything has landed.
    Promise.all(anims.map((x) => x.finished)).then(
      () => el.replaceChildren(),
      () => {},
    );
    return () => {
      anims.forEach((x) => x.cancel());
      el.replaceChildren();
    };
  }, []);

  return <div ref={box} className={styles.layer} aria-hidden="true" />;
}
