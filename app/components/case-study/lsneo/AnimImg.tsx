"use client";

import { useEffect, useRef } from "react";

// One of her GIFs (as animated WebP) that starts from its first frame every time it comes into view:
// an animation keeps its own clock, so each entry swaps in a fresh copy of the same file (a new blob
// URL, from the browser's cache), decoded before it is shown so nothing flashes. Reduced motion shows
// the still first frame and is left alone.

type Props = { src: string; still: string; w: number; h: number; alt: string; className: string };

export default function AnimImg({ src, still, w, h, alt, className }: Props) {
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = img.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let blob: Promise<Blob> | null = null;
    let url = "";
    let seen = false;
    let alive = true;

    const restart = async () => {
      blob ??= fetch(src).then((r) => r.blob());
      const next = URL.createObjectURL(await blob);
      const probe = new Image();
      probe.src = next;
      await probe.decode().catch(() => {});
      if (!alive || !seen) return URL.revokeObjectURL(next);
      el.src = next;
      if (url) URL.revokeObjectURL(url);
      url = next;
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !seen) {
          seen = true;
          restart();
        } else if (!e.isIntersecting) seen = false;
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => {
      alive = false;
      io.disconnect();
      if (url) URL.revokeObjectURL(url);
    };
  }, [src]);

  return (
    <picture>
      <source media="(prefers-reduced-motion: reduce)" srcSet={still} />
      {/* eslint-disable-next-line @next/next/no-img-element -- an animation, served exactly as stored */}
      <img ref={img} className={className} src={src} width={w} height={h} loading="lazy" decoding="async" alt={alt} />
    </picture>
  );
}
