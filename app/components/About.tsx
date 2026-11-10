"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { aboutLine, craftColumns, crafts, type Craft } from "../content/about";
import styles from "./About.module.css";

// Seconds per card-height of travel: the same pace in every column, whatever its length.
const PACE = 11;
const travel = (list: Craft[]) => list.reduce((s, c) => s + c.h / c.w, 0) * PACE;

// About. The line on the left; the craft cards drift upward in a seamless loop on the right (two
// columns in opposite directions; one column on phones). CSS keyframes on transform only: each
// track holds its list twice and moves by exactly one copy. It runs only while the section is on
// screen, pauses on hover or with the Pause button, and stands still under reduced motion.
export default function About() {
  const section = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  // One column or two, picked on the client so only one set of images loads. The reel keeps its
  // height until then, so nothing shifts.
  const [wide, setWide] = useState<boolean | null>(null);

  useEffect(() => {
    const sec = section.current;
    if (!sec) return;
    const io = new IntersectionObserver(([e]) => sec.toggleAttribute("data-on", e.isIntersecting));
    io.observe(sec);
    const mq = matchMedia("(min-width: 768px)");
    const pick = () => setWide(mq.matches);
    pick();
    mq.addEventListener("change", pick);
    return () => {
      io.disconnect();
      mq.removeEventListener("change", pick);
    };
  }, []);

  const track = (list: Craft[], key: string, sizes: string, reverse = false) => (
    <div key={key} className={styles.viewport}>
      <div
        className={`${styles.track} ${reverse ? styles.reverse : ""}`}
        style={{ "--dur": `${travel(list).toFixed(1)}s` } as CSSProperties}
      >
        {[0, 1].map((copy) => (
          <ul key={copy} className={styles.list} aria-hidden={copy === 1 || undefined} inert={copy === 1}>
            {list.map((c) => (
              <li key={c.src} className={styles.card}>
                <Image src={c.src} alt={copy ? "" : c.name} width={c.w} height={c.h} sizes={sizes} className={styles.art} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );

  return (
    <section
      ref={section}
      id="about"
      className={styles.about}
      data-paused={paused || undefined}
      aria-labelledby="about-title"
    >
      <div className={styles.text}>
        <h2 id="about-title" className="sr-only">
          About
        </h2>
        <p className={styles.line}>{aboutLine}</p>
        <button type="button" className={styles.pause} aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
          {paused ? "Play" : "Pause"}
        </button>
      </div>

      <div className={styles.reel}>
        {wide === false && track(crafts, "one", "88vw")}
        {wide &&
          craftColumns.map((list, i) =>
            track(list, i ? "right" : "left", "(max-width: 1023px) 44vw, (max-width: 1440px) 27vw, 390px", i === 1),
          )}
      </div>
    </section>
  );
}
