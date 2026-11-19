"use client";

import { useEffect, useLayoutEffect } from "react";

// Case study artifacts ease in once, as they come on screen: up 16px and from transparent
// (CaseStudy.module.css, [data-reveal]). Only artifacts still below the screen when the page opens
// are held back, so nothing in view ever waits; without this script every artifact is simply there.
// The attribute is removed once the ease-in ends, handing each artifact back its own styles.
// Reduced motion: nothing is held back.
const ARTIFACTS = "main section[id] > figure, main section[id] > div[class*='blues']";

export default function Reveal() {
  // A case study opens at its top. Done here, as the page mounts, rather than left to the router: the
  // card-to-page morph (Projects.tsx) captures the new page right after this, and the page's cover and
  // title must already be where they will rest, on screen. A link to one of its sections (#id) keeps
  // its jump. (While the page mounts, the address may still be home's, e.g. /#projects.) Instant, not
  // the page's smooth scrolling (globals.css), so the top is in place before the capture.
  useLayoutEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id || !document.getElementById(id)) window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = [...document.querySelectorAll<HTMLElement>(ARTIFACTS)].filter(
      (el) => el.getBoundingClientRect().top > innerHeight,
    );
    const done = (e: TransitionEvent) => {
      const el = e.currentTarget as HTMLElement;
      if (e.target !== el || e.propertyName !== "transform") return;
      delete el.dataset.reveal;
      el.removeEventListener("transitionend", done);
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.addEventListener("transitionend", done);
          el.dataset.reveal = "in";
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    for (const el of els) {
      el.dataset.reveal = "";
      io.observe(el);
    }
    return () => {
      io.disconnect();
      for (const el of els) {
        delete el.dataset.reveal;
        el.removeEventListener("transitionend", done);
      }
    };
  }, []);
  return null;
}
