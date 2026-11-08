"use client";

import { useEffect, useRef } from "react";
import { crane } from "./crane";
import { frameAt, play } from "./fold";
import styles from "./Intro.module.css";

const K = { paper: styles.paper, shade: styles.shade, lite: styles.lite, crease: styles.crease, shadow: styles.shadow };
const SKIP_EVENTS = ["pointerdown", "wheel", "keydown", "touchmove"] as const;

// Gold square folds into a crane on cream, the sheet shrinks away, and the paper crane flies
// onto the origami crane in the hero art and becomes it. Once per session; any input skips.
export default function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const world = useRef<SVGGElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    // Too late (slow load) or not chosen by the inline script: never cover content.
    if (html.dataset.intro !== "play" || performance.now() > 4500) {
      html.dataset.intro = "done";
      return;
    }

    let over = false;
    const timers: number[] = [];
    let flight: Animation | null = null;

    // Cancel everything in flight (also React's dev double-mount cleanup: does not mark it seen).
    const cancel = () => {
      over = true;
      stop();
      flight?.cancel();
      timers.forEach(clearTimeout);
      SKIP_EVENTS.forEach((ev) => removeEventListener(ev, finish));
    };
    const finish = () => {
      if (over) return;
      cancel();
      html.dataset.intro = "done";
      try {
        sessionStorage.setItem("seen", "1");
      } catch {}
    };
    SKIP_EVENTS.forEach((ev) => addEventListener(ev, finish, { passive: true }));

    const fly = () => {
      const target = document.querySelector<HTMLElement>("[data-intro-target]");
      const w = wrap.current!, model = world.current!;
      root.current!.classList.add(styles.revealed);
      const to = target?.getBoundingClientRect();
      const from = model.getBoundingClientRect();
      if (!to || to.width === 0 || to.bottom < 0 || to.top > innerHeight) {
        timers.push(window.setTimeout(finish, 650));
        return;
      }
      const box = w.getBoundingClientRect();
      const cx = from.left + from.width / 2, cy = from.top + from.height / 2;
      const dx = to.left + to.width / 2 - cx, dy = to.top + to.height / 2 - cy;
      const s = (to.width / from.width + to.height / from.height) / 2;
      w.style.transformOrigin = `${cx - box.left}px ${cy - box.top}px`;
      const base = "translate(-50%, -50%)";
      flight = w.animate(
        [
          { transform: `${base} translate(0px, 0px) scale(1) rotate(0deg)` },
          { transform: `${base} translate(${dx * 0.45}px, ${dy * 0.45 - 70}px) scale(${(1 + s) / 2}) rotate(-6deg)`, offset: 0.45 },
          { transform: `${base} translate(${dx}px, ${dy}px) scale(${s}) rotate(0deg)` },
        ],
        { duration: 750, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" },
      );
      flight.onfinish = () => {
        // Land: the photo's crane fades in as the paper one fades out.
        html.dataset.intro = "landing";
        w.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 350, fill: "forwards" });
        timers.push(window.setTimeout(finish, 380));
      };
    };

    const stop = play(svg.current!, world.current!, crane, K, () => {
      timers.push(window.setTimeout(fly, 120));
    });
    if (process.env.NODE_ENV !== "production") {
      // Dev only: __introFrame(step, progress) freezes the intro on one frame for visual checks.
      (window as unknown as Record<string, unknown>).__introFrame = (i: number, e: number) => {
        cancel();
        frameAt(world.current!, crane, K, i, e);
      };
    }
    return cancel;
  }, []);

  return (
    <div ref={root} className={styles.loader} aria-hidden="true">
      <div className={styles.veil} />
      <div ref={wrap} className={styles.wrap}>
        <svg ref={svg} viewBox="0 0 200 200" focusable="false">
          <defs>
            <filter id="paperShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>
          {/* Flat square for first paint, before the script takes over. */}
          <g ref={world}>
            <polygon className={styles.paper} points="100,20 180,100 100,180 20,100" />
          </g>
        </svg>
      </div>
    </div>
  );
}
