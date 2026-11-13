// Case study pages (app/case-studies/[slug]). Copy is exactly as on Bhasha's Framer case studies.
// Artifact files: the picture exactly as exported (pulled out of the SVG unchanged, saved as lossless
// WebP), never resized or re-encoded; they are served as-is.
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
  | { type: "table"; head: string[]; rows: string[][] }
  /** One of Bhasha's artifacts rebuilt on the page (type in Geist): app/components/case-study/lsneo. */
  | { type: "artifact"; name: ArtifactName };

export type ArtifactName =
  | "tldr"
  | "context"
  | "walkthrough"
  | "synthesis"
  | "flow"
  | "versions"
  | "six-changes"
  | "onboarding"
  | "search-by-title"
  | "duplicate"
  | "handoff-isbn"
  | "prototype-final"
  | "ds-tldr"
  | "ds-challenge"
  | "ds-diff-hands"
  | "ds-blues"
  | "ds-do-dont"
  | "ds-study"
  | "ds-audit"
  | "ds-documentation"
  | "ds-tokens"
  | "ds-mapping"
  | "ds-foundation"
  | "ds-foundation-b"
  | "ds-references"
  | "ds-components"
  | "ds-nav"
  | "ds-before-after"
  | "cb-audit"
  | "cb-flow"
  | "cb-doc"
  | "cb-intents"
  | "cb-layers"
  | "cb-errors"
  | "cb-context-id"
  | "cb-revised-a"
  | "cb-revised-b"
  | "cb-admin-doc";

export type Section = {
  /** Anchor id. */
  id: string;
  /** Tab in the top bar; sections without one are not in the bar. */
  tab?: string;
  /** The hand-lettered label above the title; some sections go without (as on Framer). */
  eyebrow?: string;
  title?: string;
  blocks: Block[];
};

