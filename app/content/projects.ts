// Case study cards, in order. Edit freely: the cards and their metric demos are built from this
// list. Text is shown exactly as written here.

export type Project = {
  /** Project name (shown as the title until a result-led `title` is written). */
  name: string;
  /** Result-led card title. */
  title?: string;
  problem: string;
  whatIDid: string;
  outcome: string;
  /** Small footnote under the outcome, e.g. a caveat. */
  note?: string;
  /** Metric demo in the media area: counts from `from` to `to` once the card is well in view.
      Leave it out to show an empty media area. */
  demo?: {
    from: number;
    to: number;
    /** Shown before / after the number, e.g. "~" and "%". */
    prefix?: string;
    suffix?: string;
    /** Also draw a bar that fills to `to` percent. */
    bar?: boolean;
  };
  /** Case study page. Not used yet: the cards do not link anywhere for now. */
  href?: string;
};

export const projects: Project[] = [
  {
    name: "LSNeo Lite",
    title: "Simplified cataloguing from 10 minute guesswork to a scan and confirm flow",
    problem: "Librarians added 300-400 books a batch, 5-10 minutes each. Incomplete records broke search.",
    whatIDid:
      "Talked to librarians to find what slowed them down. Merged 7 ways of adding a book into one scan-and-confirm flow, with every state documented for handoff.",
    outcome: "~60-70% less manual entry per title",
    demo: { from: 0, to: 60, prefix: "~", suffix: "-70%", bar: true },
  },
  {
    name: "Design system",
    title: "Turned static frames into a tokenized design system",
    problem:
      "Every designer drew their own components, with no tokens or variants. A new designer took a month or more to match the look.",
    whatIDid: "Listed every existing element and when to use each. Built a 3-layer token system: Brand → Alias → Mapped.",
    outcome: "26 components, each with real variants. 150+ variants across width, state, icon, and helper text.",
    demo: { from: 0, to: 150, suffix: "+" },
  },
  {
    name: "Chatbot",
    title: "Optimizing response syntax for chatbot adoption",
    problem:
      "Lack of query guidance led admins to enter vague queries, while unclear errors left users unsure of the bot’s capabilities and limitations.",
    whatIDid:
      "Reviewed the bot as a new user and watched real use. Redesigned the flow and responses, and set component rules the admin team adopted.",
    outcome: "~40% fewer support queries",
    demo: { from: 0, to: 40, prefix: "~", suffix: "%" },
  },
  {
    name: "NOVA",
    title: "From firefighting to foresight : Making batch load visible before it overloads the system",
    problem:
      "A 30-year-old platform was struggling at scale. One batch could stall 300,000 reports, and the ops team spent its days firefighting.",
    whatIDid:
      "Designed the module’s dashboards and workflows. Added a pipeline view that shows load against capacity, and widgets for frequent tasks, so work stays in one flow.",
    outcome: "6 → 3 clicks on frequent tasks, and batch load is visible before it overloads.",
    note: "*In client testing, not yet in production.",
    demo: { from: 6, to: 3, suffix: " clicks" },
  },
  {
    name: "BlaBlaCar (concept)",
    title: "Redesigning the search to evaluation journey to improve activation",
    problem:
      "Riders couldn’t tell if a ride fit their route. Checking meant leaving the app, and nothing remembered the answer for the next trip.",
    whatIDid:
      "Interviewed 7 people to learn their workarounds. Redesigned listings around the rider’s route, with help for low results and quick rebooking. Validated the experience through a live prototype and usability testing.",
    outcome: "Reduced time spent to book a ride",
  },
];
