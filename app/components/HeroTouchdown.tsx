"use client";

import { useEffect, useRef, useState } from "react";
import LandingPuff from "./LandingPuff";
import styles from "./Hero.module.css";

/** Fired on window when the crane touches down in the hero (intro landing, hop back from Projects). */
export const CRANE_LAND = "crane:land";

// A point at the hero crane's foot, under the crane. Each touchdown mounts a fresh LandingPuff;
// a new one interrupts the last (new key), and it unmounts itself when done.
export default function HeroTouchdown() {
  const spot = useRef<HTMLSpanElement>(null);
  const [burst, setBurst] = useState<{ n: number; size: number } | null>(null);

  useEffect(() => {
    const land = () => {
      const size = spot.current?.offsetWidth ?? 0;
      if (size) setBurst((b) => ({ n: (b?.n ?? 0) + 1, size }));
    };
    addEventListener(CRANE_LAND, land);
    return () => removeEventListener(CRANE_LAND, land);
  }, []);

  return (
    <span ref={spot} className={styles.touchdown} aria-hidden="true">
      {burst && <LandingPuff key={burst.n} x={0} y={0} size={burst.size} onDone={() => setBurst(null)} />}
    </span>
  );
}
