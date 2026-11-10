"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { aboutLine, crafts } from "../content/about";
import styles from "./About.module.css";

// Seconds per card-height of travel, so the pace is the same at every screen size.
const PACE = 7;
const DURATION = crafts.reduce((s, c) => s + c.w / c.h, 0) * PACE;

// The cards are served as exported (3x, about 900KB for all six, lazy) rather than resized by
// next/image, so they stay sharp when zoomed: a resized copy only matches the screen's density.

// About, from about II.svg: the line centred, then one row of craft cards at the same height,
// drifting left in a seamless loop. CSS keyframes on transform only: the track holds the row twice
// and moves by exactly one copy. It runs only while the section is on screen, pauses on hover,
// focus or the Pause button, and under reduced motion becomes a still row you can swipe.
export default function About() {
  const section = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const sec = section.current;
    if (!sec) return;
    const io = new IntersectionObserver(([e]) => sec.toggleAttribute("data-on", e.isIntersecting));
    io.observe(sec);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={section}
      id="about"
      className={styles.about}
      data-paused={paused || undefined}
      aria-labelledby="about-title"
    >
      <h2 id="about-title" className="sr-only">
        About
      </h2>
      <p className={styles.line}>{aboutLine}</p>

      <div className={styles.viewport}>
        <div className={styles.track} style={{ "--dur": `${DURATION.toFixed(1)}s` } as CSSProperties}>
          {[0, 1].map((copy) => (
            <ul key={copy} className={styles.list} aria-hidden={copy === 1 || undefined} inert={copy === 1}>
              {crafts.map((c) => (
                <li key={c.src} className={styles.card} style={{ "--ratio": `${c.w} / ${c.h}` } as CSSProperties}>
                  <Image src={c.src} alt={copy ? "" : c.name} width={c.w} height={c.h} className={styles.art} unoptimized />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <button type="button" className={styles.pause} aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
        {paused ? "Play" : "Pause"}
      </button>
    </section>
  );
}
