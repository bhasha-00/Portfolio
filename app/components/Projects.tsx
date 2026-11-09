"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { projects } from "../content/projects";
import styles from "./Projects.module.css";

const N = projects.length;
const pad = (n: number) => String(n).padStart(2, "0");
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

type Spot = { x: number; y: number; s: number }; // a foot position inside the deck, and a scale
const T = (p: Spot) => `translate(${p.x}px, ${p.y}px) scale(${p.s})`;

// Projects: one pinned panel (reference/lofi-v4.html .work / .pin / .deck). Scrolling steps through
// the projects; each card slides up over the last like a folder, its tab slides in at the top edge
// and its metric counts up. The hero's paper crane hops down onto the active tab.
// Reduced motion (and no JS): plain stacked cards with final numbers.
export default function Projects() {
  const work = useRef<HTMLElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  const pet = useRef<HTMLDivElement>(null);
  const petHop = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const nums = useRef<(HTMLSpanElement | null)[]>([]);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const counts = useRef<number[]>([]);
  const actRef = useRef(-1);

  const [pinned, setPinned] = useState(false);
  const [act, setAct] = useState(-1);

  // Pinned panel unless the visitor prefers reduced motion.
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setPinned(!mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Metric demo: write a value straight to the number and bar (no re-render per frame).
  const show = useCallback((j: number, v: number) => {
    const d = projects[j].demo;
    const n = nums.current[j];
    if (n) n.textContent = `${Math.round(v)}${d.suffix ?? ""}`;
    bars.current[j]?.style.setProperty("--v", String(clamp(v / 100, 0, 1)));
  }, []);

  const count = useCallback(
    (j: number) => {
      const { from, to } = projects[j].demo;
      cancelAnimationFrame(counts.current[j]);
      show(j, from);
      const t0 = performance.now();
      const f = (t: number) => {
        const q = Math.min(1, (t - t0) / 1100);
        show(j, from + (to - from) * (1 - (1 - q) ** 3)); // ease-out cubic, ref
        if (q < 1) counts.current[j] = requestAnimationFrame(f);
      };
      counts.current[j] = requestAnimationFrame(f);
    },
    [show],
  );

  // Numbers wait at their start value in the pinned panel; stacked cards show the result.
  useEffect(() => {
    const raf = counts.current;
    projects.forEach((p, j) => show(j, pinned ? p.demo.from : p.demo.to));
    return () => raf.forEach(cancelAnimationFrame);
  }, [pinned, show]);

  // The active project counts up once its card has slid in (ref: 450ms).
  useEffect(() => {
    if (!pinned || act < 0) return;
    show(act, projects[act].demo.from);
    const t = setTimeout(() => count(act), 450);
    return () => clearTimeout(t);
  }, [act, pinned, count, show]);

  // Scroll drives the active project and where the crane sits.
  useEffect(() => {
    if (!pinned) return;
    const html = document.documentElement;
    const el = pet.current!, inner = petHop.current!;
    let raf = 0, k = -2, pos: Spot | null = null;
    let hop: Animation | null = null, bob: Animation | null = null;

    // Where the crane's foot goes: k < 0 is its spot in the hero art, otherwise the top of tab k.
    const spot = (k: number): Spot | null => {
      const cw = (inner.firstElementChild as HTMLElement | null)?.offsetWidth || 1;
      if (k < 0) {
        const home = document.querySelector<HTMLElement>("[data-intro-target]");
        const r = home?.getBoundingClientRect(), d = deck.current!.getBoundingClientRect();
        if (!r || r.width === 0) return null;
        return { x: r.left + r.width * 0.31 - d.left, y: r.bottom - d.top, s: r.width / cw };
      }
      const t = tabs.current[k];
      const bar = t?.offsetParent as HTMLElement | null;
      if (!t || !bar) return null;
      return { x: bar.offsetLeft + t.offsetLeft + t.offsetWidth * 0.68, y: bar.offsetTop + t.offsetTop + 3, s: 1 };
    };

    const land = (next: number, to: Spot) => {
      el.style.transform = T(to);
      pos = to;
      const away = next >= 0;
      el.style.opacity = away ? "1" : "0";
      html.dataset.crane = away ? "away" : "home";
    };

    const go = (next: number, animate: boolean) => {
      const to = spot(next);
      if (!to) return;
      const from = k < 0 ? spot(-1) : pos;
      const start = hop ? getComputedStyle(el).transform : from ? T(from) : null;
      hop?.cancel();
      bob?.cancel();
      hop = bob = null;
      if (!animate || !from || !start) return land(next, to);

      // Take off from where it is: the hero crane hands over to this one on the spot.
      el.style.opacity = "1";
      html.dataset.crane = "away";
      const far = k < 0 || next < 0;
      const lift = 34 + Math.min(80, Math.hypot(to.x - from.x, to.y - from.y) * 0.1);
      const duration = far ? 850 : 650;
      // Outer: glides foot to foot. Inner: the hop itself, up and down with a small tilt.
      hop = el.animate([{ transform: start }, { transform: T(to) }], {
        duration,
        easing: "cubic-bezier(.45,0,.25,1)",
        fill: "forwards",
      });
      bob = inner.animate(
        [
          { transform: "translateY(0) rotate(0deg)", easing: "cubic-bezier(.2,.7,.4,1)" },
          { transform: `translateY(${-lift}px) rotate(-8deg)`, offset: 0.45, easing: "cubic-bezier(.6,0,.8,.3)" },
          { transform: "translateY(0) rotate(0deg)" },
        ],
        { duration },
      );
      const a = hop;
      a.onfinish = () => {
        if (hop !== a) return;
        land(next, to);
        if (next < 0) dispatchEvent(new Event("crane:land")); // landing puff back in the hero
        a.cancel();
        hop = bob = null;
      };
    };

    const update = () => {
      raf = 0;
      const r = work.current!.getBoundingClientRect();
      const tot = r.height - innerHeight;
      const i = r.top > innerHeight * 0.5 ? -1 : Math.floor(clamp(-r.top / tot, 0, 0.9999) * N);
      actRef.current = i;
      setAct(i);
      // Nothing moves while the intro is still covering the page.
      const want = html.dataset.intro === "done" ? i : -1;
      if (want !== k) {
        go(want, k !== -2);
        k = want;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      hop?.cancel();
      bob?.cancel();
      hop = bob = null;
      k = -2; // re-place without a hop
      update();
    };

    const mo = new MutationObserver(onScroll);
    mo.observe(html, { attributes: true, attributeFilter: ["data-intro"] });
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    update();
    return () => {
      mo.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      hop?.cancel();
      bob?.cancel();
      delete html.dataset.crane;
      actRef.current = -1;
      setAct(-1);
    };
  }, [pinned]);

  // Tab click: scroll to the middle of that project's stretch of the panel (ref).
  const jump = (i: number) => {
    const r = work.current!.getBoundingClientRect();
    scrollTo({ top: scrollY + r.top + ((r.height - innerHeight) * (i + 0.5)) / N });
  };

  // "View ↗" bubble follows a mouse over the demo. Desktop pointers only.
  const fine = useRef(false);
  useEffect(() => {
    fine.current = matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);
  const follow = (e: PointerEvent) => {
    if (fine.current && e.pointerType === "mouse" && view.current)
      view.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(1)`;
  };
  const unfollow = () => {
    if (view.current) view.current.style.transform = "";
  };

  return (
    <section
      ref={work}
      id="projects"
      className={styles.work}
      data-mode={pinned ? "pin" : "stack"}
      style={{ "--n": N } as CSSProperties}
      aria-labelledby="projects-title"
    >
      <h2 id="projects-title" className="sr-only">
        Projects
      </h2>
      <div className={styles.pin}>
        <div ref={deck} className={styles.deck}>
          <div className={styles.tabs}>
            {projects.map((_, j) => (
              <button
                key={j}
                ref={(b) => {
                  tabs.current[j] = b;
                }}
                type="button"
                className={styles.tab}
                // Tab 01 shows from the start: it is part of the peek under the hero.
                data-s={j > Math.max(act, 0) ? "hide" : j === Math.max(act, 0) ? "on" : "off"}
                aria-current={j === act ? "true" : undefined}
                onClick={() => jump(j)}
              >
                <span className={styles.tabText}>Project {pad(j + 1)}</span>
              </button>
            ))}
          </div>

          {projects.map((p, j) => (
            <article
              key={j}
              className={styles.card}
              // The first card is already in place as the section scrolls in: content never waits.
              data-s={j > Math.max(act, 0) ? "after" : j === Math.max(act, 0) ? "on" : "before"}
              style={{ "--i": j + 1, "--d": Math.max(0, act - j) } as CSSProperties}
              onFocus={() => {
                if (pinned && actRef.current !== j) jump(j);
              }}
            >
              <span className={styles.ownTab} aria-hidden="true">
                Project {pad(j + 1)}
              </span>
              <div className={styles.info}>
                <div>
                  <span className={styles.label}>Project {pad(j + 1)}</span>
                  <h3 className={styles.value}>{p.title}</h3>
                  <p className={styles.summary}>{p.summary}</p>
                </div>
                <div>
                  <span className={styles.label}>Role</span>
                  <p className={styles.value}>{p.role}</p>
                </div>
                <div>
                  <span className={styles.label}>Outcome</span>
                  <p className={styles.value}>{p.outcome}</p>
                </div>
              </div>

              <button
                type="button"
                className={styles.demo}
                disabled={!pinned}
                onClick={() => count(j)}
                onPointerMove={follow}
                onPointerLeave={unfollow}
              >
                {/* Name: the result, then the visible hint. The counting number is decoration. */}
                <span className="sr-only">{p.outcome}. </span>
                <span
                  ref={(n) => {
                    nums.current[j] = n;
                  }}
                  className={styles.num}
                  aria-hidden="true"
                >
                  {p.demo.to}
                  {p.demo.suffix}
                </span>
                {p.demo.bar && (
                  <span className={styles.bar} aria-hidden="true">
                    <span
                      ref={(b) => {
                        bars.current[j] = b;
                      }}
                      className={styles.fill}
                      style={{ "--v": p.demo.to / 100 } as CSSProperties}
                    />
                  </span>
                )}
                <span className={styles.hint}>
                  Tap to replay
                </span>
              </button>
            </article>
          ))}

          {pinned && (
            <div ref={pet} className={styles.pet} aria-hidden="true">
              <span className={styles.petFoot} />
              <div ref={petHop} className={styles.petHop}>
                <Image
                  src="/assets/crane-sm.webp"
                  alt=""
                  width={320}
                  height={236}
                  quality={90}
                  sizes="(max-width: 767px) 12vw, 80px"
                  className={styles.petArt}
                />
              </div>
            </div>
          )}
        </div>

        <p className={styles.count} aria-hidden="true">
          {pad(Math.max(act, 0) + 1)} / {pad(N)}
        </p>
      </div>

      <div ref={view} className={styles.view} aria-hidden="true">
        View ↗
      </div>
    </section>
  );
}
