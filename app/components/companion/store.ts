import { SHAPES } from "./shapes";

// Which shape the companion is in, shared by the hero crane and the card crane (one companion).
// Mirrored on <html data-shape> so CSS can react (e.g. the hero's crane-shaped cast shadow).

let current = 0;
const subs = new Set<() => void>();

export const getShape = () => current;

export function setShape(i: number) {
  if (i === current) return;
  current = i;
  document.documentElement.dataset.shape = SHAPES[i];
  subs.forEach((f) => f());
}

export function subscribe(f: () => void) {
  subs.add(f);
  return () => {
    subs.delete(f);
  };
}
