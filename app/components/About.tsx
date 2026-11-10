"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { aboutLine, crafts, DESK, PHONE, slots } from "../content/about";
import styles from "./About.module.css";

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const easeOut = (t: number) => 1 - (1 - t) ** 3; // one strong ease-out; never ease-in
const pct = (v: number) => `${(v * 100).toFixed(3)}%`;
const EVERY = 3200; // ms between automatic flips (one slot at a time, round robin)

// Each slot has two faces; `turns` counts half-turns, so the face showing is a on even, b on odd.
type Faces = { a: number; b: number; turns: number };
const showing = (f: Faces) => (f.turns % 2 ? f.b : f.a);

// About. Three cards (one wide, two tall, as in the reference row) sprawl from a centred stack into
// a straight row, one by one, scrubbed by scroll, exactly as AI Tinkering. Then, every few seconds,
// one card flips over (rotateY, transform only) to reveal another piece of the same shape, at the
// same size (the exports are matched, so there is no gap); a tap or click flips it straight away. Hover, focus or tap lifts the card 8px. Phones: the wide card on
// top, the tall pair under it, each swinging in as it comes into view. Reduced motion: no fan and
// no automatic flips; a tap swaps the card without turning it.
export default function About() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const slotEls = useRef<(HTMLDivElement | null)[]>([]);
  const hovered = useRef<boolean[]>(slots.map(() => false));
  const touched = useRef<number[]>(slots.map(() => 0)); // last manual flip, per slot
  const settled = useRef(false); // the fan has finished: automatic flips may start
  const inView = useRef(false);
  const [faces, setFaces] = useState<Faces[]>(() => slots.map((s) => ({ a: s.first, b: s.first, turns: 0 })));

  // Turn slot i over, revealing the next card of its shape that no other slot is showing.
  const flip = useCallback((i: number) => {
    setFaces((prev) => {
      const f = prev[i];
      const others = prev.filter((_, j) => j !== i).map(showing);
      const pool = crafts.map((_, k) => k).filter((k) => crafts[k].shape === slots[i].shape);
      const at = pool.indexOf(showing(f));
      const next = [...pool.slice(at + 1), ...pool.slice(0, at)].find((k) => !others.includes(k));
      if (next === undefined) return prev;
      const turned = f.turns % 2 ? { ...f, a: next } : { ...f, b: next }; // load the hidden face
      return prev.map((g, j) => (j === i ? { ...turned, turns: f.turns + 1 } : g));
    });
  }, []);

  // The fan, scrubbed by scroll (as AiTinkering).
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const wide = matchMedia("(min-width: 768px)");
    let raf = 0;

    const place = (el: HTMLDivElement, dx: number, dy: number, a: number) => {
      el.style.transform = `translate(-50%, -50%) translate(${dx}px, ${dy}px) rotate(${a}deg)`;
      el.style.setProperty("--a", `${a}deg`); // the hover straightens by exactly this much
    };

    const update = () => {
      raf = 0;
      const sec = section.current, st = stage.current;
      if (!sec || !st) return;
      const still = reduce.matches;
      let done = true;

      if (wide.matches) {
        const r = sec.getBoundingClientRect();
        const lead = innerHeight * 0.6, run = sec.offsetHeight - innerHeight;
        const p = still ? 1 : clamp((lead - r.top) / (lead + run * 0.75));
        const W = st.offsetWidth, H = st.offsetHeight;
        slots.forEach((s, i) => {
          const el = slotEls.current[i];
          if (!el) return;
          const t = easeOut(clamp((p - i * 0.2) / 0.5));
          if (t < 1) done = false;
          const sx = (0.5 - s.desk.x / DESK.w) * W + (i - 1) * 6, sy = (0.5 - s.desk.y / DESK.h) * H + (i - 1) * 4;
          place(el, sx * (1 - t), sy * (1 - t), still ? 0 : s.swing * Math.sin(Math.PI * t));
        });
      } else {
        slots.forEach((s, i) => {
          const el = slotEls.current[i];
          if (!el) return;
          const top = st.getBoundingClientRect().top + ((s.phone.y - s.phone.h / 2) / PHONE.h) * st.offsetHeight;
          const t = still ? 1 : easeOut(clamp((innerHeight * 0.98 - top) / (innerHeight * 0.5)));
          if (t < 1) done = false;
          place(el, 0, 48 * (1 - t), still ? 0 : s.tilt * Math.sin(Math.PI * t));
        });
      }
      settled.current = done;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    reduce.addEventListener("change", onScroll);
    wide.addEventListener("change", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      reduce.removeEventListener("change", onScroll);
      wide.removeEventListener("change", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Automatic flips: one slot at a time, only while the row is on screen and settled. A slot being
  // hovered, or flipped by hand in the last few seconds, is skipped.
  // All six cards load (full 3x files) once the section is two screens away: the three a first
  // visit sees first, then the rest, so the row is crisp on arrival and a flip never shows a blank
  // face. Nothing loads with the hero.
  useEffect(() => {
    const sec = section.current;
    if (!sec) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const io = new IntersectionObserver(([e]) => (inView.current = e.isIntersecting), { rootMargin: "50% 0px" });
    const early = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        early.disconnect();
        const first = new Set(slots.map((s) => s.first));
        const order = [...crafts.keys()].sort((x, y) => Number(first.has(y)) - Number(first.has(x)));
        order.forEach((k) => {
          const im = new window.Image();
          im.fetchPriority = first.has(k) ? "high" : "low";
          im.src = crafts[k].src;
        });
      },
      { rootMargin: "200% 0px" },
    );
    io.observe(sec);
    early.observe(sec);
    let next = 0;
    const timer = setInterval(() => {
      if (!inView.current || !settled.current || reduce.matches || document.hidden) return;
      const i = next;
      next = (next + 1) % slots.length;
      if (hovered.current[i] || Date.now() - touched.current[i] < EVERY * 2) return;
      flip(i);
    }, EVERY);
    return () => {
      io.disconnect();
      early.disconnect();
      clearInterval(timer);
    };
  }, [flip]);

  return (
    <section ref={section} id="about" className={styles.about} aria-labelledby="about-title">
      <h2 id="about-title" className="sr-only">
        About
      </h2>
      <div className={styles.pin}>
        <p className={styles.line}>{aboutLine}</p>
        <div ref={stage} className={styles.stage}>
          {slots.map((s, i) => {
            const f = faces[i];
            const now = crafts[showing(f)];
            return (
              <div
                key={i}
                ref={(el) => {
                  slotEls.current[i] = el;
                }}
                className={styles.slot}
                style={
                  {
                    "--dx": pct(s.desk.x / DESK.w),
                    "--dy": pct(s.desk.y / DESK.h),
                    "--dw": pct(s.desk.w / DESK.w),
                    "--px": pct(s.phone.x / PHONE.w),
                    "--py": pct(s.phone.y / PHONE.h),
                    "--pw": pct(s.phone.w / PHONE.w),
                    "--dratio": `${s.desk.w} / ${s.desk.h}`,
                    "--pratio": `${s.phone.w} / ${s.phone.h}`,
                    zIndex: slots.length - i,
                  } as CSSProperties
                }
                onPointerEnter={() => (hovered.current[i] = true)}
                onPointerLeave={() => (hovered.current[i] = false)}
              >
                <button
                  type="button"
                  className={styles.card}
                  aria-label={`${now.name}. Flip to see another piece`}
                  onClick={() => {
                    touched.current[i] = Date.now();
                    flip(i);
                  }}
                >
                  <span className={styles.flipper} style={{ transform: `rotateY(${f.turns * 180}deg)` }}>
                    {(["a", "b"] as const).map((k) => (
                      <span key={k} className={`${styles.face} ${k === "b" ? styles.back : ""}`} aria-hidden="true">
                        <Image
                          src={crafts[f[k]].src}
                          alt=""
                          width={crafts[f[k]].w}
                          height={crafts[f[k]].h}
                          className={styles.art}
                          unoptimized
                        />
                      </span>
                    ))}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
