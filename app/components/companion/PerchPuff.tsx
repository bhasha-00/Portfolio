"use client";

import { useEffect, useState } from "react";
import LandingPuff from "../LandingPuff";

/** Puff under a perch when the crane lands there (`crane:land` with detail.at === at). */
export default function PerchPuff({ at, size }: { at: string; size: () => number }) {
  const [burst, setBurst] = useState<{ n: number; s: number } | null>(null);
  useEffect(() => {
    const land = (e: Event) => {
      if ((e as CustomEvent).detail?.at !== at) return;
      const s = size();
      if (s) setBurst((b) => ({ n: (b?.n ?? 0) + 1, s }));
    };
    addEventListener("crane:land", land);
    return () => removeEventListener("crane:land", land);
  }, [at, size]);
  return burst ? <LandingPuff key={burst.n} x={0} y={0} size={burst.s} onDone={() => setBurst(null)} /> : null;
}
