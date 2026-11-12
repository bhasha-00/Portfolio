// Case study pages (app/case-studies/[slug]). Copy is exactly as on Bhasha's Framer case studies.
// Inline marks in text: **bold**, __italic__ (rich.tsx). Artifacts are placeholders until the files
// are supplied: each keeps the shape it has on Framer (`ratio`, width / height), so swapping in the
// real file later does not move the page.

export type Media = {
  /** What it is, shown on the placeholder and used as the alt text / label once the file is in. */
  label: string;
  kind: "image" | "video";
  /** Width / height, as on Framer. */
  ratio: number;
  /** The file in public/case-studies/<slug>/, once supplied. */
  src?: string;
};

export type Block =
  | { type: "p"; text: string }
  /** Sub-heading inside a section ("What I saw", "Duplicate flow"). */
  | { type: "h3"; text: string }
  /** Small label above an artifact ("Walkthrough", "Prototype"). */
  | { type: "label"; text: string }
  /** Tinted box with a title ("Brief", "HMW"). */
  | { type: "callout"; title: string; text: string }
  | { type: "stats"; items: { value: string; label: string }[] }
  | { type: "media"; media: Media }
  | { type: "table"; head: string[]; rows: string[][] };

export type Section = {
  /** Anchor id. */
  id: string;
  /** Tab in the top bar; sections without one are not in the bar. */
  tab?: string;
  eyebrow: string;
  title: string;
  blocks: Block[];
};

export type CaseStudy = {
  slug: string;
  /** Its card on the home page (project name in content/projects.ts). */
  project: string;
  product: string;
  year: string;
  title: string;
  meta: { label: string; value: string }[];
  hero: Media;
  sections: Section[];
  /** "Explore more": the other case studies, by project name in content/projects.ts (for the cover),
   *  with the title as Framer shows it. */
  more: { project: string; title: string }[];
};

