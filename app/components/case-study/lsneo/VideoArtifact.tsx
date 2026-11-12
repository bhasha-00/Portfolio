"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./VideoArtifact.module.css";

// A prototype recording in her frame (#FBF9F3, #E4D9C2 outline, 16px corners, inset like her other
// artifacts). Nothing downloads until it comes into view; each time it does, a loader shows while it
// readies, then it plays from the start, muted and looping. Off screen it pauses. Reduced motion: no
// autoplay, her first frame with the player's controls.

/** `gif`: shown like her GIFs: its first frame at once, no loader, playing from the start on arrival. */
type Props = { src: string; poster: string; w: number; h: number; label: string; gif?: boolean };

export default function VideoArtifact({ src, poster, w, h, label, gif = false }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<"idle" | "loading" | "playing" | "still">("idle");

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState("still");
      return;
    }
    const onPlaying = () => setState("playing");
    const onWaiting = () => !gif && setState("loading");
    v.addEventListener("playing", onPlaying);
    v.addEventListener("waiting", onWaiting);
    // Each arrival: the loader shows while the recording is fetched and readied (at least a moment,
    // so it reads as a beat rather than a flicker; the video is hidden meanwhile), then it plays from
    // the start.
    let shown = 0;
    const ready = () =>
      new Promise<void>((done) => {
        if (v.readyState >= 3) return done();
        v.addEventListener("canplay", () => done(), { once: true });
      });
    const io = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting) {
          v.pause();
          return;
        }
        const turn = ++shown;
        if (!gif) setState("loading");
        if (!v.getAttribute("src")) {
          v.preload = "auto";
          v.src = src;
          v.load();
        }
        v.pause();
        v.currentTime = 0;
        await Promise.all([ready(), new Promise((r) => setTimeout(r, gif ? 0 : 900))]);
        if (turn !== shown) return;
        v.play().catch(() => {});
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => {
      io.disconnect();
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("waiting", onWaiting);
    };
  }, [src, gif]);

  return (
    <figure className={styles.frame}>
      <div className={styles.screen} style={{ aspectRatio: `${w} / ${h}` }}>
        <video
          ref={video}
          className={styles.video}
          width={w}
          height={h}
          muted
          loop
          playsInline
          preload="none"
          poster={gif || state === "still" ? poster : undefined}
          data-hidden={(!gif && (state === "loading" || state === "idle")) || undefined}
          controls={state === "still"}
          src={state === "still" ? src : undefined}
          aria-label={label}
        />
        {state === "loading" && !gif && (
          // Four dots in a square that turn and breathe, as in Figma's prototype loader, with "loading..."
          <span className={styles.loader} role="status">
            <span className={styles.dots} aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className={styles.loading}>loading...</span>
          </span>
        )}
      </div>
    </figure>
  );
}
