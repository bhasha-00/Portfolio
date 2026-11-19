"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { sections } from "../sections";
import styles from "./Nav.module.css";

export default function Nav() {
  // No tab is marked while the hero is on screen: the nav lists the places to go, not the landing.
  const [active, setActive] = useState<string>("");
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
        for (const e of entries) {
          const id = e.target.id;
          if (e.isIntersecting) setActive(id);
          else setActive((a) => (a === id ? "" : a)); // left the middle with no section after it (back up to the hero)
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // The red pill slides to the active tab. It is two round caps and a middle strip, placed with
  // transforms only (CSS vars on .pill): the caps keep their round ends however wide the tab is.
  // It slides only between two tabs; arriving from none (the hero) it fades in where it lands.
  const list = useRef<HTMLUListElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const shown = useRef("");
  useLayoutEffect(() => {
    const ul = list.current;
    const el = pill.current;
    if (!ul || !el) return;
    const place = () => {
      const a = ul.querySelector<HTMLElement>(`a[href="#${active}"]`);
      if (!a) return;
      // Measured against the pill's own box (the nav), to the subpixel, so it sits exactly on the tab.
      const box = el.getBoundingClientRect();
      const r = a.getBoundingClientRect();
      const h = r.height;
      const l = r.left - box.left;
      el.style.setProperty("--l", `${l}px`);
      el.style.setProperty("--t", `${r.top - box.top}px`);
      el.style.setProperty("--h", `${h}px`);
      el.style.setProperty("--r", `${l + r.width - h}px`);
      el.style.setProperty("--m", `${Math.max(r.width - h, 0)}`);
    };
    const slide = shown.current !== "" && active !== "";
    if (!slide) el.dataset.still = "";
    place();
    shown.current = active;
    if (!slide) {
      void el.offsetWidth; // commit the jump before transitions come back
      delete el.dataset.still;
    }
    // Re-place (no slide) when the tabs change size: fonts loading, a rotated phone. Not on the
    // observer's first call, which comes right after observe() and would cut the slide short.
    let w = ul.offsetWidth;
    const ro = new ResizeObserver(() => {
      if (ul.offsetWidth === w) return;
      w = ul.offsetWidth;
      el.dataset.still = "";
      place();
      void el.offsetWidth;
      delete el.dataset.still;
    });
    ro.observe(ul);
    return () => ro.disconnect();
  }, [active]);

  return (
    <nav className={styles.nav} aria-label="Main">
      <span ref={pill} className={styles.pill} data-on={active ? "" : undefined} aria-hidden="true">
        <span className={styles.cap} />
        <span className={styles.mid} />
        <span className={`${styles.cap} ${styles.capEnd}`} />
      </span>
      <ul className={styles.list} ref={list}>
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={styles.link}
              aria-current={active === id ? "true" : undefined}
              onClick={() => select(id)}
            >
              <span className={styles.label}>{label}</span>
              <span className={styles.labelOn} aria-hidden="true">
                {label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