const lsneo: CaseStudy = {
  slug: "redesigning-cataloguing-from-a-10-minute-guess-to-a-scan-and-confirm",
  project: "LSNeo Lite",
  product: "LSNeo Lite",
  year: "2026",
  title: "Redesigned cataloguing from a 10 minute guess to a scan and confirm flow; cutting manual entry by 60-70%.",
  meta: [
    { label: "Role", value: "UX/UI Designer; responsible for research, IA, design and handoff" },
    { label: "Timeline", value: "2 Weeks" },
    { label: "Team", value: "1 Designer, 1PM and 1 stakeholder" },
    { label: "Platform", value: "Web application" },
  ],
  /** Shown only while the home card has no cover image: the cover is that image (CaseStudy.tsx). */
  hero: { label: "Cataloguing, made clear: cover", kind: "image", ratio: 408 / 277 },
  sections: [
    {
      id: "tldr",
      tab: "TL;DR",
      eyebrow: "TL;DR",
      title: "A lighter version of LS Neo for schools, built around how school librarians actually work .",
      blocks: [{ type: "media", media: { label: "TL;DR: before and after", kind: "image", ratio: 408 / 97 } }],
    },
    {
      id: "context",
      tab: "Context",
      eyebrow: "Context",
      title: "A lighter product for a different kind of library",
      blocks: [
        {
          type: "p",
          text: "LS Neo, Libsys's core library platform, serves schools, colleges, corporates and academic institutions alike. I was brought in to build a simpler, lighter version for schools, **LS Neo lite**, across six to seven modules, with fewer steps to complete a task.",
        },
        { type: "callout", title: "Brief", text: "Simplify the workflows and cut the extra steps needed to finish a task." },
        {
          type: "media",
          media: {
            label:
              "Colleges and corporates: 3 roles, 3 separate flows (students, librarian or admin, purchasing team). Schools: one person runs everything; the librarian handles the whole workflow and purchasing sits with the school ERP.",
            kind: "image",
            ratio: 1736 / 660,
            src: "/case-studies/lsneo-lite/context-v2.webp", // 1CONTEXT.svg, its 2x picture (1736 x 660)
          },
        },
        {
          type: "p",
          text: "__Why a separate school version? Schools don’t have the roles a college or corporate library does, one person runs the workflow, and purchasing sits entirely outside the product, with the school ERP.__",
        },
      ],
    },
    {
      id: "research",
      tab: "Research & Insights",
      eyebrow: "Research & Insights",
      title: "Building evidence from people who catalogue every book",
      blocks: [
        {
          type: "p",
          text: "I spoke with 3 librarians running real Libsys libraries. The spread let me see what breaks for a new user and what still doesn't work after two decades.",
        },
        { type: "h3", text: "What I saw" },
        { type: "label", text: "Walkthrough" },
        { type: "media", media: { label: "Walkthrough: the existing cataloguing flow", kind: "video", ratio: 408 / 230 } },
        { type: "h3", text: "What I understood" },
        { type: "media", media: { label: "What I understood: research insights", kind: "video", ratio: 408 / 214 } },
      ],
    },
    {
      id: "problem",
      tab: "Problem Statement & HMW",
      eyebrow: "Problem Statement & HMW",
      title: "Why Title Management",
      blocks: [
        {
          type: "p",
          text: "Of seven modules, cataloguing sat at the very front, every book passes through it first. If entry was slow and incomplete, everything downstream inherited that weakness. That made it the highest-leverage place to focus.",
        },
        {
          type: "callout",
          title: "HMW",
          text: "How might we help school librarians catalogue books without re-entering details the book already carries, so their attention stays on the judgement calls only they can make?",
        },
        {
          type: "stats",
          items: [
            { value: "300-400", label: "books in the June batch" },
            { value: "5-10 mins", label: "to catalogue one title" },
            { value: "~1 hour", label: "of admin time a day, in one school" },
          ],
        },
      ],
    },
    {
      id: "ia",
      tab: "Existing & New IA",
      eyebrow: "Existing & New IA",
      title: "One Entry point",
      blocks: [
        {
          type: "p",
          text: "**One entry point **: Whether a book arrived as a purchase, a gift, a complimentary copy, a duplicate, or was still pending approval, it deserved one entry point, not five. Every version kept the UI as fixed as possible across sources, branching only where the source genuinely required it.",
        },
        { type: "media", media: { label: "Existing and new information architecture", kind: "image", ratio: 408 / 183 } },
      ],
    },
    {
      id: "explorations",
      tab: "Design Explorations",
      eyebrow: "Design Explorations",
      title: "Versions which didn’t survive",
      blocks: [
        { type: "h3", text: "V1: Landing first to orient users; V2: New title first to make frequent task as default" },
        { type: "media", media: { label: "Design explorations: V1 and V2", kind: "image", ratio: 408 / 150 } },
      ],
    },
    {
      id: "final",
      tab: "Final Design",
      eyebrow: "Final Design",
      title: "The final flow",
      blocks: [
        {
          type: "p",
          text: "**New Title → Source → Copies.** Scan or search, review the prefilled record, choose how the book arrived, add copies. Titles awaiting approval go to approval and titles waiting to be ordered go to order. Labels are generated when the books are ready. Suitable for single entry and mutiple entry.",
        },
        { type: "h3", text: "6 Changes that answer the friction points" },
        { type: "label", text: "Walkthrough" },
        { type: "media", media: { label: "Walkthrough: the 6 changes", kind: "video", ratio: 408 / 150 } },
        { type: "label", text: "Prototype" },
        { type: "media", media: { label: "Prototype: the final flow", kind: "video", ratio: 408 / 247 } },
      ],
    },
    {
      id: "edge-cases",
      tab: "Edge Cases and states",
      eyebrow: "Edge Cases and states",
      title: "When a book doesn't cooperate",
      blocks: [
        { type: "label", text: "Onboarding for new users" },
        { type: "media", media: { label: "Onboarding for new users", kind: "image", ratio: 16 / 9 } },
        {
          type: "p",
          text: "A librarian is never stuck, they search by what they can see on the book instead of what they can scan; **useful for local books with no ISBN**",
        },
        { type: "media", media: { label: "Search by title when there is no ISBN", kind: "image", ratio: 408 / 265 } },
        {
          type: "p",
          text: "**Duplicate ISBN :** the system asks whether to add it as a copy of the existing title, update the existing record, or add it as another edition, rather than silently creating a duplicate entry.",
        },
        { type: "media", media: { label: "Duplicate ISBN: the guided choice", kind: "image", ratio: 408 / 197 } },
        { type: "h3", text: "Duplicate flow" },
        { type: "label", text: "Prototype" },
        { type: "media", media: { label: "Prototype: the duplicate flow", kind: "video", ratio: 408 / 249 } },
      ],
    },
    {
      id: "handoff",
      eyebrow: "PM & Engg Collaboration",
      title: "Handoff",
      blocks: [
        {
          type: "p",
          text: "Free ISBN source fetched incomplete details for tiles so we paired the ISBN field with a server choice and made every fetched field editable, with title search as the fallback.",
        },
        { type: "media", media: { label: "Handoff: ISBN field with server choice", kind: "image", ratio: 408 / 518 } },
      ],
    },
    {
      id: "impact",
      eyebrow: "Impact",
      title: "What changed",
      blocks: [
        {
          type: "table",
          head: ["Goal", "Before", "After"],
          rows: [
            [
              "Less Effort per Title",
              "**7** ways to start, **12+** fields typed by hand, cover upload as a separate stage",
              "**1** entry point. ISBN scan or search fills the record, and the cover sits beside the details",
            ],
            [
              "Clear what's pending",
              "Hidden acquisition module. Librarians kept registers to remember what was left",
              "**3** live counts in the toolbar and a Source column show what’s done and what’s waiting",
            ],
            [
              "Confidence at Scale",
              "One title at a time. Duplicates created silently",
              "Many titles sent to one source together. Duplicates caught with a guided choice: new edition, update, or copy",
            ],
          ],
        },
      ],
    },
    {
      id: "learned",
      eyebrow: "What I learned ",
      title: "Closing ",
      blocks: [
        {
          type: "p",
          text: "**Unprompted answers are stronger than direct questions.** The clearest signal in this project came from three separate librarians describing the same missing capability without being asked, while talking about something else entirely.",
        },
        {
          type: "p",
          text: "**Scoping out is a decision, not a failure.** Defaulter emails, fine-waiving, report exports, OPAC search, all real, none of them belonged in Title Management.",
        },
        {
          type: "p",
          text: "**What I'd do differently:** I'd go back to the same three librarians and test the shipped flow with them directly. Research told me what was broken; I never got the chance to confirm the fix actually removed the friction they described.",
        },
        { type: "p", text: "PS : Open to discuss more details of entire product in person :D" },
      ],
    },
  ],
  more: [
    { project: "Design system", title: "Turned static frames into a tokenized design system; 26 components and 150+ variants" },
    { project: "Chatbot", title: "Designed a decision-tree chatbot that cut support queries by 40%; making answers predictable and scannable" },
    { project: "NOVA", title: "From firefighting to foresight : Making batch load visible before it overloads the system " },
  ],
};

