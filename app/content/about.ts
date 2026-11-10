// About cards. The art (cream frame, photo, handwritten caption pill, shadow) is exported from the
// card SVGs as drawn: public/about/*.webp, 1040px wide. The caption is drawn into the art, so `name`
// is its text for screen readers and search.

export type Craft = {
  name: string;
  src: string;
  /** Art size in px. */
  w: number;
  h: number;
};

const charcoal: Craft = { name: "Charcoal sketching", src: "/about/charcoal.webp", w: 1040, h: 1502 };
const sanjhi: Craft = { name: "Sanjhi, paper cutting craft", src: "/about/sanjhi.webp", w: 1040, h: 664 };
const gourd: Craft = { name: "Gourd lamp", src: "/about/gourd-lamp.webp", w: 1040, h: 1512 };
const print: Craft = { name: "Print design", src: "/about/print.webp", w: 1040, h: 793 };
const clock: Craft = { name: "Clock designed using sanjhi", src: "/about/clock.webp", w: 1040, h: 1512 };
const paper: Craft = { name: "Paper sculpture", src: "/about/paper.webp", w: 1040, h: 866 };

/** One row, left to right, in the reference's order. */
export const crafts: Craft[] = [charcoal, sanjhi, gourd, print, clock, paper];

export const aboutLine = "From an industrial design background, I have always been curious why things work the way they do";
