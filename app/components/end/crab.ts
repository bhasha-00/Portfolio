import { reflect, type Poly, type Pt, type Step } from "../intro/fold";

// The End section's click-to-fold crab, after the classic waterbomb-base crab. Drawn in the
// 200 × 200 box the fold engine uses; the paper square is 20..180, which the SVG's view box shows
// edge to edge, so the sheet starts exactly where the green photo was.
//
// Each step names the part to click (`target`, outlined in ink) and how it moves:
//   fold: a flap turning on its crease (the fold engine), transform only
//   pop:  a collapse no rigid flap can show, crossfaded (opacity)
//   flip: turning the paper over, a squash through edge-on (scaleX), swapping sides halfway

const mx = (p: Pt): Pt => [200 - p[0], p[1]];
const mirror = (p: Pt[]) => p.map(mx);
const poly = (p: Pt[], s?: number): Poly => ({ p, s });

// Square.
const SQ: Pt[] = [[20, 20], [180, 20], [180, 180], [20, 180]];
// Waterbomb base: a triangle, point down (square 160 → base 160, height 80).
const A: Pt = [20, 60], M: Pt = [100, 60], C: Pt = [180, 60], P: Pt = [100, 140];
// Claws: the front flaps' outer corners fold up on the crease ca→cb.
const ca: Pt = [50, 60], cb: Pt = [70, 110];
const clawFlap: Pt[] = [A, ca, cb];
const claw = reflect(clawFlap, ca, cb); // tip at (71.7, 39.3)
const frontLeft: Pt[] = [ca, M, P, cb];
// Bottom point folds up on y = 110.
const ba: Pt = [70, 110], bb: Pt = [130, 110];
const bottom: Pt[] = [ba, bb, P];
const bottomUp = reflect(bottom, ba, bb); // point at (100, 80)
// Legs: the (now front) outer corners fold down and out on the crease la→lb.
const la: Pt = [85, 60], lb: Pt = [40, 80];
const legFlap: Pt[] = [A, la, lb];
const leg = reflect(legFlap, la, lb); // tip at (41.4, 108.2)

export type CrabStep =
  | { kind: "fold"; target: Pt[]; step: Step }
  | { kind: "pop" | "flip"; target: Pt[]; to: Poly[] };

/** What lies on the table before the first click. */
export const crabStart: Poly[] = [poly(SQ)];

const still = (base: Poly[], folds: Step["folds"], creases: Step["creases"] = []): Step => ({
  d: 0.6, base, folds, creases, o0: [0, 0], o1: [0, 0],
});

// Back view (after the first turn over): the claws peek out behind the triangle.
const clawsBehind = [poly(claw, -0.18), poly(mirror(claw), -0.18)];
const back = poly([A, C, P], 0.05);
const backBody: Pt[] = [A, C, bb, ba]; // after the bottom point is up
const backBodyNoLegs: Pt[] = [la, mx(la), mx(lb), bb, ba, lb];

export const crabSteps: CrabStep[] = [
  // 1. Collapse the square into the waterbomb base.
  { kind: "pop", target: SQ, to: [poly([A, M, P], 0.03), poly([M, C, P], 0.1)] },
  // 2. Left claw: fold the front flap's outer corner up.
  { kind: "fold", target: clawFlap, step: still(
    [poly(frontLeft, 0.03), poly([M, C, P], 0.1)],
    [{ polys: [poly(clawFlap, 0.03)], a: ca, b: cb, c0: 1, c1: -1 }], [[M, P]]) },
  // 3. Right claw, the same on the other side.
  { kind: "fold", target: mirror(clawFlap), step: still(
    [poly(frontLeft, 0.03), poly(claw, -0.18), poly(mirror(frontLeft), 0.1)],
    [{ polys: [poly(mirror(clawFlap), 0.1)], a: mx(ca), b: mx(cb), c0: 1, c1: -1 }], [[M, P]]) },
  // 4. Turn it over.
  { kind: "flip", target: [A, C, P], to: [...clawsBehind, back] },
  // 5. Fold the bottom point up.
  { kind: "fold", target: bottom, step: still(
    [...clawsBehind, poly(backBody, 0.05)],
    [{ polys: [poly(bottom, 0.05)], a: ba, b: bb, c0: 1, c1: -1 }], [[M, [100, 110]]]) },
  // 6. Left leg: fold the outer corner down and out.
  { kind: "fold", target: legFlap, step: still(
    [...clawsBehind, poly([la, C, bb, ba, lb], 0.05), poly(bottomUp, -0.16)],
    [{ polys: [poly(legFlap, 0.05)], a: la, b: lb, c0: 1, c1: -1 }], [[M, [100, 80]]]) },
  // 7. Right leg.
  { kind: "fold", target: mirror(legFlap), step: still(
    [...clawsBehind, poly(backBodyNoLegs, 0.05), poly(bottomUp, -0.16), poly(leg, -0.2)],
    [{ polys: [poly(mirror(legFlap), 0.05)], a: mx(la), b: mx(lb), c0: 1, c1: -1 }], [[M, [100, 80]]]) },
  // 8. Turn it over: the crab, claws up, legs out.
  { kind: "flip", target: [...backBodyNoLegs], to: [
    poly(leg, -0.2), poly(mirror(leg), -0.2),
    poly([ca, mx(ca), mx(cb), cb], 0.03),
    poly(claw, 0.03), poly(mirror(claw), 0.1),
  ] },
];

/** The resting shape after each step, for drawing between clicks. */
export function restAfter(i: number, flat: (s: Step) => Poly[]): Poly[] {
  const s = crabSteps[i];
  return s.kind === "fold" ? flat(s.step) : s.to;
}

/** Vertical offset that keeps a shape centred on the sheet (the paper's centre is y = 100). */
export function centreY(polys: Poly[]) {
  let y0 = Infinity, y1 = -Infinity;
  polys.forEach((q) => q.p.forEach(([, y]) => { y0 = Math.min(y0, y); y1 = Math.max(y1, y); }));
  return 100 - (y0 + y1) / 2;
}
