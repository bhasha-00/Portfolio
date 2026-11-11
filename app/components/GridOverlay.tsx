"use client";

// Dev-only: press G to show the column grid (tokens.css .container/.grid) and a 4px baseline.
// In the console, __gridAudit() lists visible text and images whose left edge is not on a column
// edge, or whose top is not on the 4px baseline. layout.tsx renders this in development only.
import { useEffect, useState } from "react";
import styles from "./GridOverlay.module.css";

const AUDITED = "h1, h2, h3, h4, p, li, a, button, img, figure, [class*='card'], [class*='tile']";

function columnEdges(): number[] {
  const probe = document.querySelector<HTMLElement>(`.${styles.columns} .grid`);
  if (!probe) return [];
  const edges: number[] = [];
  for (const col of Array.from(probe.children) as HTMLElement[]) {
    if (getComputedStyle(col).display === "none") continue; // beyond --cols
    const r = col.getBoundingClientRect();
    edges.push(r.left, r.right);
  }
  return edges;
}

function audit() {
  const edges = columnEdges();
  const out: { el: string; section: string; left: number; offBy: number; top: number; topMod4: number }[] = [];
  for (const el of Array.from(document.querySelectorAll<HTMLElement>(AUDITED))) {
    if (el.closest(`.${styles.columns}, [aria-hidden='true'], nav, [data-intro-layer], .sr-only`)) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0 || getComputedStyle(el).visibility === "hidden") continue;
    const offBy = Math.min(...edges.map((e) => Math.abs(e - r.left)));
    const top = r.top + window.scrollY;
    const topMod4 = Math.round((top % 4) * 10) / 10;
    if (offBy > 0.5 || (topMod4 > 0.5 && topMod4 < 3.5)) {
      out.push({
        el: `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : ""}`,
        section: el.closest("section")?.id || "(none)",
        left: Math.round(r.left * 10) / 10,
        offBy: Math.round(offBy * 10) / 10,
        top: Math.round(top),
        topMod4,
      });
    }
  }
  return out;
}

export default function GridOverlay() {
  const [on, setOn] = useState(false);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "g" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      setOn((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    (window as unknown as { __gridAudit: typeof audit }).__gridAudit = audit;
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // The baseline covers the whole document, so it stays put relative to the content when scrolling.
  useEffect(() => {
    if (!on) return;
    const measure = () => setHeight(document.documentElement.scrollHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, [on]);

  return (
    <>
      {/* Always laid out (just invisible) so __gridAudit can read the column edges. */}
      <div className={styles.columns} style={{ visibility: on ? "visible" : "hidden" }} aria-hidden="true">
        <div className="container grid">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className={styles.col} />
          ))}
        </div>
      </div>
      {on && <div className={styles.layer} style={{ height }} aria-hidden="true"><div className={styles.baseline} /></div>}
    </>
  );
}
