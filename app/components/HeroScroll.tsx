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
// The glide: a gentle sine in and out, so its top speed stays low (half again the average) and it
// never lurches.
const easeGlide = (t: number) => (1 - Math.cos(Math.PI * t)) / 2;

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
      // Held only as far as the first case study: past it the text and art (hidden by then) stop
      // following the scroll, or they would push the page longer and longer below the footer.
      const top = card ? card.parentElement!.parentElement!.getBoundingClientRect().top + scrollY : Infinity;
      const y = Math.min(Math.max(0, scrollY), top), vh = innerHeight;
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

    // ---- One swipe ----
    // Between the hero (scroll 0) and the first case study in place (`goal()`) the page never rests:
    // one swipe, wheel turn or key down plays the whole exit above in one eased glide and lands on
    // the card; one up from there plays it back. Input during the glide (and a trackpad's trailing
    // momentum after it) is swallowed, so it never overshoots. Past the first card the page scrolls
    // as normal. Reduced motion: the jump is instant (the fades above simply switch).
    const html = document.documentElement;
    const projects = document.getElementById("projects");
    const GLIDE = 1100; // ms
    const goal = () => (projects ? Math.round(projects.getBoundingClientRect().top + scrollY) : 0);
    let gliding = 0; // rAF id of the glide
    let quietUntil = 0; // swallow wheel momentum until then
    let doneAt = html.dataset.intro === "done" ? -1e9 : Infinity; // when the intro ended
    const ready = () => performance.now() - doneAt > 600; // the input that skipped the intro is not a swipe
    const inZone = (dir: number) => {
      const y = scrollY, g = goal();
      return dir > 0 ? y < g - 1 : y > 1 && y <= g + 1;
    };

    const glide = (to: number) => {
      cancelAnimationFrame(gliding);
      const from = scrollY;
      const behave = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto"; // the page's smooth scroll would fight the glide
      const end = () => {
        gliding = 0;
        html.style.scrollBehavior = behave;
        quietUntil = performance.now() + 450;
      };
      if (reduce.matches || Math.abs(to - from) < 2) {
        scrollTo(0, to);
        return end();
      }
      const t0 = performance.now();
      const step = (now: number) => {
        const t = clamp((now - t0) / GLIDE);
        scrollTo(0, Math.round(from + (to - from) * easeGlide(t)));
        if (t < 1) gliding = requestAnimationFrame(step);
        else end();
      };
      gliding = requestAnimationFrame(step);
    };
    const go = (dir: number) => glide(dir > 0 ? goal() : 0);

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || html.dataset.intro !== "done") return; // pinch zoom; the intro's own skip
      const dir = Math.sign(e.deltaY);
      if (gliding || performance.now() < quietUntil) {
        e.preventDefault();
        if (!gliding) quietUntil = performance.now() + 120; // momentum still coming: keep quiet
        return;
      }
      if (!dir || !inZone(dir)) return;
      e.preventDefault();
      if (ready()) go(dir);
    };

    let touchY: number | null = null;
    let touching = false;
    const onTouchStart = (e: TouchEvent) => {
      touching = true;
      touchY = e.touches.length === 1 ? e.touches[0].clientY : null;
    };
    const onTouchEnd = (e: TouchEvent) => {
      touching = e.touches.length > 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null || html.dataset.intro !== "done") return;
      if (gliding) return e.preventDefault();
      const dy = touchY - e.touches[0].clientY; // > 0: finger up, page down
      const dir = Math.sign(dy);
      if (!dir || !inZone(dir)) return;
      e.preventDefault();
      if (Math.abs(dy) > 12 && ready()) {
        touchY = null;
        go(dir);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (gliding || e.altKey || e.ctrlKey || e.metaKey || html.dataset.intro !== "done") return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === " " && t?.closest("button, a")) return; // Space presses a focused control
      const down = ["ArrowDown", "PageDown", " "].includes(e.key) && !(e.key === " " && e.shiftKey);
      const up = ["ArrowUp", "PageUp"].includes(e.key) || (e.key === " " && e.shiftKey);
      const dir = down ? 1 : up ? -1 : 0;
      if (!dir || !inZone(dir)) return;
      e.preventDefault();
      go(dir);
    };

    // A fling up from the case studies coasts on by itself (no touch or wheel to catch): as it
    // crosses into the stretch, take it over and glide the rest of the way, so it never stops part
    // way and then starts again.
    let lastY = scrollY;
    const onCross = () => {
      const y = scrollY, g = goal();
      if (!gliding && !touching && html.dataset.intro === "done" && lastY >= g - 1 && y < g - 1 && y > 1) glide(0);
      lastY = y;
    };

    // Anything else that leaves the page resting part way (a dragged scrollbar, a restored scroll):
    // finish the glide the nearer way.
    const onScrollEnd = () => {
      if (gliding || html.dataset.intro !== "done") return;
      const y = scrollY, g = goal();
      if (y > 1 && y < g - 1) glide(y > g / 2 ? g : 0);
    };

    const intro = new MutationObserver(() => {
      if (html.dataset.intro === "done" && doneAt === Infinity) doneAt = performance.now();
    });
    intro.observe(html, { attributes: true, attributeFilter: ["data-intro"] });

    measure();
    update();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", onResize);
    addEventListener("wheel", onWheel, { passive: false });
    addEventListener("touchstart", onTouchStart, { passive: true });
    addEventListener("touchmove", onTouchMove, { passive: false });
    addEventListener("touchend", onTouchEnd, { passive: true });
    addEventListener("touchcancel", onTouchEnd, { passive: true });
    addEventListener("scroll", onCross, { passive: true });
    addEventListener("keydown", onKey);
    addEventListener("scrollend", onScrollEnd);
    reduce.addEventListener("change", on);
    return () => {
      removeEventListener("scroll", on);
      removeEventListener("resize", onResize);
      removeEventListener("wheel", onWheel);
      removeEventListener("touchstart", onTouchStart);
      removeEventListener("touchmove", onTouchMove);
      removeEventListener("touchend", onTouchEnd);
      removeEventListener("touchcancel", onTouchEnd);
      removeEventListener("scroll", onCross);
      removeEventListener("keydown", onKey);
      removeEventListener("scrollend", onScrollEnd);
      reduce.removeEventListener("change", on);
      intro.disconnect();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(gliding);
    };
  }, []);

  return null;
}
