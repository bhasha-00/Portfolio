// Builds the Chatbot case study's artifacts from Bhasha's Figma exports (repo root, 3*.svg). Same rules as LSNeo (build-lsneo-artifacts.cjs): every embedded picture is
// re-stored as lossless WebP, checked pixel-identical, never resized; her frame (the rounded outline)
// is taken off so the page draws the one 16px frame all artifacts share; outlined text is taken out
// and set again in Geist / Caveat on the page (app/components/case-study/chatbot).
// Run: node scripts/build-chatbot-artifacts.cjs
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const OUT = "public/case-studies/chatbot";
const V = "v2";
fs.mkdirSync(OUT, { recursive: true });

async function lossless(buf) {
  const webp = await sharp(buf, { limitInputPixels: false }).webp({ lossless: true, exact: true, effort: 6 }).toBuffer();
  const [a, b] = await Promise.all([buf, webp].map((x) => sharp(x, { limitInputPixels: false }).ensureAlpha().raw().toBuffer({ resolveWithObject: true })));
  if (a.info.width !== b.info.width || a.info.height !== b.info.height || !a.data.equals(b.data)) throw new Error("not pixel-identical");
  return { webp, w: a.info.width, h: a.info.height };
}

// Her bot screenshots are exported far larger than they ever show (a 1960px phone shot shows about
// 230px wide). With her OK (2026-11-13) each picture is scaled to 3x the largest size it shows on the
// page (the case study column is at most 845 CSS px), which stays sharp on every screen; anything
// already within 3x is kept exactly as exported (lossless, checked pixel-identical).
const COLUMN = 845, DENSITY = 3;
let xOf = {}; // image id -> left edge of where it is drawn, in artboard px

// Her old bot ("Before") is shown in luminosity in Figma, but the export puts that blend on a white
// box under the screenshot instead of on it, so browsers show it in colour. This applies it to the
// pixels: luminosity over white is the pixel's luminance in grey (0.3 R + 0.59 G + 0.11 B).
const LUM = [0.3, 0.59, 0.11];
// The old bot is the purple one: its screenshots average well bluer than green; the new bot's don't.
async function isOldBot(buf) {
  const [, g, b] = (await sharp(buf, { limitInputPixels: false }).stats()).channels.map((c) => c.mean);
  return b - g > 15;
}
const luminosity = (buf) => sharp(buf, { limitInputPixels: false }).recomb([LUM, LUM, LUM]).png().toBuffer();

