"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { email, endLine, endTitle, linkedin, resume } from "../content/end";
import CrabFold from "./end/CrabFold";
import styles from "./End.module.css";

// Lucide "mail", "linkedin" and "download" (ISC), inline, drawn in the text colour.
function MailIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 15V3" />
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

// The end, from end II.svg: a square of real green paper in the middle ("Try a fold ?" in the
// designer's hand), the sign-off bottom-left over it, the contacts bottom-right: mail and LinkedIn as
// round icon buttons, the résumé as the one filled cream pill. The paper settles
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
    <section ref={section} id="end" className={`container ${styles.end}`} aria-labelledby="end-title">
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
          <li className={styles.item}>
            <a className={styles.iconLink} href={`mailto:${email}`} aria-label={`Email Bhasha: ${email}`} title={email}>
              <MailIcon />
            </a>
          </li>
          <li className={styles.item}>
            <a
              className={styles.iconLink}
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn (opens in a new tab)"
              title="LinkedIn"
            >
              <LinkedInIcon />
            </a>
          </li>
          <li className={styles.item}>
            <a className={styles.pill} href={resume.href} download={resume.file}>
              Résumé
              <DownloadIcon />
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
