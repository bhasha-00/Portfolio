// AI Tinkering cards, left to right. The card art (name pill, icon, one-liner, media panel) is cut
// from ai.svg exactly as designed: public/ai/card-N.svg. The text here is the same copy, for screen
// readers and search (the art's text is drawn as shapes).

export type Tinker = {
  name: string;
  line: string;
  /** Card art, upright, in public/ai. */
  art: string;
  /** Art size in px (its viewBox). */
  w: number;
  h: number;
  /** Where the card lands, from the reference layout (1522 × 768): centre in %. Cards land upright. */
  x: number;
  y: number;
  /** The fan: the angle a card swings through on its way out of the stack, in degrees. */
  swing: number;
  /** The same swing in the phone layout (vertical stack). */
  tilt: number;
  /** Tool page. Not used yet: the cards do not link anywhere for now. */
  href?: string;
};

// Cards land upright in one straight row. On the way out of the stack each swings through the fan
// angle (an equal 8° step: -11 / -3 / +5) and settles to 0.
export const tinkers: Tinker[] = [
  {
    name: "Exploded Hierarchy",
    line: "A Figma plugin that turns a flat design into layers, so you can judge what the eye reads first.",
    art: "/ai/card-1.svg",
    w: 419,
    h: 448,
    x: 18.8,
    y: 50,
    swing: -11,
    tilt: -4,
  },
  {
    name: "Pixel peeper",
    line: "A Chrome extension that acts like an 'Inspect Element' for design language.",
    art: "/ai/card-2.svg",
    w: 413.5,
    h: 444,
    x: 50.1,
    y: 50,
    swing: -3,
    tilt: 3,
  },
  {
    name: "Slither",
    line: "A pocket-sized throwback to the Nokia snake days",
    art: "/ai/card-3.svg",
    w: 414.5,
    h: 444.8,
    x: 81.3,
    y: 50,
    swing: 5,
    tilt: -2,
  },
];
