"use client";

import { useEffect } from "react";

// The paper grain on cream surfaces switches on once the page has loaded (globals.css), on every
// page, so its 53KB never competes with first paint.
export default function PaperOn() {
  useEffect(() => {
    const on = () => document.documentElement.setAttribute("data-paper", "");
    if (document.readyState === "complete") on();
    else addEventListener("load", on, { once: true });
    return () => removeEventListener("load", on);
  }, []);
  return null;
}
