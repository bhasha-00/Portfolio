"use client";

import Image from "next/image";
import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { projects } from "../content/projects";
import { controls, flightFrames, type Pt } from "./craneFlight";
import LandingPuff from "./LandingPuff";
import styles from "./Projects.module.css";

const N = projects.length;
const pad = (n: number) => String(n).padStart(2, "0");
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** A card "arrives" (and the crane flies to it) when its top crosses this fraction of the viewport. */
const TRIGGER = 0.7;
/** Sticky offsets: first card's top below the nav, and the step that lets earlier tabs peek. */
const STICK_TOP = 88, STICK_STEP = 14;
const CRANE_ASPECT = 236 / 320;

// "**bold**" → <strong>bold</strong>
const rich = (s: string): ReactNode =>
  s.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>));

// Puff at a card's corner when the crane lands there.
function CardPuff({ at, size }: { at: number; size: () => number }) {
  const [burst, setBurst] = useState<{ n: number; s: number } | null>(null);
  useEffect(() => {
    const land = (e: Event) => {
      if ((e as CustomEvent).detail?.at !== at) return;
      const s = size();
      if (s) setBurst((b) => ({ n: (b?.n ?? 0) + 1, s }));
    };
    addEventListener("crane:land", land);
    return () => removeEventListener("crane:land", land);
  }, [at, size]);
  return burst ? <LandingPuff key={burst.n} x={0} y={0} size={burst.s} onDone={() => setBurst(null)} /> : null;
}

