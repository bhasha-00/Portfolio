import { Fragment, type ReactNode } from "react";

// Inline marks in content text: "**bold**" → <strong>, "__italic__" → <em>.
export const rich = (s: string): ReactNode =>
  s.split(/(\*\*.+?\*\*|__.+?__)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("__") && part.endsWith("__")) return <em key={i}>{part.slice(2, -2)}</em>;
    return <Fragment key={i}>{part}</Fragment>;
  });
