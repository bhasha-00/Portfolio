// scripts/check-tokens.mjs — no dependencies. Run: node scripts/check-tokens.mjs
// Fails (exit 1) if CSS/TSX uses raw colours, raw font sizes, extra font families,
// or off-scale spacing outside tokens.css.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname, basename } from "node:path";

const ROOTS = ["app", "components", "src"].filter((d) => {
  try { return statSync(d).isDirectory(); } catch { return false; }
});
const EXT = new Set([".css", ".tsx", ".ts"]);
const SKIP = new Set(["node_modules", ".next", "public"]);
const SPACE = new Set([0, 1, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96]); // px allowed for margin/padding/gap
const rules = [
  { name: "raw hex colour", re: /#[0-9a-fA-F]{3,8}\b(?![^<]*>)/g, skip: (l) => /^\s*(\/\/|\/\*|\*)/.test(l) || /href|id=|url\(#/.test(l) },
  { name: "rgb()/hsl() colour", re: /\b(rgba?|hsla?)\(/g },
  { name: "Geist Mono / monospace", re: /Geist[_ ]Mono|font-mono|monospace/gi },
  // lookahead sits before \s* so backtracking can't skip it (`font-size: var(--fs-body)` passes)
  { name: "raw font-family", re: /font-family\s*:(?!\s*(var\(--font-|inherit\b))[^;]+/g },
  { name: "raw font-size (use --fs-*)", re: /font-size\s*:(?!\s*(var\(--fs-|inherit\b))[^;]+/g },
  { name: "clamp() font-size (use stepped tokens)", re: /font-size\s*:\s*clamp\(/g },
  { name: "filter / backdrop-filter / gradient", re: /backdrop-filter|filter\s*:|gradient\(/g },
];

const hits = [];
function walk(dir) {
  for (const f of readdirSync(dir)) {
    if (SKIP.has(f)) continue;
    const p = join(dir, f);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (EXT.has(extname(p)) && basename(p) !== "tokens.css") scan(p);
  }
}
function scan(p) {
  readFileSync(p, "utf8").split("\n").forEach((line, i) => {
    for (const r of rules) {
      if (r.skip?.(line)) continue;
      if (r.re.test(line)) hits.push(`${p}:${i + 1}  ${r.name}  →  ${line.trim().slice(0, 90)}`);
      r.re.lastIndex = 0;
    }
    const sp = line.match(/(?:margin|padding|gap)[a-z-]*\s*:\s*([^;]+)/);
    if (sp) {
      for (const m of sp[1].matchAll(/(-?\d+(?:\.\d+)?)px/g)) {
        if (!SPACE.has(Math.abs(Number(m[1])))) hits.push(`${p}:${i + 1}  off-scale spacing ${m[0]}  →  ${line.trim().slice(0, 90)}`);
      }
    }
  });
}
ROOTS.forEach(walk);
if (hits.length) {
  console.log(hits.join("\n"));
  console.log(`\n${hits.length} token violation(s).`);
  process.exit(1);
}
console.log("Tokens clean.");
