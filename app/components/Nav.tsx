"use client";

import { useEffect, useRef, useState } from "react";
import { sections } from "../sections";
import styles from "./Nav.module.css";

export default function Nav() {
  const [active, setActive] = useState<string>(sections[0].id);
  // While a clicked tab scrolls into view, ignore the sections it passes.
  const locked = useRef(false);

  const select = (id: string) => {
    setActive(id);
    locked.current = true;
    const release = () => {
      locked.current = false;
      window.removeEventListener("scrollend", release);
      clearTimeout(timer);
    };
    window.addEventListener("scrollend", release);
    const timer = setTimeout(release, 1500); // fallback where scrollend is missing
  };

  // Mark the tab whose section crosses the middle of the viewport.
  useEffect(() => {
    const els = sections
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const io = new IntersectionObserver(
      (entries) => {
        if (locked.current) return;
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav className={styles.nav} aria-label="Main">
      <ul className={styles.list}>
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={styles.link}
              aria-current={active === id ? "true" : undefined}
              onClick={() => select(id)}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
