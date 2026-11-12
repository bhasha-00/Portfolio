"use client";

import { useEffect, useRef } from "react";
import { rich } from "../../rich";
import styles from "./Synthesis.module.css";

// Research › What I understood: one frame, two artifacts, in her colours. It pins in the screen with her
// synthesis table on its face (1synthesis a.svg: the first rows, cut by the frame); as you scroll it
// flips over like a card to the two findings on its back (1synthesis b.svg). Scrubbed by scroll,
// transform only. Reduced motion: no pin, no flip; one after the other.

// The rows her frame shows at first glance (the frame cuts the table there).
const rows: [string, string, string, string, string][] = [
  ["Entering Title Management", "Catalogue opens directly into New Title. Users must already know their intended route.", "Adds onboarding, an overview, and visible New Title, Update Title, Generate Label, Add Copy and Bulk Import actions.", "The populated overview emphasises counts and a chart. Their usefulness for starting everyday work is not established.", "Explore a task-focused landing state with recent records and clear entry actions. Retain metrics where they support a specific decision."],
  ["Bibliographic entry", "Long scrolling form; cover/media is a separate stage. Interviews report substantial manual effort.", "Combines cover and bibliographic details; introduces a compact Linear view alongside MARC.", "Required markers appear inconsistent across shown states. “Linear” may not explain the mode to users.", "Clarify required fields and group related information. Test a clearer mode label, such as “Standard form,” while retaining MARC access. Confirm field requirements first."],
  ["ISBN retrieval", "Interviews report incomplete records and missing covers. The recording does not demonstrate retrieval end to end.", "Shows a no-data message and suggests manual entry or another server.", "No-result, invalid ISBN, unavailable source, and partial metadata need distinct handling. Partial-result review is not clearly shown.", "Show what was retrieved, what remains incomplete, and a clear next action. Preserve entered information when trying another source."],
  ["Duplicate checking", "Team notes confirm it exists; its complete behaviour is not demonstrated in the recording.", "Shows duplicate candidates with Update Title, Add Copy and Add as New Edition options.", "“Duplicate Titles found” may sound conclusive when records could represent different editions. Selection and choice consequences need clarity.", "Present “Possible matching titles,” with edition, publisher, year and ISBN for comparison. Explain when to add a copy, edit a record, or create another edition."],
];

// Her icons, redrawn from her export (colours hers).
const Ask = () => (
  <svg className={styles.icon} viewBox="76 79 22 22" aria-hidden="true">
    <path d="M78.8492 86.6191C78.7033 85.9616 78.7257 85.278 78.9144 84.6315C79.1031 83.985 79.452 83.3966 79.9287 82.9208C80.4054 82.4451 80.9945 82.0975 81.6414 81.9101C82.2883 81.7228 82.972 81.7018 83.6292 81.8491C83.9909 81.2834 84.4892 80.8179 85.0782 80.4954C85.6671 80.1729 86.3278 80.0039 86.9992 80.0039C87.6707 80.0039 88.3313 80.1729 88.9203 80.4954C89.5092 80.8179 90.0075 81.2834 90.3692 81.8491C91.0274 81.7011 91.7123 81.722 92.3602 81.9098C93.0081 82.0976 93.598 82.4463 94.0751 82.9233C94.5521 83.4003 94.9007 83.9902 95.0885 84.6381C95.2763 85.2861 95.2972 85.971 95.1492 86.6291C95.7149 86.9908 96.1805 87.4891 96.5029 88.0781C96.8254 88.667 96.9944 89.3277 96.9944 89.9991C96.9944 90.6706 96.8254 91.3312 96.5029 91.9202C96.1805 92.5091 95.7149 93.0074 95.1492 93.3691C95.2966 94.0263 95.2756 94.71 95.0882 95.3569C94.9009 96.0038 94.5532 96.5929 94.0775 97.0697C93.6018 97.5464 93.0134 97.8953 92.3669 98.084C91.7204 98.2727 91.0367 98.2951 90.3792 98.1491C90.018 98.717 89.5193 99.1845 88.9293 99.5084C88.3394 99.8324 87.6772 100.002 87.0042 100.002C86.3312 100.002 85.669 99.8324 85.0791 99.5084C84.4891 99.1845 83.9905 98.717 83.6292 98.1491C82.972 98.2965 82.2883 98.2755 81.6414 98.0881C80.9945 97.9008 80.4054 97.5531 79.9287 97.0774C79.452 96.6017 79.1031 96.0133 78.9144 95.3668C78.7257 94.7203 78.7033 94.0366 78.8492 93.3791C78.2792 93.0184 77.8096 92.5193 77.4843 91.9283C77.1589 91.3374 76.9883 90.6737 76.9883 89.9991C76.9883 89.3245 77.1589 88.6609 77.4843 88.0699C77.8096 87.4789 78.2792 86.9799 78.8492 86.6191Z" fill="#F5E60C" stroke="#F5CA0A" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M84.0898 87.0006C84.3249 86.3322 84.789 85.7687 85.3998 85.4097C86.0106 85.0507 86.7287 84.9195 87.427 85.0393C88.1253 85.1591 88.7587 85.5221 89.2149 86.0641C89.6712 86.6061 89.9209 87.2921 89.9198 88.0006C89.9198 90.0006 86.9198 91.0006 86.9198 91.0006" fill="none" stroke="#3D3D3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M87 95H87.01" fill="none" stroke="#3D3D3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Help = () => (
  <svg className={styles.icon} viewBox="482 75 32 32" aria-hidden="true">
    <rect x="482.5" y="75.5" width="31" height="31" rx="15.5" fill="#FCDEBA" stroke="#FAC689" />
    <path d="M497.035 90.6401H499.265C499.857 90.6401 500.424 90.4051 500.843 89.9869C501.261 89.5686 501.496 89.0014 501.496 88.4099C501.496 87.8184 501.261 87.2511 500.843 86.8329C500.424 86.4147 499.857 86.1797 499.265 86.1797H495.92C495.251 86.1797 494.693 86.4027 494.358 86.8487L488.113 92.8703" fill="none" stroke="#3D3D3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M492.574 97.3296L494.359 95.7684C494.693 95.3224 495.251 95.0994 495.92 95.0994H500.381C501.607 95.0994 502.723 94.6533 503.503 93.7613L508.633 88.8548C509.064 88.4482 509.315 87.8872 509.331 87.2954C509.348 86.7036 509.129 86.1294 508.722 85.6991C508.316 85.2688 507.755 85.0176 507.163 85.0009C506.571 84.9842 505.997 85.2032 505.566 85.6099L500.883 89.9588" fill="none" stroke="#3D3D3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M487 91.7539L493.691 98.4445" fill="none" stroke="#3D3D3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const findings = [
  {
    icon: <Ask />,
    title: "Features nobody could find",
    text: "Things went unused because nothing said they existed. The acquisition **module sat apart** and mostly unused, label generation was **buried inside Bulk Processing**, and no way for users to understand what’s left.",
    designed: "Guided choices in workflow using actionable toasts, badges and pop-ups with pending work count shown in the toolbar.",
  },
  {
    icon: <Help />,
    title: "No way back without help.",
    text: "When something went wrong, nothing said how to recover. The software had in-depth workflows but **failed to cover edge states well.**",
    designed: "Clear communication states like new edition, updates, copy for duplicate and title-search fallback",
  },
];

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => t * t * (3 - 2 * t); // smooth both ends, for a hand-over in place

