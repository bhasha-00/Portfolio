// Crane flight paths: a cubic Bézier sampled into Web Animations keyframes (transform only).
// The crane art faces left. It turns (mirrors through a narrow scaleX) when its heading points
// right, tilts along the tangent (gently, clamped), and settles level and facing left to land.

export type Pt = { x: number; y: number };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

const bez = (P: Pt[], t: number): Pt => {
  const u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  return { x: a * P[0].x + b * P[1].x + c * P[2].x + d * P[3].x, y: a * P[0].y + b * P[1].y + c * P[2].y + d * P[3].y };
};

const tangent = (P: Pt[], t: number): Pt => {
  const u = 1 - t, a = 3 * u * u, b = 6 * u * t, c = 3 * t * t;
  return {
    x: a * (P[1].x - P[0].x) + b * (P[2].x - P[1].x) + c * (P[3].x - P[2].x),
    y: a * (P[1].y - P[0].y) + b * (P[2].y - P[1].y) + c * (P[3].y - P[2].y),
  };
};

/**
 * Control points, in viewport px, for a path drawn from `a` (higher) to `b` (lower).
 * "dive": hero → card. Arcs left and down, then sweeps right into the card's bottom-right corner.
 * "hop":  card → next card. A short arc up and over.
 */
export function controls(a: Pt, b: Pt, kind: "dive" | "hop"): Pt[] {
  const L = clamp(innerWidth * 0.3, 90, 380);
  const minX = 24; // keep the swing on screen
  if (kind === "dive") {
    const dy = b.y - a.y;
    return [
      a,
      { x: Math.max(minX, a.x - 0.7 * L), y: a.y + 0.3 * dy },
      { x: Math.max(minX, b.x - 1.2 * L), y: b.y },
      b,
    ];
  }
  return [
    a,
    { x: Math.max(minX, a.x - 0.3 * L), y: Math.min(a.y, b.y) - 70 },
    { x: Math.max(minX, b.x - 0.4 * L), y: b.y - 50 },
    b,
  ];
}

/**
 * Keyframes along P (already in the flying element's own frame: 0,0 = its resting foot).
 * `rev` flies the path backwards (end to start). Scale goes s0 → s1 over the flight.
 */
export function flightFrames(P: Pt[], s0: number, s1: number, rev: boolean): Keyframe[] {
  const K = 40;
  const out: Keyframe[] = [];
  for (let k = 0; k <= K; k++) {
    const u = k / K;
    const e = easeInOut(u);
    const t = rev ? 1 - e : e;
    const p = bez(P, t);
    let d = tangent(P, clamp(t, 0.001, 0.999));
    if (rev) d = { x: -d.x, y: -d.y };
    const len = Math.hypot(d.x, d.y) || 1;

    // Last 18%: level out and face left, ready to sit.
    const l = u < 0.82 ? 0 : (u - 0.82) / 0.18;
    const settle = l * l * (3 - 2 * l);

    // First 15%: take off level, easing into the turn and tilt.
    const o = Math.min(1, u / 0.15);
    const lift = o * o * (3 - 2 * o);

    let face = clamp(-d.x / (len * 0.35), -1, 1); // 1 = facing left (as drawn), -1 = mirrored
    face = 1 + (face - 1) * lift;
    face += (1 - face) * settle;
    if (Math.abs(face) < 0.05) face = face < 0 ? -0.05 : 0.05; // never fully edge-on

    const phi = (Math.atan2(d.y, d.x) * 180) / Math.PI;
    let rot = face >= 0 ? phi - 180 : phi;
    rot = ((rot + 540) % 360) - 180;
    rot = clamp(rot, -28, 28) * lift * (1 - settle);

    const s = s0 + (s1 - s0) * e;
    out.push({
      transform: `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px) rotate(${rot.toFixed(1)}deg) scale(${(face * s).toFixed(3)}, ${s.toFixed(3)})`,
    });
  }
  return out;
}
