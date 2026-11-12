"use client";

import { ROLE, roleOf, useSpread } from "../../useSpread";
import spread from "../../Spread.module.css";
import styles from "./Tldr.module.css";

// TL;DR: Problem, What I did, Impact (1tldr.svg), set in Geist. On phones the three cards are the AI
// Tinkering spread (useSpread): one in front, the other two tucked behind on either side; a tap or a
// swipe brings one forward. From 768 they sit in a row, as in her frame.

const cards = [
  {
    tone: "problem",
    label: "Problem",
    body: (
      <>
        <p className={styles.big}>Librarians typed every book by hand</p>
        <p>300-400 books a batch, 5-10 minutes per title. Incomplete records broke search.</p>
      </>
    ),
  },
  {
    tone: "did",
    label: "What I did",
    body: (
      <>
        <p className={styles.ink}>Interviewed librarians to map workflows and identify friction points.</p>
        <p className={styles.ink}>Reimagined 7 cataloguing workflows into a unified scan-and-confirm flow.</p>
        <p className={styles.ink}>Documented duplicates, empty and errors states for handoff.</p>
      </>
    ),
  },
  {
    tone: "impact",
    label: "Impact",
    body: (
      <>
        <p className={styles.big}>~60-70%</p>
        <p>less manual entry per title</p>
      </>
    ),
  },
] as const;

const fan = [
  { swing: 0, tilt: -4 },
  { swing: 0, tilt: 3 },
  { swing: 0, tilt: 5 },
];

export default function Tldr() {
  const { section, stage, slots, front, bring, stageProps, swiped, zOf } = useSpread(fan);
  return (
    <section ref={section} className={`${spread.clip} ${styles.wrap}`} aria-label="TL;DR">
      <div className={spread.frame}>
        <div
          ref={stage}
          className={`${spread.stage} ${styles.stage}`}
          tabIndex={0}
          aria-label="Three cards; left and right arrow keys bring the next one forward"
          {...stageProps}
        >
          {cards.map((c, i) => {
            const role = roleOf(i, front);
            return (
              <div
                key={c.label}
                ref={(el) => {
                  slots.current[i] = el;
                }}
                className={`${spread.slot} ${styles.slot}`}
                style={{ zIndex: zOf(i) }}
                onClick={() => {
                  if (!swiped() && role !== 0) bring(i);
                }}
              >
                <div className={`${spread.pos} ${styles.pos}`} data-role={ROLE[role]}>
                  <article className={styles.card} data-tone={c.tone} data-front={role === 0 || undefined}>
                    <h3 className={styles.label}>{c.label}</h3>
                    {c.body}
                  </article>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
