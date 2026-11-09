import { crane } from "../intro/crane";
import { reflect, type Poly, type Pt, type Step } from "../intro/fold";

// The companion's three shapes, each folded from the same square on the same 200 × 200 grid as the
// intro crane. Every model ends standing on the crane's ground line (y ≈ 106.6), so all three sit
// in the same spot. The final poses are original drawings in the spirit of the traditional models.

const GROUND = 106.6;

// ---------- Rabbit (traditional cupboard-fold rabbit), white paper ----------
// Square turned from a diamond to sit flat, then: cupboard fold → corners in (pointed hexagon) →
// fold in half → head and ears swing up → the rabbit takes shape.
const a = 43.4, b = 156.6, q1 = 71.7, q3 = 128.3, m = 100, c = 28.3;

// Final rabbit, drawn on a 1024 px sketch grid (facing left), mapped onto the fold grid.
const RK = 0.096;
const r = ([x, y]: Pt): Pt => [96 + (x - 507) * RK, GROUND - (940 - y) * RK];
const rp = (s: number, ...p: Pt[]): Poly => ({ p: p.map(r), s });
const earBack = rp(0.16, [470, 330], [665, 122], [560, 400]);
const earFront = rp(0.04, [400, 330], [580, 92], [520, 360]);

const rabbitSteps: Step[] = [
  // Turn the diamond to a flat square.
  { d: 0.2, base: [], turns: [{ pivot: [100, 100], a0: 45, a1: 0, polys: [{ p: [[a, a], [b, a], [b, b], [a, b]] }] }],
    o0: [0, 0], o1: [0, 0] },
  // 1. Top and bottom edges to the centre (cupboard fold).
  { d: 0.26, base: [{ p: [[a, q1], [b, q1], [b, q3], [a, q3]], s: 0.06 }], creases: [[[a, m], [b, m]]],
    folds: [
      { polys: [{ p: [[a, a], [b, a], [b, q1], [a, q1]], s: -0.1 }], a: [a, q1], b: [b, q1], c0: 1, c1: -1 },
      { polys: [{ p: [[a, q3], [b, q3], [b, b], [a, b]], s: 0.12 }], a: [a, q3], b: [b, q3], c0: 1, c1: -1 },
    ], o0: [0, 0], o1: [0, 0] },
  // 2. Four corners in: a pointed hexagon.
  { d: 0.28, base: [{ p: [[a, m], [a + c, q1], [b - c, q1], [b, m], [b - c, q3], [a + c, q3]], s: 0.1 }], creases: [[[a, m], [b, m]]],
    folds: [
      { polys: [{ p: [[a, q1], [a + c, q1], [a, m]], s: -0.08 }], a: [a + c, q1], b: [a, m], c0: 1, c1: -1 },
      { polys: [{ p: [[b, q1], [b - c, q1], [b, m]], s: -0.08 }], a: [b - c, q1], b: [b, m], c0: 1, c1: -1 },
      { polys: [{ p: [[a, q3], [a + c, q3], [a, m]], s: 0.16 }], a: [a + c, q3], b: [a, m], c0: 1, c1: -1 },
      { polys: [{ p: [[b, q3], [b - c, q3], [b, m]], s: 0.16 }], a: [b - c, q3], b: [b, m], c0: 1, c1: -1 },
    ], o0: [0, 0], o1: [0, 0] },
  // 3. Fold in half along the long middle.
  { d: 0.24, base: [{ p: [[a, m], [b, m], [b - c, q3], [a + c, q3]], s: 0.12 }],
    folds: [{ polys: [{ p: [[a, m], [a + c, q1], [b - c, q1], [b, m]], s: -0.06 }], a: [a, m], b: [b, m], c0: 1, c1: -1 }],
    o0: [0, 0], o1: [0, -14] },
  // 4. Swing the front end up: the head and ears.
  { d: 0.26, base: [{ p: [[a + 42, m], [b, m], [b - c, q3], [a + 42, q3]], s: 0.1 }],
    turns: [{ pivot: [a + 42, m + 4], a0: 0, a1: 60, polys: [{ p: [[a, m], [a + 42, m], [a + 42, q3], [a + c, q3]], s: -0.04 }] }],
    o0: [0, -14], o1: [0, -14] },
  // 5. The rabbit takes shape; the ears lift last.
  { d: 0.3, pop: true,
    base: [
      rp(0.02, [520, 480], [780, 480], [875, 700], [785, 905], [560, 905], [470, 660]),
      rp(0.14, [330, 668], [445, 668], [640, 905], [350, 830]),
      rp(0.22, [310, 900], [600, 860], [780, 915], [360, 940]),
      rp(0, [140, 660], [470, 250], [560, 400], [450, 672]),
      rp(0.2, [140, 660], [170, 628], [172, 668]),
    ],
    turns: [{ pivot: r([500, 330]), a0: -35, a1: 0, polys: [earBack, earFront] }],
    o0: [0, 0], o1: [0, 0] },
];

