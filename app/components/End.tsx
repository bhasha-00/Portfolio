"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { email, endLine, endTitle, linkedin } from "../content/end";
import CrabFold from "./end/CrabFold";
import styles from "./End.module.css";

// The end, from end II.svg: a square of real green paper in the middle ("Try a fold ?" in the
// designer's hand), the sign-off bottom-left over it, contact pills bottom-right. The paper settles
// in (lift and fade, transform and opacity only) when the section comes into view; the text never
// waits. A click or tap on the paper (or Enter / Space) starts the fold: the handwriting goes, and
// the paper guides a crab one outlined part at a time (end/CrabFold.tsx).
export default function End() {
  const section = useRef<HTMLElement>(null);
  const [folding, setFolding] = useState(false);
  const [round, setRound] = useState(0); // a fresh sheet each time

  useEffect(() => {
    const sec = section.current;
    if (!sec) return;
    sec.setAttribute("data-ready", "");
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          sec.setAttribute("data-in", "");
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(sec);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={section} id="end" className={styles.end} aria-labelledby="end-title">
      <div className={styles.paper}>
        <div className={styles.sheet} data-folding={folding || undefined}>
          {/* Before the first click the sheet is one button: "Try a fold". */}
          <button
            type="button"
            className={styles.start}
            aria-label="Try a fold: fold a paper crab, one part at a time"
            onClick={() => setFolding(true)}
            tabIndex={folding ? -1 : 0}
            aria-hidden={folding || undefined}
          >
            {/* The photo in the design file is only 451px across; swap in a larger one when it exists. */}
            <Image src="/end/paper.webp" alt="" width={451} height={451} className={styles.photo} unoptimized />
            <Image src="/end/try-a-fold.svg" alt="" width={651} height={651} className={styles.hand} unoptimized />
          </button>
          {folding && (
            <CrabFold
              key={round}
              onReset={() => {
                setFolding(false);
                setRound((r) => r + 1);
              }}
            />
          )}
        </div>
      </div>

      <div className={styles.foot}>
        <div className={styles.text}>
          <h2 id="end-title" className={styles.title}>
            {endTitle}
          </h2>
          <p className={styles.line}>{endLine}</p>
        </div>
        <ul className={styles.links}>
          <li>
            <a className={styles.pill} href={`mailto:${email}`}>
              {email}
            </a>
          </li>
          <li>
            <a className={`${styles.pill} ${styles.underline}`} href={linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
