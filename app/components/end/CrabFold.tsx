"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { buildStep, ease, flatten, type Classes, type Poly } from "../intro/fold";
import { centreY, crabStart, crabSteps, restAfter } from "./crab";
import styles from "./CrabFold.module.css";

const N = crabSteps.length;
const K: Classes = {
  paper: styles.face,
  shade: styles.shade,
  lite: styles.lite,
  edge: styles.edge,
  crease: styles.crease,
  shadow: styles.shadow,
};
const rest = (i: number): Poly[] => (i < 0 ? crabStart : restAfter(i, flatten));
// Haptics on the green: a short tick when the outlined part is tapped, a softer double tick on a
// miss. Phones that cannot vibrate (iOS Safari, desktops) just skip it.
const buzz = (p: number | number[]) => {
  try {
    navigator.vibrate?.(p);
  } catch {}
};
const pts = (p: [number, number][]) => p.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

// The click-to-fold crab on the End section's green paper. No words: the part to fold next is
// outlined in ink and gently pulses; clicking it plays that fold. A click anywhere else on the
// paper nudges it. Keyboard: the paper is one button; Enter or Space folds the outlined part.
// Motion is transform and opacity only (the intro's fold engine). Reduced motion: each fold lands
// at once. When the crab is done, a small round button folds a fresh sheet.
export default function CrabFold({ onReset }: { onReset: () => void }) {
  const world = useRef<SVGGElement>(null); // the paper being folded
  const flip = useRef<SVGGElement>(null); // squashed through edge-on to turn the paper over
  const ghost = useRef<SVGGElement>(null); // the old shape, fading out under a collapse
  const [i, setI] = useState(0); // next step to fold; N when the crab is done
  const [lift, setLift] = useState(centreY(crabStart));
  const [nudge, setNudge] = useState(0);
  const [playing, setPlaying] = useState(false); // a fold is moving: no outline, no lift
  const busy = useRef(false);
  const reduce = useRef(false);

  const still = useCallback((g: SVGGElement | null, polys: Poly[]) => {
    if (g) buildStep(g, { d: 0, base: polys, o0: [0, 0], o1: [0, 0] }, K).update(0);
  }, []);

  useEffect(() => {
    reduce.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    still(world.current, crabStart);
  }, [still]);

  const animate = (d: number, f: (e: number) => void) =>
    new Promise<void>((done) => {
      if (reduce.current) {
        f(1);
        return done();
      }
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / (d * 1000));
        f(t);
        if (t < 1) requestAnimationFrame(tick);
        else done();
      };
      requestAnimationFrame(tick);
    });

  const fold = useCallback(async () => {
    if (busy.current || i >= N) return;
    busy.current = true;
    setPlaying(true);
    const s = crabSteps[i], w = world.current!, end = rest(i);
    if (s.kind === "fold") {
      const live = buildStep(w, s.step, K);
      await animate(s.step.d, (t) => live.update(ease(t)));
    } else if (s.kind === "pop") {
      // A collapse: the new shape fades in over the old one.
      const g = ghost.current!;
      g.replaceChildren(...Array.from(w.childNodes).map((n) => n.cloneNode(true)));
      still(w, s.to);
      await animate(0.45, (t) => {
        g.style.opacity = String(1 - t);
        w.style.opacity = String(t);
      });
      g.replaceChildren();
    } else {
      // Turn over: squash to edge-on, swap to the other side, open out again.
      const fl = flip.current!;
      let swapped = false;
      await animate(0.7, (t) => {
        const e = ease(t), sx = Math.cos(Math.PI * e);
        if (!swapped && e >= 0.5) {
          swapped = true;
          still(w, s.to);
        }
        fl.style.transform = `translate(100px,0) scale(${Math.max(Math.abs(sx), 0.02)},1) translate(-100px,0)`;
      });
      fl.style.transform = "";
    }
    still(w, end);
    w.style.opacity = "1";
    setLift(centreY(end));
    setI(i + 1);
    setPlaying(false);
    busy.current = false;
  }, [i, still]);

  const onClick = (e: MouseEvent<SVGSVGElement>) => {
    if (busy.current || i >= N) return;
    if ((e.target as Element).getAttribute("data-target") !== null) {
      buzz(12);
      fold();
    } else {
      buzz([6, 50, 6]);
      setNudge((n) => n + 1); // missed: a small shake toward "try the outline"
    }
  };
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fold();
    }
  };

  const target = i < N && !playing ? crabSteps[i].target : null;
  return (
    <div className={styles.fold} data-nudge={nudge % 2 ? "a" : nudge ? "b" : undefined}>
      <svg
        className={styles.svg}
        viewBox="20 20 160 160"
        role="button"
        tabIndex={0}
        aria-label={i < N ? `Fold the paper: step ${i + 1} of ${N}` : "A paper crab"}
        aria-disabled={i >= N || undefined}
        onClick={onClick}
        onKeyDown={onKey}
      >
        <defs>
          {/* The same green paper photo the sheet showed, so the first frame matches it exactly. */}
          <pattern id="crab-paper" patternUnits="userSpaceOnUse" x="20" y="20" width="160" height="160">
            <image href="/end/paper.webp" width="160" height="160" preserveAspectRatio="none" />
          </pattern>
        </defs>
        <g className={styles.lift} style={{ transform: `translate(0px,${lift}px)` }}>
          <g ref={ghost} />
          <g ref={flip}>
            <g ref={world} />
          </g>
          {target && <polygon className={styles.target} data-target="" points={pts(target)} />}
        </g>
      </svg>
      <p className="sr-only" aria-live="polite">
        {i === 0 ? "" : i < N ? `Step ${i + 1} of ${N}.` : "Done: a paper crab."}
      </p>
      {i >= N && (
        <button type="button" className={styles.again} aria-label="Fold again" onClick={onReset}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v4.5h4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
