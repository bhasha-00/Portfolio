// AI Tinkering cards. Each card is HTML (AiTinkering.tsx): a media panel on ink, then a cream footer
// with the name pill and the one-liner. The pill (icon + the name in hand lettering) is cut from the
// card art in ai.svg as designed: public/ai/pill-N.svg; `name` gives the same words as text.

export type Tinker = {
  name: string;
  line: string;
  /** Name pill art (icon + hand lettering) and its width in px; every pill is 48px tall. */
  pill: { src: string; w: number };
  /** Media panel image; without one the panel is plain ink (placeholder). */
  media?: { src: string; w: number; h: number };
  /** The fan: the angle a card swings through on its way out of the stack, in degrees. */
  swing: number;
  /** The same swing in the phone layout. */
  tilt: number;
  /** Tool page. Not used yet: the cards do not link anywhere for now. */
  href?: string;
};

/** Height of every name pill, in px at the card's full size. */
export const PILL_H = 48;

// Order of the ring: the first card starts in front, the second on the left, the third on the right
// (ai.svg). Bringing a side card to the front turns the ring, so the cards keep this order.
export const tinkers: Tinker[] = [
  {
    name: "Exploded Hierarchy",
    line: "A Figma plugin that turns a flat design into layers, so you can judge what the eye reads first.",
    pill: { src: "/ai/pill-1.svg", w: 201 },
    swing: -3,
    tilt: 3,
  },
  {
    name: "Pixel peeper",
    line: "A Chrome extension that acts like an 'Inspect Element' for design language.",
    pill: { src: "/ai/pill-2.svg", w: 181 },
    swing: -11,
    tilt: -4,
  },
  {
    name: "Slither",
    line: "A pocket-sized throwback to the Nokia snake days.",
    pill: { src: "/ai/pill-3.svg", w: 119 },
    media: { src: "/ai/slither.webp", w: 1323, h: 971 },
    swing: 5,
    tilt: -2,
  },
];