// NOVA: under NDA, so the page is the TL;DR only (as on Framer).
const nova: CaseStudy = {
  slug: "fewer-clicks-faster-decisions-reducing-average-time-on-task-be-restructing-data-hierarchy-and-filters",
  project: "NOVA",
  product: "Financial Services",
  year: "2025",
  title: "From firefighting to foresight : Making batch load visible before it overloads the system ",
  meta: [
    { label: "Role", value: "UX/UI Designer" },
    { label: "Timeline", value: "2 Months" },
    { label: "Team", value: "2 Designer" },
    { label: "Platform", value: "B2B SaaS" },
  ],
  hero: { label: "NOVA financial reporting platform: cover", kind: "image", ratio: 408 / 277 },
  sections: [
    {
      id: "tldr",
      tab: "TL;DR",
      eyebrow: "TL;DR",
      title: "Project Under NDA ",
      blocks: [
        {
          type: "p",
          text: "I redesigned a module of a data-heavy financial platform, covering its dashboards, workflows, and information hierarchy. ",
        },
        {
          type: "p",
          text: "The highlight is a pipeline view that makes batch load visible before it overloads the system, built for batches of up to 300,000 reports running for > 2 hours on average. Streamlining workflows and improving system visibility in client testing environments.",
        },
        {
          type: "p",
          text: "This project is protected under a non-disclosure agreement and cannot be shared publicly. To discuss more about the project, process or my role, let's get in touch.",
        },
      ],
    },
  ],
  more: [
    { project: "LSNeo Lite", title: "Redesigned cataloguing from a 10 minute guess to a scan and confirm flow; cutting manual entry by 60-70%." },
    { project: "Design system", title: "Turned static frames into a tokenized design system; 26 components and 150+ variants" },
    { project: "Chatbot", title: "Designed a decision-tree chatbot that cut support queries by 40%; making answers predictable and scannable" },
  ],
};

export const caseStudies: CaseStudy[] = [lsneo, nova];

export const caseStudyBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug);

/** The page for a home card, if it has one. */
export const caseStudyHref = (project: string) => {
  const c = caseStudies.find((x) => x.project === project);
  return c ? `/case-studies/${c.slug}` : undefined;
};
