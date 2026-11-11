"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./CaseBar.module.css";

// The case study's bar: a cream pill fixed at the top, like the home nav. "← Projects" goes back to
// the case study cards on home; each tab jumps to its section, and the tab of the section crossing
// the middle of the screen is marked as you scroll. On narrow screens the pill scrolls sideways and
// keeps the marked tab in view.
export default function CaseBar({
  tabs,
  spy,
}: {
  tabs: { id: string; label: string }[];
  /** Every section and the tab it marks (sections without a tab mark the one before them). */
  spy: { id: string; tab: string }[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const list = useRef<HTMLUListElement>(null);
  const locked = useRef(false); // while a clicked tab scrolls into view, ignore what it passes

  const select = (id: string) => {
    setActive(id);
    locked.current = true;
    const release = () => {
      locked.current = false;
      removeEventListener("scrollend", release);
      clearTimeout(timer);
    };
    addEventListener("scrollend", release);
    const timer = setTimeout(release, 1500); // where scrollend is missing
  };

  useEffect(() => {
    const tabOf = new Map(spy.map((s) => [s.id, s.tab]));
    const els = spy.map(({ id }) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        if (locked.current) return;
        for (const e of entries) if (e.isIntersecting) setActive(tabOf.get(e.target.id) ?? null);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [spy]);

  // Keep the marked tab inside the pill (it scrolls sideways on phones).
  useEffect(() => {
    const ul = list.current;
    const a = active ? ul?.querySelector<HTMLElement>(`[data-id="${active}"]`) : null;
    if (!ul || !a) return;
    // Centre it in the strip. The strip is the tab's offset parent (position: relative), so offsetLeft
    // is its place in the strip's content: it does not change while the strip is mid-scroll.
    const max = ul.scrollWidth - ul.clientWidth;
    const left = Math.min(max, Math.max(0, a.offsetLeft - (ul.clientWidth - a.offsetWidth) / 2));
    ul.scrollTo({ left, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [active]);

  return (
    <nav className={styles.bar} aria-label="Case study">
      <Link href="/#projects" className={styles.back}>
        <span aria-hidden="true">←</span> Projects
      </Link>
      <span className={styles.rule} aria-hidden="true" />
      <ul ref={list} className={styles.list}>
        {tabs.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              data-id={id}
              data-label={label}
              className={styles.tab}
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