// ---------- Parrot (traditional kite-base parrot), lime paper ----------
// Diamond → upper edges to the centre (kite) → lower edges too (long diamond) → fold in half →
// tilt into a perch → the parrot takes shape.
const T: Pt = [100, 20], B: Pt = [100, 180], R: Pt = [180, 100], L: Pt = [20, 100];
const Pr: Pt = [146.86, 133.14], Pl: Pt = [53.14, 133.14]; // upper edges land here
const Qr: Pt = [133.2, 100], Ql: Pt = [66.8, 100]; // lower edges land here
const Cc: Pt = [100, 133.1]; // where the upper corners meet on the centre line

// Final parrot, drawn on a 500 px sketch grid facing right, mirrored to face left like the crane.
const PK = 0.19;
const pp = ([x, y]: Pt): Pt => [100 - (x - 245) * PK, GROUND - (520 - y) * PK];
const pq = (s: number, ...p: Pt[]): Poly => ({ p: p.map(pp), s });

const parrotSteps: Step[] = [
  // 1. Upper edges to the centre: kite.
  { d: 0.26, base: [{ p: [T, Pr, B, Pl], s: 0.04 }], creases: [[T, B]],
    folds: [
      { polys: [{ p: [T, R, Pr], s: -0.12 }], a: T, b: Pr, c0: 1, c1: -1 },
      { polys: [{ p: [T, L, Pl], s: 0.2 }], a: T, b: Pl, c0: 1, c1: -1 },
    ], o0: [0, 0], o1: [0, 0] },
  // 2. Lower edges to the centre: a long diamond.
  { d: 0.26,
    base: [{ p: [T, Qr, B, Ql], s: 0.04 }, { p: reflect([T, R, Pr], T, Pr), s: -0.12 }, { p: reflect([T, L, Pl], T, Pl), s: 0.2 }],
    creases: [[T, B]],
    folds: [
      { polys: [{ p: [B, Pr, Qr], s: 0.1 }], a: B, b: Qr, c0: 1, c1: -1 },
      { polys: [{ p: [B, Pl, Ql], s: 0.22 }], a: B, b: Ql, c0: 1, c1: -1 },
    ], o0: [0, 0], o1: [0, 0] },
  // 3. Fold in half down the middle.
  { d: 0.24, base: [{ p: [T, B, Ql], s: 0.1 }, { p: [T, Cc, Ql], s: 0.2 }],
    folds: [{ polys: [{ p: [T, Qr, B], s: -0.06 }], a: T, b: B, c0: 1, c1: -1 }],
    o0: [0, 0], o1: [10, -20] },
  // 4. Tilt onto the perch.
  { d: 0.26, base: [],
    turns: [{ pivot: [90, 100], a0: 0, a1: -24, polys: [{ p: [T, B, Ql], s: 0.1 }, { p: [T, Cc, Ql], s: 0.2 }] }],
    o0: [10, -20], o1: [10, -20] },
  // 5. The parrot takes shape; the head turns last.
  { d: 0.3, pop: true,
    base: [
      pq(0.08, [430, 548], [470, 520], [410, 690]),
      pq(0.02, [70, 345], [212, 350], [470, 520], [430, 548]),
      pq(0.12, [212, 350], [388, 338], [470, 520]),
      pq(-0.04, [70, 345], [200, 170], [212, 350]),
      pq(0.06, [200, 170], [388, 338], [212, 350]),
      pq(0.2, [200, 520], [280, 462], [372, 520]),
    ],
    turns: [{
      pivot: pp([120, 300]), a0: -30, a1: 0,
      polys: [
        pq(0.02, [20, 252], [68, 96], [150, 82], [172, 158]),
        pq(-0.06, [20, 252], [172, 158], [200, 170], [70, 345]),
        pq(0.16, [150, 82], [208, 98], [190, 158], [184, 114], [168, 152]),
      ],
    }],
    o0: [0, 0], o1: [0, 0] },
];

export const SHAPES = ["crane", "rabbit", "parrot"] as const;
export type Shape = (typeof SHAPES)[number];

/** Folds from the square to each shape. The crane ends on its folded base; the illustration takes over. */
export const sequences: Step[][] = [crane, rabbitSteps, parrotSteps];

/** The same folds played backwards: from the finished shape out to the flat square. */
export function unfold(steps: Step[]): Step[] {
  const turnBack = (t: NonNullable<Step["turns"]>[number]): NonNullable<Step["turns"]>[number] => ({
    ...t, a0: t.a1, a1: t.a0, child: t.child && turnBack(t.child),
  });
  const out = steps
    .map((s) => ({
      ...s,
      pop: false,
      folds: s.folds?.map((f) => ({ ...f, c0: f.c1, c1: f.c0 })),
      turns: s.turns?.map(turnBack),
      o0: s.o1,
      o1: s.o0,
    }))
    .reverse();
  // A jump into forward step k (pop) is, backwards, a jump into what was step k - 1.
  steps.forEach((s, k) => {
    if (s.pop && k > 0) out[steps.length - k].pop = true;
  });
  return out;
}
