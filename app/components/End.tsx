"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { email, endLine, endTitle, linkedin } from "../content/end";
import styles from "./End.module.css";

// The end, from end II.svg: a square of real green paper in the middle ("Try a fold ?" in the
// designer's hand), the sign-off bottom-left over it, contact pills bottom-right. The paper settles
// in (lift and fade, transform and opacity only) when the section comes into view; the text never
// waits. Folding the paper comes later.
export default function End() {
  const section = useRef<HTMLElement>(null);

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
      <div className={styles.paper} aria-hidden="true">
        <div className={styles.sheet}>
          {/* The photo in the design file is only 451px across; swap in a larger one when it exists. */}
          <Image src="/end/paper.webp" alt="" width={451} height={451} className={styles.photo} unoptimized />
          <Image src="/end/try-a-fold.svg" alt="" width={651} height={651} className={styles.hand} unoptimized />
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
