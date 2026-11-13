"use client";

import Image, { getImageProps } from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { projects, type Project } from "../content/projects";
import { caseStudyHref } from "../content/caseStudies";
import { controls, flightFrames, type Pt } from "./craneFlight";
import PerchPuff from "./companion/PerchPuff";
import Origami from "./companion/Origami";
import { useViewBubble } from "./useViewBubble";
import { rich } from "./rich";
import styles from "./Projects.module.css";

const N = projects.length;
const pad = (n: number) => String(n).padStart(2, "0");
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** The crane flies down when card 01's top crosses this fraction of the viewport. */
const TRIGGER = 0.7;
const CRANE_ASPECT = 236 / 320;

// Case study shot. Desktop: the SVG export itself, so the browser draws vector type crisp and scales
// the embedded screenshots once, straight from their full-size sources. Phones (and no SVG): a
// raster sized to the card by Next, so a small screen never downloads megabytes.
function Shot({ image }: { image: NonNullable<Project["image"]> }) {
  const { props } = getImageProps({
    src: image.src,
    alt: image.alt,
    fill: true,
    quality: 90,
    sizes: "calc(100vw - 64px)", // phone: the card's inner width (20px margins, 12px card padding)
  });
  return (
    <picture>
      {image.svg && <source media="(min-width: 768px)" srcSet={image.svg} type="image/svg+xml" />}
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- props from getImageProps */}
      <img {...props} loading="lazy" decoding="async" className={styles.shotImg} />
    </picture>
  );
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
      let H = Math.ceil(Math.max(...cs.map((c) => c.offsetHeight)));
      const st = getComputedStyle(first);
      const padTop = parseFloat(st.paddingTop), padBottom = parseFloat(st.paddingBottom);
      // Phones: every card fills the screen below the nav; a card with more text than that grows.
      if (innerWidth < 768) H = Math.max(H, Math.floor(innerHeight - padTop - padBottom));
      w.style.setProperty("--card-h", `${H}px`);
      const slotH = Math.max(innerHeight, padTop + H + padBottom);
      // A card taller than the screen sticks higher to show more of itself, but never above 88px (the
      // crane on its edge stays in view; the card's own padding absorbs the rest). Phones: not at all.
      const lift = innerWidth < 768 ? 0 : Math.max(-(padTop - 88), innerHeight - slotH);
      const top = `${Math.min(0, lift)}px`;
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

  // ---------- The crane's route: hero → cards → AI Tinkering (middle card), and back ----------
  // Stops: 0 = the hero art, 1 = the cards' perch, 2 = the middle AI card. Stops 1 and 2 each own a
  // crane element; the one flying is always the destination's (or, going home, the current one), so
  // it travels with whatever it lands on.
  useEffect(() => {
    if (reduced === null) return;
    const html = document.documentElement;
    const perchOf = (k: number) =>
      k === 1 ? perch.current : document.querySelector<HTMLElement>('[data-perch="ai"]');
    const flyOf = (k: number) =>
      k === 1 ? fly.current : document.querySelector<HTMLElement>('[data-perch="ai"] [data-fly]');
    const LAND = ["hero", "cards", "ai"];
    let at = -1; // where it is, or is heading
    let holder = 0; // whose element shows it now
    let flight: { anim: Animation; el: HTMLElement } | null = null;
    let raf = 0;

    const heroFoot = () => {
      const r = document.querySelector<HTMLElement>("[data-intro-target]")?.getBoundingClientRect();
      return r && r.width ? { p: { x: r.left + r.width * 0.31, y: r.bottom }, w: r.width } : null;
    };
    const pointOf = (k: number): Pt | null => {
      const r = perchOf(k)?.getBoundingClientRect();
      return r ? { x: r.left, y: r.top } : null;
    };
    const showOnly = (k: number) => {
      [1, 2].forEach((i) => {
        const e = flyOf(i);
        if (!e) return;
        e.style.opacity = i === k ? "1" : "0";
        e.style.visibility = i === k ? "visible" : "hidden";
      });
    };

    // Put the crane straight where it belongs: no flight, no puff.
    const place = (k: number) => {
      flight?.anim.cancel();
      flight = null;
      [1, 2].forEach((i) => flyOf(i) && (flyOf(i)!.style.transform = ""));
      showOnly(k);
      html.dataset.crane = k === 0 ? "home" : "away";
      holder = k;
    };

    const go = (to: number) => {
      const c = craneWidth();
      const hero = heroFoot();
      const f = to === 0 ? Math.max(holder, 1) : to; // the element that flies
      const el = flyOf(f), origin = pointOf(f), dest = to === 0 ? hero?.p : pointOf(to);
      if (!c || !hero || !el || !origin || !dest) return place(to);
      const scale = (k: number) => (k === 0 ? hero.w / c : 1);

      // Where it is now (mid-flight if interrupted), in viewport px, and its scale.
      let from: Pt, s0: number;
      if (flight) {
        const r = flight.el.firstElementChild!.getBoundingClientRect();
        from = { x: r.left + r.width * 0.31, y: r.bottom };
        s0 = r.height / (c * CRANE_ASPECT) || 1;
      } else if (holder === 0) {
        from = hero.p;
        s0 = scale(0);
      } else {
        from = pointOf(holder) ?? origin;
        s0 = 1;
      }
      // Paths are drawn down the page; flying back up runs the same curve backwards.
      const up = to < at;
      const [a, b] = up ? [dest, from] : [from, dest];
      const P = controls(a, b, "dive").map((p) => ({ x: p.x - origin.x, y: p.y - origin.y }));

      flight?.anim.cancel();
      [1, 2].forEach((i) => i !== f && flyOf(i) && (flyOf(i)!.style.transform = ""));
      showOnly(f);
      html.dataset.crane = "away";
      const anim = el.animate(flightFrames(P, s0, scale(to), up), {
        duration: 1100,
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
        if (to === 0) {
          showOnly(-1);
          html.dataset.crane = "home";
          holder = 0;
        }
        dispatchEvent(new CustomEvent("crane:land", { detail: { at: LAND[to] } }));
      };
    };

    // Covered state, written straight onto each card's layers (not through a variable on the card,
    // which would restyle its whole subtree every scroll frame), and only when the value changes.
    const dimText = parseFloat(getComputedStyle(html).getPropertyValue("--dim-text-opacity")) || 0.32;
    const layers = new Map<HTMLElement, { shade: HTMLElement[]; dim: HTMLElement[]; ink: HTMLElement[]; at: number }>();
    const layersOf = (c: HTMLElement) => {
      let l = layers.get(c);
      if (!l) {
        const skip = [styles.count, styles.grain, styles.shade, styles.dim];
        l = {
          shade: [...c.querySelectorAll<HTMLElement>(`.${styles.shade}`)],
          dim: [...c.querySelectorAll<HTMLElement>(`.${styles.dim}`)],
          ink: [...c.children].filter((e): e is HTMLElement => !skip.some((k) => e.classList.contains(k))),
          at: -1,
        };
        layers.set(c, l);
      }
      return l;
    };
    const setCover = (c: HTMLElement, cover: number) => {
      const l = layersOf(c);
      if (l.at === cover) return;
      l.at = cover;
      l.shade.forEach((e) => (e.style.opacity = String(1 - cover)));
      l.dim.forEach((e) => (e.style.opacity = String(cover)));
      l.ink.forEach((e) => (e.style.opacity = String(1 - cover * (1 - dimText))));
    };

    const update = () => {
      raf = 0;
      // A covered card hides its "01 / 04" counter (it sits outside the card, under the next one's).
      // The cover runs 0 → 1 as the next card travels from the bottom of the screen to this card's
      // top: the card darkens and its type falls to --dim-text-opacity with it (cs2.svg).
      const tops = cards.current.map((c) => c?.getBoundingClientRect().top ?? 0);
      cards.current.forEach((c, j) => {
        if (!c) return;
        c.toggleAttribute("data-covered", j < N - 1 && tops[j + 1] <= tops[j] + 2);
        const run = innerHeight - tops[j];
        const cover = j < N - 1 && run > 0 ? Math.min(1, Math.max(0, 1 - (tops[j + 1] - tops[j]) / run)) : 0;
        setCover(c, Math.round(cover * 1000) / 1000);
      });
      const first = slots.current[0]?.getBoundingClientRect();
      const ai = document.getElementById("ai-tinkering")?.getBoundingClientRect();
      let want = 0;
      if (first && first.top < innerHeight * TRIGGER) want = 1;
      if (ai && ai.top < innerHeight * 0.25) want = 2; // the fan is well under way
      if (html.dataset.intro !== "done") want = 0; // nothing moves under the intro
      if (want === at) return;
      if (at === -1 || reduced) place(want);
      else go(want);
      at = want;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      if (flight && at !== -1) place(at);
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

  // The "View ↗" bubble over the media (useViewBubble).
  const { bubble, follow, unfollow } = useViewBubble();

  return (
    <section ref={work} id="projects" className={`container ${styles.work}`} aria-labelledby="projects-title">
      <h2 id="projects-title" className="sr-only">
        Projects
      </h2>
      <ol className={styles.stack}>
        {/* Phones: a strip under the nav, so card text scrolls away below it, never behind it. */}
        <li className={styles.band} aria-hidden="true" />
        {/* The crane's perch: holds still on the top card's top-right edge while cards slide under. */}
        <li ref={perchRow} className={styles.perchRow} aria-hidden="true">
          <span ref={perch} className={styles.perch}>
            <PerchPuff at="cards" size={craneWidth} />
            <span ref={fly} className={styles.fly}>
              {/* Tap to refold: crane → rabbit → parrot (the same companion as in the hero). */}
              <Origami className={styles.craneArt}>
                <Image
                  src="/assets/crane-sm.webp"
                  alt=""
                  width={320}
                  height={236}
                  quality={90}
                  sizes="(max-width: 767px) 12vw, 80px"
                  className={styles.craneImg}
                />
              </Origami>
            </span>
          </span>
        </li>
        {projects.map((p, j) => {
          const href = p.image ? caseStudyHref(p.name) : null;
          return (
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
              data-link={href ? "" : undefined}
              // The whole card is the link (the title's link covers it); the View bubble follows the cursor over all of it.
              onPointerMove={href ? follow : undefined}
              onPointerLeave={href ? unfollow : undefined}
            >
              <span className={styles.shade} aria-hidden="true" />
              <span className={styles.grain} aria-hidden="true" />
              <span className={styles.count} aria-hidden="true">
                {pad(j + 1)} / {pad(N)}
              </span>
              {/* Handwritten label (Figma Hand outlines); plain text until its export exists. */}
              <p className={styles.label2}>
                {p.label.art ? (
                  // eslint-disable-next-line @next/next/no-img-element -- a small vector, shown as-is
                  <img src={p.label.art.src} alt={p.label.text} width={p.label.art.w} height={p.label.art.h} className={styles.hand} />
                ) : (
                  p.label.text
                )}
              </p>
              <h3 id={`project-${j}`} className={styles.title}>
                {href ? (
                  <Link href={href} className={styles.stretch}>
                    {p.title ?? p.name}
                  </Link>
                ) : (
                  (p.title ?? p.name)
                )}
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

                {href && p.image ? (
                  <div className={`${styles.media} ${styles.shot}`}>
                    <Shot image={p.image} />
                  </div>
                ) : p.image ? (
                  <div className={`${styles.media} ${styles.shot}`}>
                    <Shot image={p.image} />
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
              {/* Last, so it lies over the content when the next card covers this one. */}
              <span className={styles.dim} aria-hidden="true" />
            </article>
          </li>
          );
        })}
      </ol>

      {bubble}
    </section>
  );
}
