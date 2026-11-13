import { Annotated, Lines, Note } from "../lsneo/Annotated";
import t from "../ds/ds.module.css";

// The Chatbot case study's artifacts (Bhasha's 3*.svg exports, built by
// scripts/build-chatbot-artifacts.cjs). The bot screens are hers, exactly as drawn; her notes, the
// "Before" / "Present" labels and her hand-lettered words are set again in Geist (Caveat for the
// hand), in her colours, where she placed them. Line breaks are where Geist wraps inside her cards
// (measured in the browser).

const DIR = "/case-studies/chatbot";
const STEP = 21; // her note line spacing

/** "Before" over the old bot, "Present" over the new one, as in every design frame. */
const Labels = () => (
  <>
    <text className={`${t.t} ${t.black}`} x={182.4} y={112}>
      Before
    </text>
    <text className={`${t.t} ${t.black}`} x={1063.1} y={112}>
      Present
    </text>
  </>
);

/** One of her green notes (222 x 128 cards). */
const Green = ({ x, y, lines }: { x: number; y: number; lines: string[] }) => (
  <Note x={x} y={y} step={STEP} lines={lines} tone={`${t.t} ${t.small} ${t.leaf}`} />
);

const design = (name: string, w: number, h: number, alt: string, notes: { x: number; y: number; lines: string[] }[]) => {
  const D = () => (
    <Annotated
      src={`${DIR}/${name}-v1.svg`}
      w={w}
      h={h}
      alt={alt}
      over={
        <>
          <Labels />
          {notes.map((n) => (
            <Green key={n.lines[0]} {...n} />
          ))}
        </>
      }
    />
  );
  D.displayName = name;
  return D;
};

// ---------- Research ----------
const AUDIT: { x: number; y: number; h: number; lines: string[] }[] = [
  { x: 1486, y: 368, h: 150.867, lines: ["Help Users Recognize,", "Diagnose, and Recover from", "Errors: Poor error handling with", "no guided recovery paths"] },
  {
    x: 2506,
    y: 682,
    h: 213.867,
    lines: ["Match Between System and", "the Real World: \"Sorry, I did not", "understand that\" does not", "specify what was", "misunderstood — the input,", "the intent, or the format —", "leaving users unable to", "self-correct"],
  },
  {
    x: 2506,
    y: 404,
    h: 192.867,
    lines: ["Help Users Recognize,", "Diagnose, and Recover from", "Errors : The bot doesn’t let user", "recognize the error (if the ID", "requires a 12 digit input) or let", "them recover with another", "attempt"],
  },
  {
    x: 1486,
    y: 773,
    h: 171.867,
    lines: ["Consistency and Standards:", "The first response silently fails", "while the second offers", "recovery options — error", "handling follows no consistent", "pattern across failure states"],
  },
  {
    x: 1108,
    y: 337,
    h: 192.867,
    lines: ["Recognition Rather Than Recall", ": The bot provides no", "onboarding cues, capability", "overview, or example queries,", "causing users to submit vague", "inputs that return no useful", "results."],
  },
  {
    x: 1108,
    y: 550,
    h: 171.867,
    lines: ["Aesthetic and Minimalist", "Design : Presenting too many", "options at once overwhelms", "users, increasing cognitive", "load and making it harder to", "make a decision."],
  },
  {
    x: 94,
    y: 550,
    h: 192.867,
    lines: ["Recognition Rather Than Recall", ": Users have no way to see", "what utterances or commands", "the bot supports, leaving them", "unable to understand or", "predict system behaviour."],
  },
  {
    x: 94,
    y: 774,
    h: 234.867,
    lines: [
      "Visibility of System Status +",
      "Match Between System and",
      "Real World : The placeholder",
      "text implies the bot supports",
      "natural language and semantic",
      "search, creating a false mental",
      "model that leads to user",
      "frustration when queries fail.",
    ],
  },
  {
    x: 1108,
    y: 812,
    h: 171.867,
    lines: ["Match Between System and", "Real World : The icon used", "does not reflect the underlying", "action or function it triggers,", "making the interface harder to", "interpret."],
  },
  {
    x: 1108,
    y: 1709,
    h: 213.867,
    lines: [
      "Aesthetic and Minimalist",
      "Design : The data table",
      "requires extensive scrolling",
      "and manual cross-referencing",
      "to extract meaning, with no",
      "summarisation or highlight of",
      "what's relevant to the user's",
      "query",
    ],
  },
  {
    x: 1108,
    y: 1455,
    h: 213.867,
    lines: [
      "Recognition Rather Than Recall",
      "+ Visibility of System Status:",
      "\"Click here\" is used as link text",
      "with no description of where it",
      "leads or what the trade report",
      "contains, leaving users unable",
      "to make an informed decision",
    ],
  },
  {
    x: 94,
    y: 1525,
    h: 213.867,
    lines: [
      "Consistency and Standards",
      ":The embedded search bar",
      "inside the bot response",
      "creates a secondary",
      "interaction paradigm within the",
      "conversation, blurring the",
      "boundary between chat and",
      "application",
    ],
  },
  {
    x: 1486,
    y: 1955,
    h: 213.867,
    lines: [
      "Flexibility and Efficiency of",
      "Use: The bot retains no context",
      "between turns, forcing users to",
      "manually re-enter client IDs",
      "and security filters for every",
      "new query, creating",
      "unnecessary repetitive work",
    ],
  },
  {
    x: 2506,
    y: 1646,
    h: 192.867,
    lines: ["Visibility of System Status :", "The response surfaces only", "one record for a holdings", "report query without", "confirming whether this is the", "complete result set or a partial", "match"],
  },
];

