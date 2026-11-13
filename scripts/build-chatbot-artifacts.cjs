// Builds the Chatbot case study's artifacts from Bhasha's Figma exports (repo root, 3*.svg). Same rules as LSNeo (build-lsneo-artifacts.cjs): every embedded picture is
// re-stored as lossless WebP, checked pixel-identical, never resized; her frame (the rounded outline)
// is taken off so the page draws the one 16px frame all artifacts share; outlined text is taken out
// and set again in Geist / Caveat on the page (app/components/case-study/chatbot).
// Run: node scripts/build-chatbot-artifacts.cjs
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const OUT = "public/case-studies/chatbot";
const V = "v1";
fs.mkdirSync(OUT, { recursive: true });

async function lossless(buf) {
  const webp = await sharp(buf, { limitInputPixels: false }).webp({ lossless: true, exact: true, effort: 6 }).toBuffer();
  const [a, b] = await Promise.all([buf, webp].map((x) => sharp(x, { limitInputPixels: false }).ensureAlpha().raw().toBuffer({ resolveWithObject: true })));
  if (a.info.width !== b.info.width || a.info.height !== b.info.height || !a.data.equals(b.data)) throw new Error("not pixel-identical");
  return { webp, w: a.info.width, h: a.info.height };
}

async function reencode(svg) {
  const re = /href="data:image\/png;base64,([^"]+)"/g;
  let out = "", last = 0, m;
  const sizes = [];
  while ((m = re.exec(svg))) {
    const { webp, w, h } = await lossless(Buffer.from(m[1], "base64"));
    sizes.push(`${w}x${h}`);
    out += svg.slice(last, m.index) + `href="data:image/webp;base64,${webp.toString("base64")}"`;
    last = re.lastIndex;
  }
  return { svg: out + svg.slice(last), sizes };
}

// Her frame: the rounded rectangle (fill) and its outline (stroke).
const FRAME = /<rect x="0\.5" y="0\.5" width="[\d.]+" height="[\d.]+" rx="15\.5" (fill|stroke)="#[0-9A-F]{6}"\/>\n?/g;
const fills = (...cs) => cs.map((c) => new RegExp(`<path d="[^"]*" fill="${c}"\\/>\\n?`, "g"));
const byStart = (...ds) => ds.map((d) => new RegExp(`<path d="${d.replace(/\./g, "\\.")}[^"]*" fill="black"\\/>\\n?`));
const NOTE = [...fills("#1E1E1E"), /<path d="[^"]*" fill="black" fill-opacity="0.501961"\/>\n?/g];

// "Before" and "Present" above her screens (the same two runs in every design file).
const LABELS = [/<path d="M182\.409 112V100\.364[^"]*" fill="black"\/>\n?/, /<path d="M1063\.14 112V100\.364[^"]*" fill="black"\/>\n?/];
const DESIGN = [FRAME, ...fills("#078237"), /<path d="[^"]*" fill="black" fill-opacity="0.501961"\/>\n?/g, ...LABELS];

const jobs = {
  audit: { src: "3audit.svg", strip: [FRAME, ...NOTE] }, // her 14 heuristic notes, set on the page
  flow: { src: "3flow.svg", strip: [FRAME] },
  doc: { src: "3doc.svg", strip: [FRAME, ...fills("#292D32")] }, // her six hand-lettered words, set on the page
  "intents": { src: "3design1.svg", strip: DESIGN },
  "layers": { src: "3design2.svg", strip: DESIGN },
  "errors": { src: "3design3.svg", strip: DESIGN },
  "context-id": { src: "3design4.svg", strip: DESIGN },
  "revised-a": { src: "3desgin21.svg", strip: DESIGN },
  "revised-b": { src: "3design22.svg", strip: DESIGN },
  "admin-doc": { src: "3last.svg", strip: [FRAME] },
};

(async () => {
  for (const [name, j] of Object.entries(jobs)) {
    const raw = fs.readFileSync(j.src, "utf8");
    let svg = raw, dropped = 0;
    for (const r of j.strip) svg = svg.replace(r, () => (dropped++, ""));
    const { svg: out, sizes } = await reencode(svg);
    const f = path.join(OUT, `${name}-${V}.svg`);
    fs.writeFileSync(f, out);
    console.log(`${name.padEnd(14)} ${j.src.padEnd(20)} removed ${String(dropped).padStart(2)}  pictures ${sizes.join(" ") || "-"}  ${(out.length / 1024).toFixed(0)} KB`);
  }
})();
