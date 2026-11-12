"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./VideoArtifact.module.css";

// A prototype recording in her frame (#FBF9F3, #E4D9C2 outline, 16px corners, 53px inset). Nothing
// downloads until it comes into view; then a loader shows until it can play, and it plays from the
// start, muted and looping, each time it comes back. Off screen it pauses. Reduced motion: no
// autoplay, her first frame with the player's controls.

type Props = { src: string; poster: string; w: number; h: number; label: string };

export default function VideoArtifact({ src, poster, w, h, label }: Props) {
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
    const onWaiting = () => setState("loading");
    v.addEventListener("playing", onPlaying);
    v.addEventListener("waiting", onWaiting);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!v.getAttribute("src")) {
            setState("loading");
            v.src = src;
          }
          v.currentTime = 0;
          v.play().catch(() => {});
        } else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => {
      io.disconnect();
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("waiting", onWaiting);
    };
  }, [src]);

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
          poster={state === "still" ? poster : undefined}
          controls={state === "still"}
          src={state === "still" ? src : undefined}
          aria-label={label}
        />
        {state === "loading" && (
          <span className={styles.loader} role="status" aria-label="Loading the prototype" />
        )}
      </div>
    </figure>
  );
}
