// AI Tinkering cards. Each card is HTML (AiTinkering.tsx): a media panel on ink, then a cream footer
// with the name pill and the one-liner. The pill (icon + the name in hand lettering) is cut from the
// card art in ai.svg as designed: public/ai/pill-N.svg; `name` gives the same words as text.

export type Tinker = {
  name: string;
  line: string;
  /** Name pill art (icon + hand lettering) and its width in px; every pill is 48px tall. */
  pill: { src: string; w: number };
  /** Media panel image; without one the panel is plain ink (placeholder). */
  media?: { src: string; w: number; h: number; /** object-position for the crop; centred if not given. */ focus?: string; /** Looping clip (MP4, muted) over the still; plays only while the card is in front. */ clip?: string };
  /** The fan: the angle a card swings through on its way out of the stack, in degrees. */
  swing: number;
  /** The same swing in the phone layout. */
  tilt: number;
  /** The tool, opened in a new tab when the front card is clicked. */
  href?: string;
  /** Not out yet: clicking the front card shows the "Coming soon" panel (gf.svg) instead. */
  soon?: boolean;
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
    media: { src: "/ai/exploded-hierarchy.webp", w: 650, h: 660, focus: "50% 77%" }, // Frame 1984079185.svg
    soon: true,
    swing: -3,
    tilt: 3,
  },
  {
    name: "Pixel peeper",
    line: "A Chrome extension that acts like an 'Inspect Element' for design language.",
    pill: { src: "/ai/pill-2.svg", w: 181 },
    media: { src: "/ai/pixel-peeper.webp", w: 1280, h: 664, focus: "34% 0%" }, // Group 1984079186.svg
    href: "https://pixel-peeper-site.vercel.app/",
    swing: -11,
    tilt: -4,
  },
  {
    name: "Slither",
    line: "A pocket-sized throwback to the Nokia snake days.",
    pill: { src: "/ai/pill-3.svg", w: 119 },
    media: { src: "/ai/slither-game.webp", w: 776, h: 820, focus: "50% 40%" },
    href: "https://slither0098.vercel.app/",
    swing: 5,
    tilt: -2,
  },
];
