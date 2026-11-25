"use client";

import { useEffect } from "react";

// Leaving the hero, scrubbed by scroll. The hero holds still on screen (its text and art are moved
// down by the scroll, so they stay put) while, over RUN of a screen:
//   the text slides up and out of the top of the screen, fading as it goes;
//   the art slides down and out of the bottom, fading as it goes. Its flat bottom edge (the drawing
//   is cut by the screen's bottom edge on first view) only ever moves down, so it is never seen.
// The crane stays where it sat (it is lifted off the desk as the desk drops away) until the first
// case study arrives and it flies onto that card (Projects.tsx). The hero's bottom margin (Hero.module.css)
// is the scroll this takes. Then the first card comes out from the centre: it grows from SMALL to
// full size and fades in as it rises into place.
// Transform and opacity only. Reduced motion: nothing moves; the text, art and card only fade.
const RUN = 0.55; // share of the screen height over which the hero leaves
const SMALL = 0.8; // the first card's starting scale
const PAST = 24; // px past the screen edge the text and art travel, so they are fully out

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
const easeOut = (t: number) => 1 - (1 - t) ** 3;

export default function HeroScroll() {
  useEffect(() => {
    const text = document.querySelector<HTMLElement>("[data-hero-text]");
    const stage = document.querySelector<HTMLElement>("[data-hero-art]");
    const art = stage?.querySelector<HTMLElement>("img");
    const crane = document.querySelector<HTMLElement>("[data-intro-target]");
    const card = document.querySelector<HTMLElement>("#projects article");
    if (!text || !stage || !art || !crane) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    // Where the text ends and the art begins, in page px, without our transforms (measured on resize).
    let textBottom = 0, artTop = 0;

    const measure = () => {
      text.style.transform = stage.style.transform = "";
      const y = scrollY;
      textBottom = text.getBoundingClientRect().bottom + y;
      artTop = stage.getBoundingClientRect().top + y;
    };

    const update = () => {
      raf = 0;
      const y = Math.max(0, scrollY), vh = innerHeight;
      const still = reduce.matches;
      const p = clamp(y / (vh * RUN));
      const e = still ? 0 : easeInOut(p);
      const fade = y ? (1 - clamp((p - 0.25) / 0.75)).toFixed(3) : ""; // holds, then fades out

      const up = e * (textBottom + PAST); // out of the top
      const down = e * (vh - artTop + PAST); // out of the bottom
      text.style.transform = y ? `translateY(${(y - up).toFixed(1)}px)` : "";
      text.style.opacity = fade;
      text.style.visibility = p >= 1 ? "hidden" : "";
      stage.style.transform = y ? `translateY(${(y + down).toFixed(1)}px)` : "";
      art.style.opacity = fade;
      art.style.visibility = p >= 1 ? "hidden" : "";
      crane.style.translate = down ? `0 ${(-down).toFixed(1)}px` : ""; // stays where it sat

      if (card) {
        // 0 as the card's slot comes up into the screen, 1 when it reaches its place at the top.
        const slot = card.parentElement!.getBoundingClientRect().top;
        const c = clamp(1 - slot / (vh * 0.85));
        const s = still ? 1 : SMALL + (1 - SMALL) * easeOut(c);
        card.style.transform = s < 1 ? `scale(${s.toFixed(4)})` : "";
        card.style.opacity = c < 1 ? easeOut(clamp(c / 0.6)).toFixed(3) : "";
      }
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      on();
    };
    measure();
    update();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", onResize);
    reduce.addEventListener("change", on);
    return () => {
      removeEventListener("scroll", on);
      removeEventListener("resize", onResize);
      reduce.removeEventListener("change", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
