"use client";

import Image, { getImageProps } from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { aboutHead, aboutLine, crafts, HAND_H, slots } from "../content/about";
import { ROLE, roleOf, useSpread } from "./useSpread";
import spread from "./Spread.module.css";
import styles from "./About.module.css";

// A word in Bhasha's handwriting: her outline as a mask, filled with the text colour (a token), so
// it stays sharp and takes the colour of where it sits. Decorative: the words are given as text too.
function Hand({ src, w, className }: { src: string; w: number; className: string }) {
  return (
    <span
      className={className}
      style={{ "--src": `url("${src}")`, "--ratio": `${w} / ${HAND_H}` } as CSSProperties}
      aria-hidden="true"
    />
  );
}

const TABLET = "(min-width: 768px) and (max-width: 1199px)"; // pinned fan; desktop is a plain row
const ROW = "(min-width: 1200px)";
const EVERY = 3200; // ms between automatic flips (one side card at a time, in turn)
const SIZES = "(max-width: 767px) 80vw, 440px"; // rendered photo width, for next/image

// Each slot has two faces; `turns` counts half-turns, so the face showing is a on even, b on odd.
type Faces = { a: number; b: number; turns: number };
const showing = (f: Faces) => (f.turns % 2 ? f.b : f.a);

// About: the three-card spread (useSpread) as in About.svg, under the line. Clicking, tapping or
// swiping to a side card brings it to the front; clicking the front card flips it over (rotateY,
// transform only) to another piece. Every few seconds one of the side cards flips by itself. Reduced
// motion: no fan and no automatic flips; a tap swaps the card without turning it.
export default function About() {
  const { section, stage, slots: slotEls, front, bring, settled, stageProps, swiped, zOf } = useSpread(slots, TABLET);
  const hovered = useRef<boolean[]>(slots.map(() => false));
  const touched = useRef<number[]>(slots.map(() => 0)); // last manual flip, per slot
  const inView = useRef(false);
  const frontRef = useRef(front);
  frontRef.current = front;
  // Desktop: the three cards scattered beside the text, each of them flips when clicked.
  const [row, setRow] = useState(false);
  const rowRef = useRef(row);
  rowRef.current = row;
  useEffect(() => {
    const mq = matchMedia(ROW);
    const on = () => setRow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const [faces, setFaces] = useState<Faces[]>(() => slots.map((s) => ({ a: s.first, b: s.first, turns: 0 })));

  // Turn slot i over, revealing the next piece that no other slot is showing.
  const flip = useCallback((i: number) => {
    setFaces((prev) => {
      const f = prev[i];
      const others = prev.filter((_, j) => j !== i).map(showing);
      const at = showing(f);
      const pool = crafts.map((_, k) => k);
      const next = [...pool.slice(at + 1), ...pool.slice(0, at)].find((k) => !others.includes(k));
      if (next === undefined) return prev;
      const turned = f.turns % 2 ? { ...f, a: next } : { ...f, b: next }; // load the hidden face
      return prev.map((g, j) => (j === i ? { ...turned, turns: f.turns + 1 } : g));
    });
  }, []);

  // Automatic flips: one side card at a time, only while the spread is on screen and settled. A card
  // being hovered, or flipped by hand in the last few seconds, is skipped.
  // All five photos load once the section is two screens away: the three a first visit sees first,
  // then the rest, so the spread is crisp on arrival and a flip never shows a blank face.
  useEffect(() => {
    const sec = section.current;
    if (!sec) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const io = new IntersectionObserver(([e]) => (inView.current = e.isIntersecting), { rootMargin: "50% 0px" });
    const early = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        early.disconnect();
        const first = new Set(slots.map((s) => s.first));
        const order = [...crafts.keys()].sort((x, y) => Number(first.has(y)) - Number(first.has(x)));
        order.forEach((k) => {
          // The same optimised file the card will ask for (srcset + sizes), so a flip finds it cached.
          const c = crafts[k];
          const { props } = getImageProps({ src: c.src, alt: "", width: c.w, height: c.h, sizes: SIZES });
          const im = new window.Image();
          im.fetchPriority = first.has(k) ? "high" : "low";
          if (props.sizes) im.sizes = props.sizes;
          if (props.srcSet) im.srcset = props.srcSet;
          im.src = props.src;
        });
      },
      { rootMargin: "200% 0px" },
    );
    io.observe(sec);
    early.observe(sec);
    let next = 0;
    const timer = setInterval(() => {
      if (!inView.current || !settled.current || reduce.matches || document.hidden) return;
      // The next side card in turn (the front card only flips when clicked).
      let i = next;
      if (!rowRef.current && roleOf(i, frontRef.current) === 0) i = (i + 1) % slots.length;
      next = (i + 1) % slots.length;
      if (hovered.current[i] || Date.now() - touched.current[i] < EVERY * 2) return;
      flip(i);
    }, EVERY);
    return () => {
      io.disconnect();
      early.disconnect();
      clearInterval(timer);
    };
  }, [flip, section, settled]);

  return (
    <section ref={section} id="about" className={`${spread.clip} ${styles.about}`} aria-labelledby="about-title">
      <div className={`container ${spread.frame} ${styles.pin}`}>
        <div className={styles.text}>
          <p className={styles.eyebrow}>{aboutHead.eyebrow}</p>
          <h2 id="about-title" className={styles.line}>
            {aboutLine}
          </h2>
          <p className={styles.body}>{aboutHead.text}</p>
          <p className={styles.tag}>{aboutHead.tag}</p>
        </div>
        <div ref={stage} className={`${spread.stage} ${styles.stage}`} {...stageProps}>
          {slots.map((s, i) => {
            const f = faces[i];
            const now = crafts[showing(f)];
            const isFront = row || roleOf(i, front) === 0;
            return (
              <div
                key={i}
                ref={(el) => {
                  slotEls.current[i] = el;
                }}
                className={spread.slot}
                style={{ zIndex: zOf(i) }}
                onPointerEnter={() => (hovered.current[i] = true)}
                onPointerLeave={() => (hovered.current[i] = false)}
              >
                <div className={spread.pos} data-role={ROLE[roleOf(i, front)]}>
                  <button
                    type="button"
                    className={styles.card}
                    aria-label={isFront ? `${now.name}. Flip to see another piece` : `Bring ${now.name} to the front`}
                    onClick={() => {
                      if (swiped()) return;
                      if (!isFront) return bring(i);
                      touched.current[i] = Date.now();
                      flip(i);
                    }}
                  >
                    <span className={styles.flipper} style={{ transform: `rotateY(${f.turns * 180}deg)` }}>
                      {/* Each face is one card: the photo, then its caption chip. */}
                      {(["a", "b"] as const).map((k) => {
                        const c = crafts[f[k]];
                        return (
                          <span key={k} className={`${styles.face} ${k === "b" ? styles.back : ""}`} aria-hidden="true">
                            <span className={`${styles.media} ${c.cutout ? styles.cutout : ""}`}>
                              <Image
                                src={c.src}
                                alt=""
                                fill
                                sizes={SIZES}
                                quality={80}
                                className={styles.photo}
                                style={c.focus ? { objectPosition: c.focus } : undefined}
                              />
                            </span>
                            <span className={styles.chip}>
                              <Hand src={c.hand.src} w={c.hand.w} className={styles.chipHand} />
                            </span>
                          </span>
                        );
                      })}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
