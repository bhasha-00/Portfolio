"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { frameAt, play, type Classes, type Step } from "../intro/fold";
import { SHAPES, sequences, unfold } from "./shapes";
import { getShape, setShape, subscribe } from "./store";
import styles from "./Origami.module.css";

const base = { shade: styles.shade, lite: styles.lite, edge: styles.edge, crease: styles.crease, shadow: styles.shadow };
/** Paper colour per shape: gold crane, white rabbit, lime parrot. */
const K: Classes[] = [
  { ...base, paper: styles.gold },
  { ...base, paper: styles.white },
  { ...base, paper: styles.lime },
];
const UNFOLD = 0.5; // unfolding runs at half the folding sequence's time
const FOLD = 0.6;
const seconds = (steps: Step[]) => steps.reduce((t, s) => t + s.d, 0);
const NAMES = ["paper crane", "paper rabbit", "paper parrot"];

// One companion, drawn in several places (hero, cards, AI): only one refold runs at a time. Starting
// one halts any other in progress, counting its shape as reached.
const halts = new Set<() => void>();

/** Ask the companion inside `target` to refold into shape `to` (an index of SHAPES), taking about
 *  `seconds` in all. The crane route uses it: the crane becomes a parrot on its way to AI Tinkering. */
export const REFOLD = "companion:refold";
export type RefoldDetail = { target: Element; to: number; seconds?: number };

// The companion: tap (or Enter / Space) and the paper unfolds back to a square, then folds into the
// next shape: crane → rabbit → parrot → crane. The crane route can also ask for a shape (REFOLD). `children` is the crane illustration; the rabbit and
// parrot are drawn by the fold engine. Transform and opacity only. Reduced motion: instant swap.
export default function Origami({ className, children }: { className?: string; children: ReactNode }) {
  const shape = useSyncExternalStore(subscribe, getShape, () => 0);
  const svg = useRef<SVGSVGElement>(null);
  const world = useRef<SVGGElement>(null);
  const art = useRef<HTMLSpanElement>(null);
  const root = useRef<HTMLSpanElement>(null);
  const run = useRef<{ to: number; stop: () => void } | null>(null);

  // At rest: the crane illustration, or the last frame of the rabbit's / parrot's folds.
  const rest = (i: number) => {
    const s = svg.current, w = world.current, r = art.current;
    if (!s || !w || !r) return;
    // Only the live drawing belongs here: drop any crossfade copy an interrupted fold left behind.
    [...s.children].forEach((el) => el !== w && el.remove());
    w.style.opacity = "1";
    s.style.transition = r.style.transition = "none";
    s.style.transform = "";
    if (i === 0) {
      w.replaceChildren();
      s.style.opacity = "0";
      r.style.opacity = "1";
    } else {
      const seq = sequences[i];
      frameAt(w, seq, K[i], seq.length - 1, 1);
      s.style.opacity = "1";
      r.style.opacity = "0";
    }
  };

  useEffect(() => {
    if (!run.current) rest(shape);
  }, [shape]);

  // The crane route asks for a shape by event; only the companion inside its target answers.
  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<RefoldDetail>).detail;
      if (root.current && d.target.contains(root.current)) refold(d.to, d.seconds);
    };
    addEventListener(REFOLD, on);
    return () => removeEventListener(REFOLD, on);
  });

  useEffect(
    () => () => {
      run.current?.stop();
      delete document.documentElement.dataset.folding;
    },
    [],
  );

  // Stop this companion's refold, if any, and settle on the shape it was heading for.
  const halt = () => {
    if (!run.current) return;
    const t = run.current.to;
    run.current.stop();
    run.current = null;
    setShape(t);
    rest(t);
  };
  useEffect(() => {
    halts.add(halt);
    return () => {
      halts.delete(halt);
    };
  });

  // A tap: the next shape. A refold already under way counts as reached, and goes on from there.
  const next = () => refold((run.current ? run.current.to : getShape()) + 1);

  // Unfold to the square, then fold into shape `target`. `total`: squeeze both into that many seconds.
  const refold = (target: number, total?: number) => {
    halts.forEach((h) => h !== halt && h());
    let from = getShape();
    if (run.current) {
      from = run.current.to;
      run.current.stop();
      run.current = null;
      setShape(from);
      rest(from);
    }
    const to = target % SHAPES.length;
    if (to === from) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShape(to);
      rest(to);
      return;
    }

    const s = svg.current!, w = world.current!, r = art.current!;
    // While the paper is moving there is no landing shadow; it returns once the shape sits.
    document.documentElement.dataset.folding = "";
    let out = unfold(sequences[from]).map((st) => ({ ...st, d: st.d * UNFOLD }));
    // The first fold crossfades the paper colour (the square changes paper).
    let up = sequences[to].map((st, i) => ({ ...st, d: st.d * FOLD, pop: i === 0 || st.pop }));
    if (total) {
      const f = total / (seconds(out) + seconds(up));
      out = out.map((st) => ({ ...st, d: st.d * f }));
      up = up.map((st) => ({ ...st, d: st.d * f }));
    }
    const tOut = seconds(out), tUp = seconds(up);
    const timers: number[] = [];
    let cancel = () => {};

    // Start from the finished shape, drawn in paper (the crane illustration hands over to it).
    frameAt(w, sequences[from], K[from], sequences[from].length - 1, 1);
    s.style.transition = "none";
    s.style.opacity = "1";
    r.style.transition = "opacity var(--dur-fast) var(--ease-out)";
    r.style.opacity = "0";
    // Lift the paper while it is open, so the flat square floats above the perch, not over it.
    s.getBoundingClientRect();
    s.style.transition = `transform ${tOut}s var(--ease-in-out)`;
    s.style.transform = "translateY(-32%)"; // about 64 grid units: the open square clears the foot line

    cancel = play(s, w, out, K[from], () => {
      s.style.transition = `transform ${tUp}s var(--ease-in-out)`;
      s.style.transform = "";
      cancel = play(s, w, up, K[to], () => {
        if (to === 0) {
          // The folded crane opens into the illustration.
          r.style.transition = "opacity var(--dur-base) var(--ease-out)";
          r.style.opacity = "1";
          s.style.transition = "opacity var(--dur-base) var(--ease-out)";
          s.style.opacity = "0";
        }
        timers.push(
          window.setTimeout(() => {
            if (run.current?.to !== to) return;
            run.current = null;
            delete document.documentElement.dataset.folding;
            setShape(to);
          }, 260),
        );
      });
    });
    run.current = {
      to,
      stop: () => {
        cancel();
        timers.forEach(clearTimeout);
      },
    };
  };

  return (
    <span ref={root} className={`${styles.root} ${className ?? ""}`}>
      <span ref={art} className={styles.art}>
        {children}
      </span>
      <svg ref={svg} className={styles.svg} viewBox="0 0 200 200" aria-hidden="true">
        <g ref={world} />
      </svg>
      <button
        type="button"
        className={styles.hit}
        onClick={next}
        aria-label={`Refold the ${NAMES[shape]} into the ${NAMES[(shape + 1) % SHAPES.length]}`}
      />
    </span>
  );
}
