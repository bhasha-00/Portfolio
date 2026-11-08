// Paper fold engine. Every motion is a transform: a flap turning on its crease is drawn as the
// orthographic projection of a 3D rotation, which is a 2D affine matrix. Light and underside
// tones are opacity changes on overlay polygons. No geometry is animated.

export type Pt = [number, number];
/** A paper face. s > 0 darkens with ink, s < 0 lightens with the paper's back colour. */
export type Poly = { p: Pt[]; s?: number };
/** A flap turning on the crease a→b. c is the projected cosine: 1 flat, 0 edge-on, -1 folded over. */
export type Fold = { polys: Poly[]; a: Pt; b: Pt; c0: number; c1: number };
/** A flap swinging in the plane around a pivot (reverse folds, the neck and head). */
export type Turn = { polys: Poly[]; pivot: Pt; a0: number; a1: number; child?: Turn };
export type Step = {
  d: number; // seconds
  base: Poly[];
  creases?: [Pt, Pt][];
  folds?: Fold[];
  turns?: Turn[];
  o0: Pt; // group offset at start / end, keeps the model centred
  o1: Pt;
  pop?: boolean; // shape changes in a way a rigid flap cannot show: crossfade from the last frame
};

export type Classes = { paper: string; shade: string; lite: string; crease: string; shadow: string };

const NS = "http://www.w3.org/2000/svg";
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const pts = (p: Pt[]) => p.map(([x, y]) => `${x},${y}`).join(" ");

export function reflect(poly: Pt[], a: Pt, b: Pt): Pt[] {
  const [ux, uy] = unit(a, b);
  return poly.map(([x, y]) => {
    const dx = x - a[0], dy = y - a[1], t = dx * ux + dy * uy;
    const px = a[0] + t * ux, py = a[1] + t * uy;
    return [2 * px - x, 2 * py - y];
  });
}

function unit(a: Pt, b: Pt): Pt {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
  return [dx / l, dy / l];
}

/** Matrix that squashes everything across the crease a→b by c (the projected fold). */
function foldMatrix(a: Pt, b: Pt, c: number) {
  const [ux, uy] = unit(a, b), nx = -uy, ny = ux;
  const m00 = ux * ux + c * nx * nx, m01 = ux * uy + c * nx * ny, m11 = uy * uy + c * ny * ny;
  const e = a[0] - (m00 * a[0] + m01 * a[1]), f = a[1] - (m01 * a[0] + m11 * a[1]);
  return `matrix(${m00},${m01},${m01},${m11},${e},${f})`;
}

const rot = (p: Pt, deg: number) => `translate(${p[0]}px,${p[1]}px) rotate(${deg}deg) translate(${-p[0]}px,${-p[1]}px)`;

function make<K extends keyof SVGElementTagNameMap>(tag: K, parent: Element, cls?: string, attrs: Record<string, string> = {}) {
  const el = document.createElementNS(NS, tag);
  if (cls) el.setAttribute("class", cls);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  parent.appendChild(el);
  return el;
}

function face(g: Element, poly: Poly, k: Classes) {
  const p = pts(poly.p);
  make("polygon", g, k.paper, { points: p });
  if (poly.s && poly.s > 0) make("polygon", g, k.shade, { points: p, opacity: String(poly.s) });
  if (poly.s && poly.s < 0) make("polygon", g, k.lite, { points: p, opacity: String(-poly.s) });
}

type Live = { update: (e: number) => void };

function buildStep(world: SVGGElement, step: Step, k: Classes): Live {
  world.replaceChildren();
  step.base.forEach((p) => face(world, p, k));
  step.creases?.forEach(([a, b]) =>
    make("line", world, k.crease, { x1: String(a[0]), y1: String(a[1]), x2: String(b[0]), y2: String(b[1]) }),
  );

  // Soft shadow under each lifted flap, then the flaps themselves.
  const shadows = (step.folds ?? []).map((f) => {
    const g = make("g", world, k.shadow);
    f.polys.forEach((p) => make("polygon", g, undefined, { points: pts(p.p) }));
    return g;
  });
  const flaps = (step.folds ?? []).map((f) => {
    const g = make("g", world);
    const lite: SVGElement[] = [], under: SVGElement[] = [];
    f.polys.forEach((p) => {
      face(g, p, k);
      lite.push(make("polygon", g, k.lite, { points: pts(p.p), opacity: "0" }));
      under.push(make("polygon", g, k.shade, { points: pts(p.p), opacity: "0" }));
    });
    return { g, lite, under };
  });

  const turnEls: { g: SVGGElement; t: Turn }[] = [];
  const addTurn = (parent: Element, t: Turn) => {
    const g = make("g", parent);
    t.polys.forEach((p) => face(g, p, k));
    turnEls.push({ g, t });
    if (t.child) addTurn(g, t.child);
  };
  step.turns?.forEach((t) => addTurn(world, t));

  return {
    update(e) {
      const o: Pt = [lerp(step.o0[0], step.o1[0], e), lerp(step.o0[1], step.o1[1], e)];
      world.style.transform = `translate(${o[0]}px,${o[1]}px)`;
      (step.folds ?? []).forEach((f, i) => {
        const c = lerp(f.c0, f.c1, e);
        const lift = Math.sqrt(Math.max(0, 1 - c * c)); // how far the flap stands off the paper
        const m = foldMatrix(f.a, f.b, c);
        flaps[i].g.style.transform = m;
        // Edge-on, the face catches the light; past vertical, we see its shaded underside.
        flaps[i].lite.forEach((el) => (el.style.opacity = String(0.55 * lift)));
        flaps[i].under.forEach((el) => (el.style.opacity = String(c < 0 ? 0.1 * lift : 0)));
        shadows[i].style.transform = `translate(${1.5 * lift}px,${3 * lift}px) ${m}`;
        shadows[i].style.opacity = String(0.22 * lift);
      });
      turnEls.forEach(({ g, t }) => (g.style.transform = rot(t.pivot, lerp(t.a0, t.a1, e))));
    },
  };
}

/** Plays the steps in order. Returns a cancel function. */
export function play(svg: SVGSVGElement, world: SVGGElement, steps: Step[], k: Classes, done: () => void) {
  let i = -1, start = 0, raf = 0, live: Live | null = null, ghost: SVGGElement | null = null;

  const next = (now: number) => {
    i++;
    if (i >= steps.length) return done();
    if (steps[i].pop) {
      ghost?.remove();
      ghost = world.cloneNode(true) as SVGGElement;
      svg.insertBefore(ghost, world);
    }
    live = buildStep(world, steps[i], k);
    live.update(0);
    start = now;
  };

  const frame = (now: number) => {
    if (!live) next(now);
    const s = steps[i];
    const t = Math.min(1, (now - start) / 1000 / s.d);
    live!.update(ease(t));
    if (ghost) {
      const f = Math.min(1, (now - start) / 120);
      ghost.style.opacity = String(1 - f);
      world.style.opacity = String(f);
      if (f >= 1) { ghost.remove(); ghost = null; }
    }
    if (t >= 1) {
      next(now);
      if (i >= steps.length) return;
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

/** Draws one step at progress e (0..1), without motion. Used for checks in development. */
export function frameAt(world: SVGGElement, steps: Step[], k: Classes, i: number, e: number) {
  world.style.opacity = "1";
  buildStep(world, steps[i], k).update(ease(e));
}