export default function Synthesis() {
  const track = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const b = useRef<HTMLDivElement>(null);
  const bBody = useRef<HTMLDivElement>(null);
  const spacer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const t = track.current, p0 = pin.current, sp = spacer.current;
    if (!t || !p0 || !sp || !frame.current || !b.current || !bBody.current) return;
    const F = frame.current, B = b.current, BB = bBody.current;
    let raf = 0, travelB = 0;

    // Layout, only when sizes change (never on scroll): where the frame pins (centred below the bar)
    // and how far the findings glide on a short frame. The scroll length itself is CSS (svh).
    const measure = () => {
      const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-offset")) || 0;
      const vh = document.documentElement.clientHeight;
      p0.style.top = `${Math.round(Math.max(nav + 8, nav + (vh - nav - p0.offsetHeight) / 2))}px`;
      const pad = parseFloat(getComputedStyle(B).paddingBottom) || 0;
      travelB = Math.max(0, Math.round(BB.offsetTop + BB.offsetHeight + pad - B.clientHeight));
      t.style.setProperty("--b-travel", `${travelB}px`);
      update();
    };

    // Scroll: reads two positions, writes only transform and opacity.
    const update = () => {
      raf = 0;
      if (reduce.matches) return;
      const run = sp.offsetHeight;
      const d = Math.min(run, Math.max(0, p0.getBoundingClientRect().top - t.getBoundingClientRect().top));
      const base = run - travelB;
      const lead = base * 0.2, swap = base * 0.5; // the table as framed, then the flip
      // The frame turns over like a card: the table on its front, the findings on its back.
      const q = ease(clamp((d - lead) / swap));
      F.style.transform = `rotateY(${180 * q}deg)`;
      BB.style.transform = `translate3d(0, ${-Math.min(travelB, Math.max(0, d - lead - swap))}px, 0)`;
    };

    const clear = () => {
      for (const el of [t, p0, F, BB]) el.removeAttribute("style");
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onReduce = () => (reduce.matches ? clear() : measure());
    const ro = new ResizeObserver(() => !reduce.matches && measure());
    ro.observe(p0);
    ro.observe(BB);
    if (reduce.matches) clear();
    else measure();
    addEventListener("scroll", on, { passive: true });
    reduce.addEventListener("change", onReduce);
    return () => {
      removeEventListener("scroll", on);
      reduce.removeEventListener("change", onReduce);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={track} className={styles.track}>
      <div ref={pin} className={styles.pin}>
        <div ref={frame} className={styles.frame}>
          <div className={styles.a}>
            <p className={styles.caption}>Identified problem → Synthesize gap → HMW solve it and why → Revised design direction</p>
            <svg className={styles.arrow} viewBox="0 0 900 90" preserveAspectRatio="none" aria-hidden="true">
              <path d="M30 10 C 0 40, 20 70, 220 72 C 420 74, 640 40, 790 60 C 830 66, 850 76, 860 88" />
              <path d="M850 82 L 861 90 L 864 77" />
            </svg>
            <div className={styles.view}>
              <div className={styles.sheet}>
                <table className={styles.table}>
                  <caption className={styles.srOnly}>Synthesis: what the recording showed, what the revised design does, the gap, and the direction to explore, per area.</caption>
                  <tbody>
                    {rows.map(([area, ...cells]) => (
                      <tr key={area}>
                        <th scope="row">{area}</th>
                        {cells.map((c, i) => (
                          <td key={i}>{rich(c)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div ref={b} className={styles.b}>
            <div ref={bBody} className={styles.cards}>
              {findings.map((f) => (
                <article key={f.title} className={styles.card}>
                  <h4 className={styles.cardTitle}>
                    {f.icon}
                    {f.title}
                  </h4>
                  <p className={styles.cardText}>{rich(f.text)}</p>
                  <div className={styles.designed}>
                    <p className={styles.so}>So I designed</p>
                    <p className={styles.designedText}>{f.designed}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div ref={spacer} className={styles.spacer} aria-hidden="true" />
    </div>
  );
}