export type CaseStudy = {
  slug: string;
  /** Its card on the home page (project name in content/projects.ts). */
  project: string;
  product: string;
  year: string;
  title: string;
  /** A line under the headline, where Framer has one. */
  dek?: string;
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
      blocks: [{ type: "artifact", name: "tldr" }],
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
        { type: "artifact", name: "context" },
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
        { type: "artifact", name: "walkthrough" },
        { type: "artifact", name: "synthesis" },
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
        { type: "artifact", name: "flow" },
      ],
    },
    {
      id: "explorations",
      tab: "Design Explorations",
      eyebrow: "Design Explorations",
      title: "Versions which didn’t survive",
      blocks: [
        { type: "h3", text: "V1: Landing first to orient users; V2: New title first to make frequent task as default" },
        { type: "artifact", name: "versions" },
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
        { type: "artifact", name: "six-changes" },
        { type: "label", text: "Prototype" },
        { type: "artifact", name: "prototype-final" },
      ],
    },
    {
      id: "edge-cases",
      tab: "Edge Cases and states",
      eyebrow: "Edge Cases and states",
      title: "When a book doesn't cooperate",
      blocks: [
        { type: "label", text: "Onboarding for new users" },
        { type: "artifact", name: "onboarding" },
        {
          type: "p",
          text: "A librarian is never stuck, they search by what they can see on the book instead of what they can scan; **useful for local books with no ISBN**",
        },
        { type: "artifact", name: "search-by-title" },
        {
          type: "p",
          text: "**Duplicate ISBN :** the system asks whether to add it as a copy of the existing title, update the existing record, or add it as another edition, rather than silently creating a duplicate entry.",
        },
        { type: "artifact", name: "duplicate" },
      ],
    },
    {
      id: "handoff",
      tab: "Handoff",
      eyebrow: "PM & Engg Collaboration",
      title: "Handoff",
      blocks: [
        {
          type: "p",
          text: "Free ISBN source fetched incomplete details for tiles so we paired the ISBN field with a server choice and made every fetched field editable, with title search as the fallback.",
        },
        { type: "artifact", name: "handoff-isbn" },
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



const designSystem: CaseStudy = {
  slug: "turning-static-frames-into-a-tokenized-design-system",
  project: "Design system",
  product: "Libsys",
  year: "2026",
  title: "Turned static frames into a tokenized design system; 26 components and 150+ variants",
  meta: [
    { label: "Role", value: "UX/UI Designer" },
    { label: "Timeline", value: "2 Weeks" },
    { label: "Team", value: "3 Designers" },
    { label: "Platform", value: "Design System" },
  ],
  hero: { label: "Libsys design system: cover", kind: "image", ratio: 776 / 527 },
  sections: [
    {
      id: "tldr",
      eyebrow: "TL;DR",
      title: "One dedicated system, so new designers can build on-brand screens from day one.",
      blocks: [{ type: "artifact", name: "ds-tldr" }],
    },
    {
      id: "challenge",
      tab: "Challenge",
      eyebrow: "Challenge",
      title: "A system we could look at, but not build with",
      blocks: [
        { type: "artifact", name: "ds-challenge" },
        {
          type: "p",
          text: "__The repository tabs look like one system. But in the layers panel, each nav item is its own hand-built group, no component, no shared structure, one repeated by hand for every tab.__",
        },
        { type: "h3", text: "Same product, different hands" },
        { type: "artifact", name: "ds-diff-hands" },
        { type: "p", text: "Left: Dense, compact and functional. Right: Roomier and structurally different. Same product, no shared system to hold them together." },
        { type: "h3", text: "Three blues, no owner" },
        {
          type: "p",
          text: "The product used the header gradient (#1F3BB4→ #3A19A1), module accents like #6678E8, and the brand blue #1E4DFE, with no rule for which was the brand. We chose **#1E4DFE**, and white text on it passes AA contrast at 5.9:1.", // tokens-allow: case study copy quoting Libsys colours
        },
        { type: "artifact", name: "ds-blues" },
        {
          type: "p",
          text: "I kept the header gradient, since it's part of the platform's look, but removed the Indigo end because it wasn't a part of brand colour scale. It now runs #1E4DFE → #132053.", // tokens-allow: case study copy quoting Libsys colours
        },
        { type: "callout", title: "HMW", text: "How might a new designer build an on-brand screen on day one, without guessing?" },
        { type: "p", text: "PS : The system's users were designers only, so we built it for the three of us first." },
      ],
    },
    {
      id: "scope",
      tab: "Scope",
      eyebrow: "Scope",
      title: "Keeping the surface, fixing the structure",
      blocks: [{ type: "artifact", name: "ds-do-dont" }],
    },
    {
      id: "approach",
      tab: "Approach",
      eyebrow: "Approach",
      blocks: [
        { type: "p", text: "**Studied the current file** — every existing element to identify what to create" },
        { type: "artifact", name: "ds-study" },
        { type: "p", text: "**Mapped when to use what** — which patterns were real, which were on-off exceptions" },
        { type: "artifact", name: "ds-audit" },
        { type: "p", text: "**Converted that into structure** — atoms, molecules, organisms __& some ready to use templates__." },
        { type: "artifact", name: "ds-documentation" },
      ],
    },
    {
      id: "structure",
      tab: "Structure",
      eyebrow: "Structure",
      title: "Three layers",
      blocks: [
        { type: "p", text: "**Brand tokens:** the raw palette (Blue, Green, Red, Yellow, Grey, 50-950)" },
        { type: "p", text: "**Alias tokens:** the palette given meaning (Primary, Success, Error, Warning, Neutral)" },
        { type: "p", text: "**Mapped tokens:** meaning assigned to jobs (Surface, Text, Icon, Border), light and dark" },
        { type: "artifact", name: "ds-tokens" },
        { type: "artifact", name: "ds-mapping" },
      ],
    },
    {
      id: "documentation",
      title: "Documentation",
      blocks: [
        { type: "h3", text: "Foundation" },
        { type: "artifact", name: "ds-foundation" },
        { type: "artifact", name: "ds-foundation-b" },
        {
          type: "p",
          text: "Documentation covers colour, type and component usage, built for designers who need to find the right piece quickly, not browse a style guide.",
        },
        { type: "h3", text: "Components / The input field chapter" },
        { type: "artifact", name: "ds-references" },
        { type: "artifact", name: "ds-components" },
        { type: "p", text: "48 variants, one component. Width, state, icon and helper text as properties" },
        { type: "artifact", name: "ds-nav" },
        {
          type: "p",
          text: "26 Components with 150+ variants in total spread across categories such as Navigation, Action, Forms, Content, Feedback, Data Display ",
        },
      ],
    },
    {
      id: "in-use",
      tab: "In Use",
      eyebrow: "In Use",
      // the title pins with the before/after flip (it is set there)
      blocks: [
        { type: "artifact", name: "ds-before-after" },
        { type: "p", text: "Consistency coming from tokens, not eyeballing while keeping the visual intensity similar." },
      ],
    },
    {
      id: "impact",
      eyebrow: "Impact",
      blocks: [
        {
          type: "table",
          head: ["Number", "Label"],
          rows: [
            ["**26**", "components, each with real variants, not duplicated frames"],
            ["**150+**", "variants across width, state, icon, and helper text"],
            ["**3**", "token layers: Brand → Alias → Mapped, in light and dark"],
            ["**2 weeks**", "from foundations to documentation"],
          ],
        },
      ],
    },
    {
      id: "lessons",
      eyebrow: "Lessons",
      blocks: [
        { type: "h3", text: "Learnings" },
        { type: "p", text: "**A system should serve the product's pattern,** not rewrite it." },
        {
          type: "p",
          text: "**Not every fix is a redesign.** The strongest decision here may have been what we __didn't__ change, the look stayed familiar; only the structure underneath it changed.",
        },
        { type: "h3", text: "What's left" },
        { type: "p", text: "Component level mapping" },
        { type: "p", text: "Developer handoff: carrying the same three-layer tokens into code, so design and development share one structure" },
      ],
    },
  ],
  more: [
    { project: "LSNeo Lite", title: "Redesigned cataloguing from a 10 minute guess to a scan and confirm flow; cutting manual entry by 60-70%." },
    { project: "Chatbot", title: "Designed a decision-tree chatbot that cut support queries by 40%; making answers predictable and scannable" },
    { project: "NOVA", title: "From firefighting to foresight : Making batch load visible before it overloads the system " },
  ],
};



const chatbot: CaseStudy = {
  slug: "optimizing-response-syntax-for-chatbot-adoption",
  project: "Chatbot",
  product: "Ace, Chatbot",
  year: "2025",
  title: "Designed a decision-tree chatbot that cut support queries by 40%; making answers predictable and scannable",
  dek: "Reducing support queries by 40%.",
  meta: [
    { label: "Role", value: "UX/UI Designer" },
    { label: "Timeline", value: "2 weeks" },
    { label: "Team", value: "1 Designers" },
    { label: "Platform", value: "Chatbot (Conversational UI)" },
  ],
  hero: { label: "Ace chatbot: cover", kind: "image", ratio: 900 / 612 },
  sections: [
    {
      id: "tldr",
      eyebrow: "TL;DR",
      title: "A chatbot compliance teams could trust, built on structure instead of UI.",
      blocks: [
        {
          type: "p",
          text: "**Problem:** A high-volume enterprise chatbot gave unclear status updates. Compliance staff hit errors and dead ends, then raised support queries instead of resolving things in the bot. The issue wasn’t the data. It was how responses were structured.",
        },
        {
          type: "p",
          text: "**What I did:** Redesigned the response syntax, visual hierarchy, and error states. Moved the bot to a decision-tree flow and set governance over the component library.",
        },
        { type: "p", text: "**Result:** Responses became predictable, scannable, and consistent. Estimated 40% fewer support queries." },
        { type: "p", text: "__As a UX designer, this was an opportunity to focus on framing and governance over UI__." },
        { type: "h3", text: "Approach" },
        { type: "p", text: "Heuristic evaluation → Contextual inquiry → User flow mapping → Persona → Conversational flow design" },
      ],
    },
    {
      id: "research",
      tab: "Research",
      eyebrow: "Research",
      title: "Auditing the bot as a first-time user",
      blocks: [
        { type: "p", text: "I used the bot as a new user would and evaluated it against heuristics." },
        {
          type: "p",
          text: "**What I found:** The bot invited vague queries. Errors ended in dead ends, and users couldn’t tell what it could or couldn’t do.",
        },
        { type: "artifact", name: "cb-audit" },
        { type: "h3", text: "Collecting evidence" },
        {
          type: "p",
          text: "I ran contextual inquiry sessions to see how users actually consumed data in the moment, so decisions rested on real behavior and not assumption.",
        },
        { type: "artifact", name: "cb-flow" },
        { type: "p", text: "**Observation:** Users typed queries with filters, like “Show asset valuation as of today” and “List all unsettled trades." },
        { type: "h3", text: "Opportunity" },
        { type: "p", text: "Needed transparency, trust, ways to narrow scope, and fallback elements." },
      ],
    },
    {
      id: "core-user",
      tab: "Core user",
      eyebrow: "Core user",
      title: "Compliance and audit personnel",
      blocks: [
        {
          type: "p",
          text: "They need to quickly verify the integrity, lineage, and approval history of settlement and corporate action data, so they can demonstrate regulatory transparency without depending on other teams or manual reconciliation.",
        },
        {
          type: "callout",
          title: "HMW",
          text: "How might we design a bot that guides users toward successful queries, keeps context across turns, and gives targeted responses, so they can audit status confidently without escalating to backend teams?",
        },
        { type: "callout", title: "Interview participant", text: "I don’t need more data. I need data I can trace." },
      ],
    },
    {
      id: "governance",
      tab: "Governance",
      eyebrow: "Governance",
      title: "Working with the admin team",
      blocks: [
        {
          type: "p",
          text: "Admins were choosing response components by how they looked, not by what communicated best. That made responses unpredictable and hurt affordance.",
        },
        {
          type: "p",
          text: "This led to **response syntax**: a framework that made responses actionable and traceable. The goal was consistent patterns that users wouldn’t have to relearn with every interaction.",
        },
        { type: "artifact", name: "cb-doc" },
      ],
    },
    {
      id: "constraints",
      tab: "Constraints",
      eyebrow: "Constraints",
      blocks: [
        { type: "p", text: "**No memory.** Data fetched live, nothing retained." },
        { type: "p", text: "**Not AI-powered.** Limited language understanding." },
        { type: "p", text: "**Limited components.** Restricted by the admin software." },
        { type: "p", text: "**No color or icons.** Nothing to signal meaning visually." },
        { type: "p", text: "**No analytics.** No quantitative follow-up on responses." },
      ],
    },
    {
      id: "design-decisions",
      tab: "Design decisions",
      eyebrow: "Design decisions",
      blocks: [
        { type: "h3", text: "Landing on the right answer first time" },
        { type: "artifact", name: "cb-intents" },
        { type: "p", text: "Problem: Queries went to the wrong place, causing dead clicks." },
        { type: "p", text: "Decision: I mapped queries to intent categories so the bot routes users to the right response." },
        { type: "h3", text: "Dense data without endless scrolling" },
        { type: "artifact", name: "cb-layers" },
        { type: "p", text: "Problem: Long tables made status hard to find." },
        {
          type: "p",
          text: "Decision: Three layers: Summary (status, key metrics, critical dates), Details (transaction specifics, download, mark for follow-up, flag report), Context (source, timestamp, reference IDs, follow-up actions).",
        },
        { type: "h3", text: "Errors that teach" },
        { type: "artifact", name: "cb-errors" },
        { type: "p", text: "Problem: Errors ended in dead ends." },
        { type: "p", text: "Decision: Errors now explain what went wrong and suggest what to try next, keeping users in the flow." },
        { type: "h3", text: "No re-entering the same ID" },
        { type: "artifact", name: "cb-context-id" },
        { type: "p", text: "Problem: Users retyped the same ID on every turn." },
        { type: "p", text: "Decision: An “Add ID” utterance carries context forward across turns." },
      ],
    },
    {
      id: "revised",
      tab: "Revised version",
      eyebrow: "Revised version",
      title: "Revisiting the components",
      blocks: [
        { type: "p", text: "Users understood the interface but still struggled to skim the output. The cause was underused components, not poor UI." },
        {
          type: "p",
          text: "I remapped each component to the user’s goal and the mental model behind the task, so responses became quicker to scan and easier to act on.",
        },
        { type: "p", text: "__In hindsight, I should have questioned component choice earlier. Stakeholders agreed quickly, which told me the problem was already felt.__" },
        { type: "artifact", name: "cb-revised-a" },
        { type: "artifact", name: "cb-revised-b" },
      ],
    },
    {
      id: "documentation",
      eyebrow: "Documentation",
      title: "What it looked like for admin",
      blocks: [
        { type: "artifact", name: "cb-admin-doc" },
        {
          type: "p",
          text: "The templates and annotations were later adopted by the admin team. They now map responses by what they need to communicate, without guessing which component to use.",
        },
      ],
    },
    {
      id: "impact",
      eyebrow: "Impact",
      title: "What Changed",
      blocks: [
        {
          type: "table",
          head: ["Number", "Label"],
          rows: [
            ["**~40%**", "estimated fewer support queries"],
            ["**3**", "response layers: Summary → Details → Context"],
            ["**5-6**", "components mapped to user goals"],
            ["**Adopted**", "templates and annotations now used by the admin team"],
          ],
        },
      ],
    },
    {
      id: "lessons",
      eyebrow: "Lessons",
      title: "What I learned",
      blocks: [
        { type: "p", text: "**Think in constraints.** With no color, no icons, and only 5 to 6 components, every decision had to carry more weight." },
        {
          type: "p",
          text: "**If I had more time:** I’d let users flag queries from inside the bot. That creates a feedback loop so the admin team can improve utterance coverage over time.",
        },
        { type: "p", text: "Sometimes the most impactful design work isn’t the interface. It’s the system behind it." },
        { type: "p", text: "__PS: Open to discuss the full project in person.__" },
      ],
    },
  ],
  more: [
    { project: "LSNeo Lite", title: "Redesigned cataloguing from a 10 minute guess to a scan and confirm flow; cutting manual entry by 60-70%." },
    { project: "Design system", title: "Turned static frames into a tokenized design system; 26 components and 150+ variants" },
    { project: "NOVA", title: "From firefighting to foresight : Making batch load visible before it overloads the system " },
  ],
};

export const caseStudies: CaseStudy[] = [lsneo, nova, designSystem, chatbot];

export const caseStudyBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug);

/** The page for a home card, if it has one. */
export const caseStudyHref = (project: string) => {
  const c = caseStudies.find((x) => x.project === project);
  return c ? `/case-studies/${c.slug}` : undefined;
};