function shownWidths(svg, artW) {
  // image id -> width it is drawn at, in artboard px (pattern fill: image px x pattern scale x rect width)
  const scaleOf = {};
  for (const m of svg.matchAll(/<pattern id="([^"]+)"[^>]*>\s*<use xlink:href="#([^"]+)" transform="(?:matrix|scale)\(([^)]*)\)"/g))
    scaleOf[m[1]] = { img: m[2], sx: parseFloat(m[3].split(/[ ,]+/)[0]) };
  const rectW = {}, rectX = {};
  for (const m of svg.matchAll(/<rect([^>]*?)width="([\d.]+)"([^>]*?)fill="url\(#([^)]+)\)"/g)) {
    rectW[m[4]] = Math.max(rectW[m[4]] || 0, parseFloat(m[2]));
    const attrs = m[1] + m[3];
    const x = attrs.match(/(?:^|\s)x="([\d.]+)"/) || attrs.match(/translate\(([\d.]+)/);
    rectX[m[4]] = Math.min(rectX[m[4]] ?? Infinity, x ? parseFloat(x[1]) : 0);
  }
  const out = {};
  xOf = {};
  for (const [pid, { img }] of Object.entries(scaleOf)) xOf[img] = Math.min(xOf[img] ?? Infinity, rectX[pid] ?? Infinity);
  for (const [pid, { img, sx }] of Object.entries(scaleOf)) {
    const im = svg.match(new RegExp(`<image id="${img}" width="(\\d+)"`));
    if (im && rectW[pid]) out[img] = Math.max(out[img] || 0, parseFloat(im[1]) * sx * rectW[pid]);
  }
  return (id, attrW) => ((id ? out[id] : attrW) || artW) * (COLUMN / artW);
}

async function reencode(svg, gray = (_w) => false) {
  const artW = parseFloat(svg.match(/<svg width="([\d.]+)"/)[1]);
  const shown = shownWidths(svg, artW);
  const re = /<image(?: id="([^"]+)")?([^>]*?) width="(\d+)" height="(\d+)"([^>]*?)href="data:image\/png;base64,([^"]+)"/g;
  let out = "", last = 0, m;
  const sizes = [];
  while ((m = re.exec(svg))) {
    const [, id, , w] = m;
    let buf = Buffer.from(m[6], "base64");
    const target = Math.ceil(shown(id, id ? 0 : parseFloat(w)) * DENSITY);
    let note = "";
    if (gray(+w) && (await isOldBot(buf))) {
      buf = await luminosity(buf);
      note += " grey";
    }
    if (+w > target * 1.05) {
      buf = await sharp(buf, { limitInputPixels: false }).resize({ width: target, kernel: "lanczos3" }).png().toBuffer();
      note += ` ->${target}w`;
    }
    const { webp, w: ow, h: oh } = await lossless(buf);
    sizes.push(`${w}${note}`);
    out += svg.slice(last, m.index) + m[0].replace(/data:image\/png;base64,[^"]+"$/, () => `data:image/webp;base64,${webp.toString("base64")}"`);
    last = re.lastIndex;
    void ow, void oh;
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

// The old bot screenshots are her 1960 px phone captures (and only they are purple).
const BEFORE = (w) => w >= 1900;

const jobs = {
  audit: { src: "3audit.svg", strip: [FRAME, ...NOTE], gray: BEFORE }, // her 14 heuristic notes set on the page; all four old-bot screens in luminosity
  flow: { src: "3flow.svg", strip: [FRAME] },
  doc: { src: "3doc.svg", strip: [FRAME, ...fills("#292D32")] }, // her six hand-lettered words, set on the page
  "intents": { gray: BEFORE, src: "3design1.svg", strip: DESIGN },
  "layers": { gray: BEFORE, src: "3design2.svg", strip: DESIGN },
  "errors": { gray: BEFORE, src: "3design3.svg", strip: DESIGN },
  "context-id": { gray: BEFORE, src: "3design4.svg", strip: DESIGN },
  "revised-a": { src: "3desgin21.svg", strip: DESIGN },
  "revised-b": { src: "3design22.svg", strip: DESIGN },
};

(async () => {
  for (const [name, j] of Object.entries(jobs)) {
    const raw = fs.readFileSync(j.src, "utf8");
    let svg = raw, dropped = 0;
    for (const r of j.strip) svg = svg.replace(r, () => (dropped++, ""));
    const { svg: out, sizes } = await reencode(svg, j.gray);
    const f = path.join(OUT, `${name}-${V}.svg`);
    fs.writeFileSync(f, out);
    console.log(`${name.padEnd(14)} ${j.src.padEnd(20)} removed ${String(dropped).padStart(2)}  pictures ${sizes.join(" ") || "-"}  ${(out.length / 1024).toFixed(0)} KB`);
  }
  // The admin component guide: her full screenshot (3last.png, 6212 x 4128), shown in the frame's
  // inset (about 757 CSS px), so 3x is 2272 px wide.
  const cut = await sharp("3last.png", { limitInputPixels: false }).resize({ width: 2272, kernel: "lanczos3" }).png().toBuffer();
  const { webp, w, h } = await lossless(cut);
  fs.writeFileSync(path.join(OUT, `admin-doc-v2.webp`), webp);
  console.log(`admin-doc     3last.png 6212x4128 -> ${w}x${h}, ${(webp.length / 1024).toFixed(0)} KB`);
})();