/** The heuristic evaluation: four screens of the old bot, each problem noted (3audit.svg). */
export const CbAudit = () => (
  <Annotated
    src={`${DIR}/audit-v1.svg`}
    w={2835}
    h={2414}
    alt="Heuristic evaluation of the old Ask MODAL Assistant Ace bot: four screens, each friction point noted against a usability heuristic."
    over={AUDIT.map((n) => (
      <Note key={n.x + "-" + n.y} x={n.x} y={n.y} h={n.h} step={STEP} lines={n.lines} />
    ))}
  />
);

/** The three flows mapped from contextual inquiry (3flow.svg). */
export const CbFlow = () => (
  <Annotated
    src={`${DIR}/flow-v1.svg`}
    w={988}
    h={1574}
    alt="Three user flows from the contextual inquiry: pre-audit trade logs, start-of-day pending trades and morning corporate actions, with bot responses and error recovery."
  />
);

// ---------- Governance ----------
/** The response decision tree document, with her vocabulary of the bot (3doc.svg). */
export const CbDoc = () => (
  <Annotated
    src={`${DIR}/doc-v1.svg`}
    w={1318}
    h={720}
    alt="The response decision tree document for admins: identify the query type, choose the response template, apply components."
    over={
      <Lines
        x={56.5}
        y={283.5}
        step={43.5}
        className={`${t.t} ${t.handLg} ${t.strong}`}
        lines={["Query", "Entities", "Utterances", "Disambiguation", "Confirmation", "Fallback and re-prompt"]}
      />
    }
  />
);

// ---------- Design decisions ----------
export const CbIntents = design("intents", 2613, 983, "Before and present: the old bot's loose quick links beside the new landing, with queries grouped by intent and example queries.", [
  { x: 1514, y: 485, lines: ["Grouping creates mental", "model reducing cognitive", "overload"] },
  { x: 1514, y: 294, lines: ["Clearly communicate the bot's", "scope setting accurate", "expectations"] },
  { x: 2268.73, y: 379, lines: ["Surface available intents and", "utterance example and bot", "intelligence"] },
]);

export const CbLayers = design("layers", 2613, 983, "Before and present: a long trade table beside the new summary, filter and explore pattern.", [
  { x: 1513.73, y: 463, lines: ["User inputs gets reflected", "back in a utterance format", "phrasing user behaviour"] },
  { x: 2300, y: 746, lines: ["Fallback and actionable CTA", "specific enough to help users", "understand and fix their input"] },
  { x: 2293, y: 306, lines: ["Summary → Filter → Explore", "Pattern"] },
  { x: 2294, y: 523, lines: ["Decision-making framing of", "information"] },
]);

export const CbErrors = design("errors", 1869, 983, "Before and present: a dead-end error beside one that explains the failure and offers next steps.", [
  { x: 1513.73, y: 479, lines: ["Error messages explain the", "failure and offer concrete next", "steps or alternatives"] },
]);

export const CbContextId = design("context-id", 2613, 983, "Before and present: retyping the same ID beside an ID that stays in context, with a confirmation to remove it.", [
  { x: 1513.73, y: 519, lines: ["Bots retains contextual ID to", "eliminate redundant user", "inputs across queries"] },
  { x: 2293, y: 428, lines: ["Visibility of user actions and", "it’s consequence"] },
]);

// ---------- Revised version ----------
export const CbRevisedA = design("revised-a", 2613, 1809, "Before and present: components remapped to the task, with a status chart, chips as filters and a carousel of trades.", [
  { x: 1513.73, y: 463, lines: ["Chart gives instant status", "overview. Proportions clear at a", "glance"] },
  { x: 2293, y: 406, lines: ["Chips were acting as better", "filters - action oriented"] },
  { x: 2294, y: 1101, lines: ["Carousel prevents information", "dump, promotes focused", "scanning"] },
]);

export const CbRevisedB = design("revised-b", 1869, 983, "Before and present: an error with long suggestions beside one with short recovery chips.", [
  { x: 1513.73, y: 544, lines: ["Reducing manual entry of long", "utterance."] },
]);

// ---------- Documentation ----------
/** Component guidelines for the admin team (3last.svg). */
export const CbAdminDoc = () => (
  <Annotated
    src={`${DIR}/admin-doc-v1.svg`}
    w={1017}
    h={792}
    alt="Component guidelines for the admin team: text bar, chips and text with link, each with anatomy, variants and usage."
  />
);
