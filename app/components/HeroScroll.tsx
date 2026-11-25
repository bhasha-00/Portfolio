"use client";

import { useEffect } from "react";

// Leaving the hero: as the page scrolls, the text rises a little faster than the page and fades;
// the art sinks towards the bottom of the screen and fades. The art never scrolls up, so its flat
// bottom edge (the drawing is cut by the screen's bottom edge on first view) is never seen.
// The text leaves over half a screen of scrolling; the art is gone by the time the first case study
// card rises into view (sooner on phones, where it follows closely). Transform and opacity only.
// Reduced motion: the art holds still on screen and both only fade.
const RUN = 0.5; // share of the screen height over which the hero leaves
const RISE = 0.12; // extra rise of the text, as a share of the screen height
const SINK = 0.25; // how fast the art sinks on screen, as a share of the scroll
const MIN_RUN = 0.15; // the art never leaves faster than this share of the screen height

export default function HeroScroll() {
  useEffect(() => {
    const text = document.querySelector<HTMLElement>("[data-hero-text]");
    const art = document.querySelector<HTMLElement>("[data-hero-art]");
    const card = document.querySelector<HTMLElement>("#projects li:not([aria-hidden])");
    if (!text || !art) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;

    const update = () => {
      raf = 0;
      const y = Math.max(0, scrollY), vh = innerHeight;
      const p = Math.min(1, y / (vh * RUN));
      // The scroll at which the first card's top enters the screen, less a little.
      const enter = card ? card.getBoundingClientRect().top + y - vh * 0.95 : vh * RUN;
      const q = Math.min(1, y / Math.min(vh * RUN, Math.max(vh * MIN_RUN, enter)));
      const gone = q >= 1;
      const still = reduce.matches;
      text.style.transform = still || !y ? "" : `translateY(${(-RISE * vh * p).toFixed(1)}px)`;
      text.style.opacity = y ? ((1 - p) ** 2).toFixed(3) : ""; // fades early, eases out
      // Undo the scroll (stay put on screen), plus the sink.
      const down = gone ? 0 : y * (still ? 1 : 1 + SINK);
      art.style.transform = down ? `translateY(${down.toFixed(1)}px)` : "";
      art.style.opacity = y ? ((1 - q) ** 2).toFixed(3) : "";
      art.style.visibility = gone ? "hidden" : ""; // out of the way (and the tab order) once gone
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    reduce.addEventListener("change", on);
    return () => {
      removeEventListener("scroll", on);
      removeEventListener("resize", on);
      reduce.removeEventListener("change", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
