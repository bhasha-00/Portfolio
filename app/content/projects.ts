// Projects shown in the pinned Projects panel, in order. Edit freely: the tabs, cards and
// metric demos are all built from this list. Placeholders until the real case studies land.

export type Project = {
  /** Card title, under "PROJECT 01". */
  title: string;
  /** One short line under the title. */
  summary: string;
  role: string;
  /** The result, as a short phrase. Also read out to screen readers for the demo. */
  outcome: string;
  /** Metric demo: counts from `from` to `to` when the project's tab becomes active. */
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
    title: "B2B dashboard, 16 modules",
    summary: "Redesigned navigation, flows and IA.",
    role: "End-to-end design",
    outcome: "6 clicks → 3",
    demo: { from: 6, to: 3 },
  },
  {
    title: "Accessibility, WCAG 2.1",
    summary: "47 critical issues found and fixed.",
    role: "Audit + design system",
    outcome: "85% fewer violations",
    demo: { from: 0, to: 85, suffix: "%", bar: true },
  },
  {
    title: "Chatbot, conversational UI",
    summary: "Persona-based flows for guided setup.",
    role: "UX + journey mapping",
    outcome: "40% fewer support queries",
    demo: { from: 0, to: 40, suffix: "%" },
  },
];
