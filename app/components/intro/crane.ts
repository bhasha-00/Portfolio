import { reflect, type Pt, type Step } from "./fold";

// Crane, following the classic sequence: square → triangle → small triangle → square base →
// kite → petal fold (long diamond) → narrowed → tail and neck up → head bent, wings open. 200 × 200 view box.

const SPEED = 0.85; // < 1 is faster

// Square, set as a diamond.
const T: Pt = [100, 20], R: Pt = [180, 100], B: Pt = [100, 180], L: Pt = [20, 100], C: Pt = [100, 100];
// Square (preliminary) base.
const T3: Pt = [100, 43], R3: Pt = [157, 100], B3: Pt = [100, 157], L3: Pt = [43, 100];
// Kite: lower edges folded to the centre line.
const Xr: Pt = [133.4, 76.4], Xl: Pt = [66.6, 76.4], Rp: Pt = [100, 76.4];
// Petal fold lifts the bottom point to here.
const Tp: Pt = [100, -4.2];
// Narrowed edges.
const Qr: Pt = [116, 76.4], Ql: Pt = [84, 76.4], Cm: Pt = [100, 76.4];

const steps: Step[] = [
  // 1. Fold the square in half on the diagonal.
  { d: 0.24, base: [{ p: [L, R, B], s: 0.14 }],
    folds: [{ polys: [{ p: [L, T, R] }], a: L, b: R, c0: 1, c1: -1 }], o0: [0, 0], o1: [0, -40] },
  // 2. Fold the triangle in half.
  { d: 0.22, base: [{ p: [L, C, B], s: 0.1 }], creases: [[C, B]],
    folds: [{ polys: [{ p: [C, R, B], s: -0.18 }], a: C, b: B, c0: 1, c1: -1 }], o0: [0, -40], o1: [40, -40] },
  // 3. Lift the top flap to open it...
  { d: 0.12, base: [{ p: [L, C, B], s: 0.18 }],
    folds: [{ polys: [{ p: [L, C, B], s: -0.12 }], a: C, b: B, c0: 1, c1: 0.1 }], o0: [40, -40], o1: [40, -40] },
  // ...and squash it flat into the square base.
  { d: 0.2, pop: true, base: [{ p: [T3, B3, L3], s: 0.2 }], creases: [[L3, R3]],
    folds: [{ polys: [{ p: [T3, R3, B3], s: -0.14 }], a: T3, b: B3, c0: 0.1, c1: 1 }], o0: [0, 0], o1: [0, 0] },
  // 4. Lower edges to the centre: kite.
  { d: 0.26, base: [{ p: [T3, Xr, B3, Xl], s: 0.06 }], creases: [[T3, B3], [Xl, Xr]],
    folds: [
      { polys: [{ p: [B3, R3, Xr], s: -0.12 }], a: B3, b: Xr, c0: 1, c1: -1 },
      { polys: [{ p: [B3, L3, Xl], s: 0.22 }], a: B3, b: Xl, c0: 1, c1: -1 },
    ], o0: [0, 0], o1: [0, 0] },
  // 5. Petal fold: the bottom point swings up past the top.
  { d: 0.28, base: [{ p: [T3, Xr, B3, Xl], s: 0.26 }], creases: [[T3, B3]],
    folds: [{ polys: [{ p: [B3, Rp, Xr], s: -0.12 }, { p: [B3, Rp, Xl], s: 0.2 }], a: Xl, b: Xr, c0: 1, c1: -1 }],
    o0: [0, 0], o1: [0, 23.6] },
  // 6. Narrow all four edges to the centre.
  { d: 0.26, base: [{ p: [Tp, Xr, B3, Xl], s: 0.08 }], creases: [[Tp, B3], [Xl, Xr]],
    folds: [
      { polys: [{ p: [B3, Xr, Qr], s: -0.1 }], a: B3, b: Qr, c0: 1, c1: -1 },
      { polys: [{ p: [B3, Xl, Ql], s: 0.24 }], a: B3, b: Ql, c0: 1, c1: -1 },
      { polys: [{ p: [Tp, Xr, Qr], s: -0.2 }], a: Tp, b: Qr, c0: 1, c1: -1 },
      { polys: [{ p: [Tp, Xl, Ql], s: 0.16 }], a: Tp, b: Ql, c0: 1, c1: -1 },
    ], o0: [0, 23.6], o1: [0, 23.6] },
  // 7. Reverse-fold the two lower points up: one becomes the tail, the other the neck.
  { d: 0.26,
    base: [{ p: [Tp, Qr, Ql], s: 0.04 }, { p: reflect([Tp, Xr, Qr], Tp, Qr), s: -0.22 }, { p: reflect([Tp, Xl, Ql], Tp, Ql), s: 0.26 }],
    turns: [
      { pivot: [98, 78], a0: 0, a1: 160, polys: [{ p: [Ql, Cm, B3], s: 0.12 }] },
      { pivot: [102, 78], a0: 0, a1: -150, polys: [{ p: [Cm, Qr, B3], s: -0.1 }] },
    ],
    o0: [0, 23.6], o1: [0, 40] },
  // 8. Shape it: bend the head, open the wings. Finished crane, three-quarter view, sitting.
  { d: 0.3, pop: true,
    base: [
      { p: [[110, 124], [186, 140], [126, 140]], s: 0.32 }, // far wing, behind the body, in shade
      { p: [[78, 134], [54, 16], [86, 128]], s: -0.12 }, // tail, lit face
      { p: [[86, 128], [54, 16], [92, 126]], s: 0.2 }, // tail, shade face
      { p: [[84, 130], [106, 110], [108, 150]], s: -0.1 }, // body, lit
      { p: [[106, 110], [128, 132], [108, 150]], s: 0.24 }, // body, shade
      { p: [[118, 136], [150, 38], [126, 136]], s: -0.05 }, // neck, lit
      { p: [[126, 136], [150, 38], [134, 138]], s: 0.26 }, // neck, shade
      { p: [[146, 40], [152, 34], [186, 62], [152, 44]], s: 0.12 }, // head
    ],
    folds: [
      // Near wing, the big one, down to the desk.
      { polys: [{ p: [[86, 134], [108, 150], [16, 186]], s: 0.02 }], a: [86, 134], b: [108, 150], c0: 0.1, c1: 1 },
    ],
    creases: [[[106, 110], [108, 150]]],
    o0: [0, -15], o1: [0, -15] },
];

export const crane = steps.map((s) => ({ ...s, d: s.d * SPEED }));
/** The finished crane, as it rests in the hero. */
export const craneFinal = steps[steps.length - 1];
