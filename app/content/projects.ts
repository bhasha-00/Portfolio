// Case study cards, in order. Edit freely: the cards and their metric demos are built from this
// list. Text is shown exactly as written here.

export type Project = {
  /** Project name (shown as the title until a result-led `title` is written). */
  name: string;
  /** Result-led card title. */
  title?: string;
  /** Handwritten label above the title (Figma Hand, as cs.svg). `art`: its outlines exported from
      Figma, in public/projects; until a label has one, its text is shown plainly. */
  label: { text: string; art?: { src: string; w: number; h: number } };
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
  /** Media image, shown in place of a demo. `src`: raster (phones, resized by Next). `svg`: the
      full-resolution SVG export, shown as-is on desktop. Both in public/projects. */
  image?: { src: string; svg?: string; alt: string };
  /** Case study page. Not used yet: the cards do not link anywhere for now. */
  href?: string;
};

export const projects: Project[] = [
  {
    name: "LSNeo Lite",
    label: { text: "Optimizing workflow", art: { src: "/projects/label-optimizing-workflow.svg", w: 158.8, h: 19 } },
    title: "Simplified cataloguing from 10-minute guesswork to a scan-and-confirm flow",
    problem: "Librarians added 300-400 books a batch, **5-10 minutes each**. Tedious entry led to incomplete records, which broke search.",
    whatIDid:
      "Talked to librarians to find what slowed them down. Merged 7 ways of adding a book into one scan-and-confirm flow, with every state documented for handoff.",
    outcome: "**~60-70%** less manual entry per title",
    image: { src: "/projects/lsneo-cataloguing.webp", svg: "/projects/lsneo-cataloguing.svg", alt: "LSNeo Lite cataloguing screens: the catalogue setup checklist and the new title entry form." },
  },
  {
    name: "Design system",
    label: { text: "Design system", art: { src: "/projects/label-design-system.svg", w: 91.43, h: 16.01 } },
    title: "Turned static frames into a tokenized design system",
    problem:
      "Every designer drew their own components, with no tokens or variants. A new designer took a month or more to match the look.",
    whatIDid: "Listed every existing element and when to use each. Built a 3-layer token system: Brand → Alias → Mapped.",
    outcome: "**26 components**, **150+ variants** across width, state, icon, and helper text.",
    image: { src: "/projects/design-system.webp", svg: "/projects/design-system.svg", alt: "Mapped design system in Figma: colour tokens and the input field component with 48 variants." },
  },
  {
    name: "Chatbot",
    label: { text: "Conversational bot", art: { src: "/projects/label-conversational-bot.svg", w: 121.43, h: 16.01 } },
    title: "Optimizing response syntax for chatbot adoption",
    problem:
      "Lack of query guidance led admins to enter vague queries with unclear errors, **leaving users unsure of the bot’s capabilities and limitations**.",
    whatIDid:
      "Reviewed the bot as a new user and watched real use. Redesigned the flow and responses, and set component rules the admin team adopted.",
    outcome: "**~40%** fewer support queries",
    image: { src: "/projects/support-chatbot.webp", svg: "/projects/support-chatbot.svg", alt: "Support query chatbot: the redesigned assistant with guided queries, next to the before and phase II versions." },
  },
  {
    name: "NOVA",
    label: { text: "Visualization", art: { src: "/projects/label-visualization.svg", w: 81.56, h: 16.01 } },
    title: "From firefighting to foresight: making batch load visible before it overloads the system",
    problem:
      "A 30-year-old platform was struggling at scale. One failing batch stalls 300,000 reports, making teams spend days firefighting.",
    whatIDid:
      "Designed the module’s dashboards and workflows. Added a pipeline view that shows load against capacity, and widgets for frequent tasks.",
    outcome: "**6 → 3 clicks** on frequent tasks, and batch load is visible before it overloads.",
    note: "*In client testing, not yet in production.",
    image: { src: "/projects/nova-reporting.webp", svg: "/projects/nova-reporting.svg", alt: "NOVA financial reporting platform: pipeline throughput chart, queue metrics and the active jobs table." },
  },
];
