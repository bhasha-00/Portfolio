"use client";

import { useEffect } from "react";

// A light fade-up as each part of the page comes into view (opacity + transform, CSS in
// CaseStudy.module.css). Content never waits on it: nothing is hidden until this script runs, what is
// already on screen shows at once, and with reduced motion nothing is hidden at all.
export default function Reveal() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = [...document.querySelectorAll<HTMLElement>("[data-reveal-item]")];
    const below = els.filter((el) => el.getBoundingClientRect().top > innerHeight * 0.9);
    below.forEach((el) => el.setAttribute("data-reveal-item", "wait"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-reveal-item", "in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    below.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
