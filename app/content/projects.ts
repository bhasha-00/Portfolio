// Case study cards, in order. Edit freely: the cards and their metric demos are built from this
// list. Wrap a phrase in **double asterisks** to make it bold. Card 01 is the real copy from the
// reference; the rest are placeholders until the real case studies land.

export type Project = {
  /** Result-led card title. */
  title: string;
  problem: string;
  whatIDid: string;
  outcome: string;
  /** Metric demo in the media area: counts from `from` to `to` once the card is well in view. */
  demo: {
    from: number;
    to: number;
    /** Shown after the number, e.g. "%". */
    suffix?: string;
    /** Also draw a bar that fills to `to` percent. */
    bar?: boolean;
  };
  /** Case study page. Not used yet: the cards do not link anywhere for now. */
  href?: string;
};

export const projects: Project[] = [
  {
    title: "Simplified cataloguing from 10 minute guesswork to a scan and confirm flow",
    problem: "300-400 books a batch, **5-10 minutes per title**. Incomplete records broke search.",
    whatIDid:
      "Interviewed librarians to identify friction and unified 7 cataloguing workflows into a scan-and-confirm flow, with clearly defined system states for handoff.",
    outcome: "**~60-70%** less manual entry per title",
    demo: { from: 0, to: 70, suffix: "%", bar: true },
  },
  {
    title: "Cut a 16-module B2B dashboard from 6 clicks to 3",
    problem: "Core tasks were buried across **16 modules** with no shared navigation.",
    whatIDid: "Redesigned navigation, flows and information architecture end to end.",
    outcome: "**6 clicks → 3** for the most common tasks",
    demo: { from: 6, to: 3 },
  },
  {
    title: "Took a support chatbot from FAQ dump to guided setup",
    problem: "Setup questions flooded support; the bot answered with **walls of text**.",
    whatIDid: "Mapped user journeys and designed persona-based conversational flows for guided setup.",
    outcome: "**40%** fewer support queries",
    demo: { from: 0, to: 40, suffix: "%" },
  },
];