// Case study cards. Each card is one sticky element: later cards slide up over earlier ones as you
// scroll. A card enters with one translate/opacity animation on itself. When a card's top crosses
// 70% of the viewport the paper crane flies to its bottom-right corner (from the hero for card 01,
// from the card before for the rest) and back again on the way up. Its metric demo starts once the
// card is over 60% in view. Reduced motion: no entrance, no flight; the crane just sits there.
export default function Projects() {
  const slots = useRef<(HTMLLIElement | null)[]>([]);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const perches = useRef<(HTMLSpanElement | null)[]>([]);
  const flies = useRef<(HTMLSpanElement | null)[]>([]);
  const nums = useRef<(HTMLSpanElement | null)[]>([]);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const counts = useRef<number[]>([]);
  const view = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const craneWidth = useCallback(() => (flies.current[0]?.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0, []);

  // ---------- Metric demos ----------
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
      if (reduced) return show(j, to);
      show(j, from);
      const t0 = performance.now();
      const f = (t: number) => {
        const q = Math.min(1, (t - t0) / 1100);
        show(j, from + (to - from) * (1 - (1 - q) ** 3));
        if (q < 1) counts.current[j] = requestAnimationFrame(f);
      };
      counts.current[j] = requestAnimationFrame(f);
    },
    [reduced, show],
  );

  // ---------- Sticky tops, entrance, demos ----------
  useEffect(() => {
    if (reduced === null) return;
    const raf = counts.current;

    // A card taller than the screen sticks once its bottom is in view, so it is never cut off.
    const fit = () =>
      slots.current.forEach((s, j) => {
        if (s) s.style.top = `${Math.min(STICK_TOP + j * STICK_STEP, innerHeight - s.offsetHeight - 16)}px`;
      });
    fit();
    const ro = new ResizeObserver(fit);
    slots.current.forEach((s) => s && ro.observe(s));
    addEventListener("resize", fit);

    // Entrance: one transform/opacity animation on the card itself. Re-arms when it leaves below.
    const enter: (Animation | null)[] = [];
    const armed = slots.current.map(() => true);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const j = slots.current.indexOf(e.target as HTMLLIElement);
          const card = cards.current[j];
          if (j < 0 || !card) continue;
          if (e.isIntersecting && armed[j] && e.boundingClientRect.top > 0 && !reduced) {
            armed[j] = false;
            enter[j]?.cancel();
            enter[j] = card.animate(
              [
                { transform: "translateY(48px)", opacity: 0 },
                { transform: "none", opacity: 1 },
              ],
              { duration: 500, easing: "cubic-bezier(.2,.8,.2,1)" },
            );
          } else if (!e.isIntersecting && e.boundingClientRect.top >= innerHeight) {
            armed[j] = true;
            enter[j]?.cancel();
          }
        }
      },
      { threshold: 0 },
    );

    // Demos: start once a card is over 60% visible; reset when it has left the screen.
    projects.forEach((p, j) => show(j, reduced ? p.demo.to : p.demo.from));
    const ran = projects.map(() => false);
    const demoIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const j = cards.current.indexOf(e.target as HTMLElement);
          if (j < 0) continue;
          if (e.intersectionRatio > 0.6 && !ran[j]) {
            ran[j] = true;
            count(j);
          } else if (!e.isIntersecting && ran[j]) {
            ran[j] = false;
            cancelAnimationFrame(counts.current[j]);
            if (!reduced) show(j, projects[j].demo.from);
          }
        }
      },
      { threshold: [0, 0.6, 0.61] },
    );
    slots.current.forEach((s) => s && io.observe(s));
    cards.current.forEach((c) => c && demoIo.observe(c));

    return () => {
      ro.disconnect();
      io.disconnect();
      demoIo.disconnect();
      removeEventListener("resize", fit);
      enter.forEach((a) => a?.cancel());
      raf.forEach(cancelAnimationFrame);
    };
  }, [reduced, count, show]);

  // ---------- The crane ----------
  useEffect(() => {
    if (reduced === null) return;
    const html = document.documentElement;
    let at = -2; // where the crane is, or is heading: -1 = hero, j = card j
    let holder = -1; // whose element shows it right now: -1 = the hero crane, j = card j's crane
    let flight: { anim: Animation; el: HTMLElement } | null = null;
    let raf = 0;

    const heroFoot = () => {
      const r = document.querySelector<HTMLElement>("[data-intro-target]")?.getBoundingClientRect();
      return r && r.width ? { p: { x: r.left + r.width * 0.31, y: r.bottom }, w: r.width } : null;
    };
    const perch = (j: number): Pt => {
      const r = perches.current[j]!.getBoundingClientRect();
      return { x: r.left, y: r.top };
    };

    // Put the crane straight on its perch: no flight, no puff.
    const land = (j: number) => {
      flight?.anim.cancel();
      flight = null;
      flies.current.forEach((f, i) => {
        if (!f) return;
        f.style.transform = "";
        f.style.opacity = i === j ? "1" : "0";
      });
      html.dataset.crane = j < 0 ? "home" : "away";
      holder = j;
    };

    const fly = (to: number) => {
      const c = craneWidth();
      const hero = heroFoot();
      if (!c || !hero) return land(to);

      // Where the crane is on screen now, and its size relative to a card crane.
      let from: Pt, s0: number;
      if (flight) {
        const r = flight.el.firstElementChild!.getBoundingClientRect();
        from = { x: r.left + r.width * 0.31, y: r.bottom };
        s0 = r.height / (c * CRANE_ASPECT) || 1;
      } else if (holder < 0) {
        from = hero.p;
        s0 = hero.w / c;
      } else {
        from = perch(holder);
        s0 = 1;
      }
      const fromHero = holder < 0 && !flight;
      const prevAt = at;

      // The flying element: the destination card's crane, or (back to the hero) the current one.
      const f = to >= 0 ? to : Math.max(holder, 0);
      const el = flies.current[f];
      if (!el) return land(to);
      const origin = perch(f);
      const dest = to >= 0 ? perch(to) : hero.p;
      const s1 = to >= 0 ? 1 : hero.w / c;

      // Paths are drawn top to bottom; flying up uses the same curve backwards.
      const dive = to < 0 || fromHero || prevAt < 0;
      const up = to < prevAt;
      const [a, b] = up ? [dest, from] : [from, dest];
      const P = controls(a, b, dive ? "dive" : "hop").map((p) => ({ x: p.x - origin.x, y: p.y - origin.y }));

      flight?.anim.cancel();
      flies.current.forEach((g, i) => {
        if (g && i !== f) {
          g.style.opacity = "0";
          g.style.transform = "";
        }
      });
      html.dataset.crane = "away";
      el.style.opacity = "1";
      const anim = el.animate(flightFrames(P, s0, s1, up), {
        duration: dive ? 1100 : 900,
        easing: "linear",
        fill: "forwards",
      });
      flight = { anim, el };
      holder = f;
      anim.onfinish = () => {
        if (flight?.anim !== anim) return;
        anim.cancel();
        flight = null;
        el.style.transform = "";
        if (to < 0) {
          el.style.opacity = "0";
          html.dataset.crane = "home";
          holder = -1;
        }
        dispatchEvent(new CustomEvent("crane:land", { detail: { at: to < 0 ? "hero" : to } }));
      };
    };

    const update = () => {
      raf = 0;
      let want = -1;
      slots.current.forEach((s, j) => {
        if (s && s.getBoundingClientRect().top < innerHeight * TRIGGER) want = j;
      });
      if (html.dataset.intro !== "done") want = -1; // nothing moves under the intro
      if (want === at) return;
      if (at === -2 || reduced) land(want);
      else fly(want);
      at = want;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      if (flight) land(at);
      onScroll();
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
      flight?.anim.cancel();
      delete html.dataset.crane;
    };
  }, [reduced, craneWidth]);

  // ---------- "View ↗" bubble: follows a mouse over the media area. Desktop pointers only. ----------
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
    <section id="projects" className={styles.work} aria-labelledby="projects-title">
      <h2 id="projects-title" className="sr-only">
        Projects
      </h2>
      <ol className={styles.stack}>
        {projects.map((p, j) => (
          <li
            key={j}
            ref={(el) => {
              slots.current[j] = el;
            }}
            className={styles.slot}
            style={{ "--i": j } as CSSProperties}
          >
            <article
              ref={(el) => {
                cards.current[j] = el;
              }}
              className={styles.card}
              aria-labelledby={`project-${j}`}
            >
              <span className={styles.tab} aria-hidden="true">
                {pad(j + 1)}
              </span>
              <span className={styles.count} aria-hidden="true">
                {pad(j + 1)} / {pad(N)}
              </span>
              <h3 id={`project-${j}`} className={styles.title}>
                {p.title}
              </h3>
              <div className={styles.cols}>
                <div className={styles.col}>
                  <h4 className={styles.label}>Problem</h4>
                  <p className={styles.body}>{rich(p.problem)}</p>
                </div>
                <div className={styles.col}>
                  <h4 className={styles.label}>What I Did</h4>
                  <p className={styles.body}>{rich(p.whatIDid)}</p>
                </div>
                <div className={styles.col}>
                  <h4 className={styles.label}>Outcome</h4>
                  <p className={styles.body}>{rich(p.outcome)}</p>
                </div>
              </div>

              <button
                type="button"
                className={styles.media}
                onClick={() => count(j)}
                onPointerMove={follow}
                onPointerLeave={unfollow}
              >
                <span className="sr-only">{p.outcome.replace(/\*\*/g, "")}. </span>
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
                <span className={styles.hint}>Tap to replay</span>
              </button>
            </article>

            {/* The card's own crane, perched on its bottom-right corner (a point at the foot). */}
            <span
              ref={(el) => {
                perches.current[j] = el;
              }}
              className={styles.perch}
              aria-hidden="true"
            >
              <CardPuff at={j} size={craneWidth} />
              <span
                ref={(el) => {
                  flies.current[j] = el;
                }}
                className={styles.fly}
              >
                <Image
                  src="/assets/crane-sm.webp"
                  alt=""
                  width={320}
                  height={236}
                  quality={90}
                  sizes="(max-width: 767px) 12vw, 80px"
                  className={styles.craneArt}
                />
              </span>
            </span>
          </li>
        ))}
      </ol>

      <div ref={view} className={styles.view} aria-hidden="true">
        View ↗
      </div>
    </section>
  );
}
