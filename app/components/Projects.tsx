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

/** The crane flies down when card 01's top crosses this fraction of the viewport. */
const TRIGGER = 0.7;
const CRANE_ASPECT = 236 / 320;

// "**bold**" → <strong>bold</strong>
const rich = (s: string): ReactNode =>
  s.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>));

// Puff under the perched crane when it lands.
function PerchPuff({ size }: { size: () => number }) {
  const [burst, setBurst] = useState<{ n: number; s: number } | null>(null);
  useEffect(() => {
    const land = (e: Event) => {
      if ((e as CustomEvent).detail?.at !== "cards") return;
      const s = size();
      if (s) setBurst((b) => ({ n: (b?.n ?? 0) + 1, s }));
    };
    addEventListener("crane:land", land);
    return () => removeEventListener("crane:land", land);
  }, [size]);
  return burst ? <LandingPuff key={burst.n} x={0} y={0} size={burst.s} onDone={() => setBurst(null)} /> : null;
}

// Case studies, one per screen: each card is sticky and fills the viewport, so the next slides up
// over the last as you scroll. When card 01 comes up, the paper crane flies once from the hero to a
// perch on the cards' bottom-right corner and stays there while the cards scroll underneath; it
// flies home if you scroll back to the hero. Demos start once a card is over 60% in view.
// Reduced motion: no flight (the crane just sits on the perch), demos show their result.
export default function Projects() {
  const slots = useRef<(HTMLLIElement | null)[]>([]);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const perch = useRef<HTMLSpanElement>(null);
  const work = useRef<HTMLElement>(null);
  const perchRow = useRef<HTMLLIElement>(null);
  const fly = useRef<HTMLSpanElement>(null);
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

  const craneWidth = useCallback(() => (fly.current?.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0, []);

  // ---------- Metric demos ----------
  const show = useCallback((j: number, v: number) => {
    const d = projects[j].demo;
    const n = nums.current[j];
    if (!d) return;
    if (n) n.textContent = `${d.prefix ?? ""}${Math.round(v)}${d.suffix ?? ""}`;
    bars.current[j]?.style.setProperty("--v", String(clamp(v / 100, 0, 1)));
  }, []);

  const count = useCallback(
    (j: number) => {
      const d = projects[j].demo;
      if (!d) return;
      const { from, to } = d;
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

  // ---------- Sticky fit and demos ----------
  useEffect(() => {
    if (reduced === null) return;
    const raf = counts.current;

    // Every card gets the same fixed height (the tallest card's), so each one sticks in exactly the
    // same place and the next covers it completely. A card taller than the screen sticks once its
    // bottom is in view, so it is never cut off. The crane's perch follows the same numbers.
    const fit = () => {
      const w = work.current, row = perchRow.current, pt = perch.current, first = slots.current[0];
      const cs = cards.current.filter((c): c is HTMLElement => !!c);
      if (!w || !row || !pt || !first || !cs.length) return;
      w.style.removeProperty("--card-h");
      const H = Math.ceil(Math.max(...cs.map((c) => c.offsetHeight)));
      w.style.setProperty("--card-h", `${H}px`);
      const st = getComputedStyle(first);
      const padTop = parseFloat(st.paddingTop), padBottom = parseFloat(st.paddingBottom);
      const slotH = Math.max(innerHeight, padTop + H + padBottom);
      const top = `${Math.min(0, innerHeight - slotH)}px`;
      w.style.setProperty("--slot-h", `${slotH}px`);
      slots.current.forEach((s) => s && (s.style.top = top));
      row.style.top = top;
      pt.style.top = `${padTop + Math.max(0, (innerHeight - padTop - padBottom - H) / 2)}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    addEventListener("resize", fit);

    // Demos: start once a card is over 60% visible; reset when it has left the screen.
    projects.forEach((p, j) => p.demo && show(j, reduced ? p.demo.to : p.demo.from));
    const ran = projects.map(() => false);
    const io = new IntersectionObserver(
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
            if (!reduced) show(j, projects[j].demo?.from ?? 0);
          }
        }
      },
      { threshold: [0, 0.6, 0.61] },
    );
    cards.current.forEach((c) => c && io.observe(c));

    return () => {
      io.disconnect();
      removeEventListener("resize", fit);
      raf.forEach(cancelAnimationFrame);
    };
  }, [reduced, count, show]);

  // ---------- The crane: hero ⇄ perch ----------
  useEffect(() => {
    if (reduced === null) return;
    const html = document.documentElement;
    const el = fly.current!;
    let onPerch: boolean | null = null; // where it is, or is heading
    let flight: Animation | null = null;
    let raf = 0;

    const heroFoot = () => {
      const r = document.querySelector<HTMLElement>("[data-intro-target]")?.getBoundingClientRect();
      return r && r.width ? { p: { x: r.left + r.width * 0.31, y: r.bottom }, w: r.width } : null;
    };
    const perchPt = (): Pt => {
      const r = perch.current!.getBoundingClientRect();
      return { x: r.left, y: r.top };
    };

    // Put the crane straight where it belongs: no flight, no puff.
    const place = (toPerch: boolean) => {
      flight?.cancel();
      flight = null;
      el.style.transform = "";
      el.style.opacity = toPerch ? "1" : "0";
      html.dataset.crane = toPerch ? "away" : "home";
    };

    const go = (toPerch: boolean) => {
      const c = craneWidth();
      const hero = heroFoot();
      if (!c || !hero) return place(toPerch);
      const origin = perchPt();
      const heroScale = hero.w / c;

      // Where it is now (mid-flight if interrupted), in viewport px, and its scale.
      let from: Pt, s0: number;
      if (flight) {
        const r = el.firstElementChild!.getBoundingClientRect();
        from = { x: r.left + r.width * 0.31, y: r.bottom };
        s0 = r.height / (c * CRANE_ASPECT) || 1;
      } else if (toPerch) {
        from = hero.p;
        s0 = heroScale;
      } else {
        from = origin;
        s0 = 1;
      }
      // The path is drawn hero → perch; flying home runs it backwards.
      const [a, b] = toPerch ? [from, origin] : [hero.p, from];
      const P = controls(a, b, "dive").map((p) => ({ x: p.x - origin.x, y: p.y - origin.y }));

      flight?.cancel();
      html.dataset.crane = "away";
      el.style.opacity = "1";
      const anim = el.animate(flightFrames(P, s0, toPerch ? 1 : heroScale, !toPerch), {
        duration: 1100,
        easing: "linear",
        fill: "forwards",
      });
      flight = anim;
      anim.onfinish = () => {
        if (flight !== anim) return;
        anim.cancel();
        flight = null;
        el.style.transform = "";
        if (!toPerch) {
          el.style.opacity = "0";
          html.dataset.crane = "home";
        }
        dispatchEvent(new CustomEvent("crane:land", { detail: { at: toPerch ? "cards" : "hero" } }));
      };
    };

    const update = () => {
      raf = 0;
      // A covered card hides its "01 / 03" label (it sits outside the card, under the next one's).
      const tops = cards.current.map((c) => c?.getBoundingClientRect().top ?? 0);
      cards.current.forEach((c, j) => {
        if (c) c.toggleAttribute("data-covered", j < N - 1 && tops[j + 1] <= tops[j] + 2);
      });
      const first = slots.current[0]?.getBoundingClientRect();
      let want = !!first && first.top < innerHeight * TRIGGER;
      if (html.dataset.intro !== "done") want = false; // nothing moves under the intro
      if (want === onPerch) return;
      if (onPerch === null || reduced) place(want);
      else go(want);
      onPerch = want;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      if (flight && onPerch !== null) place(onPerch);
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
      flight?.cancel();
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
    <section ref={work} id="projects" className={styles.work} aria-labelledby="projects-title">
      <h2 id="projects-title" className="sr-only">
        Projects
      </h2>
      <ol className={styles.stack}>
        {/* The crane's perch: holds still on the top card's top-right edge while cards slide under. */}
        <li ref={perchRow} className={styles.perchRow} aria-hidden="true">
          <span ref={perch} className={styles.perch}>
            <PerchPuff size={craneWidth} />
            <span ref={fly} className={styles.fly}>
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
                {p.title ?? p.name}
              </h3>

              <div className={styles.body}>
                <div>
                  <div className={styles.col}>
                    <h4 className={styles.label}>Problem</h4>
                    <p className={styles.text}>{rich(p.problem)}</p>
                  </div>
                  <div className={styles.col}>
                    <h4 className={styles.label}>What I did</h4>
                    <p className={styles.text}>{rich(p.whatIDid)}</p>
                  </div>
                  <div className={styles.col}>
                    <h4 className={styles.label}>Outcome</h4>
                    <p className={styles.text}>{rich(p.outcome)}</p>
                    {p.note && <p className={styles.note}>{p.note}</p>}
                  </div>
                </div>

                {p.image ? (
                  <div className={`${styles.media} ${styles.shot}`} onPointerMove={follow} onPointerLeave={unfollow}>
                    <Image
                      src={p.image.src}
                      alt={p.image.alt}
                      fill
                      quality={80}
                      sizes="(max-width: 767px) 88vw, 560px"
                      className={styles.shotImg}
                    />
                  </div>
                ) : p.demo ? (
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
                      {p.demo.prefix}
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
                ) : (
                  <div className={styles.media} aria-hidden="true" onPointerMove={follow} onPointerLeave={unfollow} />
                )}
              </div>
            </article>
          </li>
        ))}
      </ol>

      <div ref={view} className={styles.view} aria-hidden="true">
        View ↗
      </div>
    </section>
  );
}
