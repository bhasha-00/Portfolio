// Builds the Design system case study's artifacts from Bhasha's Figma exports (repo root, 2*.svg) and
// her challenge recording. Same rules as LSNeo (build-lsneo-artifacts.cjs): every embedded picture is
// re-stored as lossless WebP, checked pixel-identical, never resized; her frame (the rounded outline)
// is taken off so the page draws the one 16px frame all artifacts share; outlined text is taken out
// and set again in Geist / Caveat on the page (app/components/case-study/ds).
// Run: node scripts/build-ds-artifacts.cjs [path to the challenge .mp4]
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const sharp = require("sharp");

const OUT = "public/case-studies/design-system";
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

const jobs = {
  // annotated, text set on the page
  "diff-hands": { src: "2diffhands.svg", strip: [FRAME, ...NOTE] },
  blues: { src: "2blues.svg", strip: fills("#DC2626", "#80828E", "white", "#1F2540", "#16A34A") }, // two cards of her own: kept
  tokens: { src: "2tokens.svg", strip: [FRAME, ...fills("#1F2540", "#5B6280")] },
  "do-dont": { src: "2dodont.svg", strip: [FRAME, ...fills("#1F2540", "#5B6280")] },
  references: {
    src: "2input.svg",
    strip: [FRAME, ...fills("#E68109", "#4F46E5"), ...byStart("M56.52 92V66.08", "M750.812 173L754.556", "M828.736 570.744")],
  },
  before: { src: "2before.svg", strip: [FRAME, ...fills("#DC2626")] },
  after: { src: "2after.svg", strip: [FRAME, ...fills("#16A34A")] },
  // screens as exported
  audit: { src: "2audit.svg", strip: [FRAME] },
  study: { src: "2study.svg", strip: [FRAME] },
  mapping: { src: "2mapping.svg", strip: [FRAME] },
  components: { src: "2components.svg", strip: [FRAME] },
  documentation: { src: "2documentation.svg", strip: [FRAME] },
  foundation: { src: "2foundation.svg", strip: [FRAME] },
  "foundation-b": { src: "2foundationb.svg", strip: [FRAME] },
  nav: { src: "2nav.svg", strip: [FRAME] },
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
  // The challenge recording: the video stream copied as is (no re-encode), no audio or tags, fast start.
  const mp4 = process.argv[2];
  if (mp4) {
    const out = path.join(OUT, `challenge-${V}.mp4`);
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", mp4, "-map", "0:v:0", "-c", "copy", "-movflags", "+faststart", "-map_metadata", "-1", out]);
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", out, "-frames:v", "1", "-c:v", "libwebp", "-lossless", "1", path.join(OUT, `challenge-${V}-poster.webp`)]);
    const md5 = (f) => execFileSync("ffmpeg", ["-v", "error", "-i", f, "-map", "0:v:0", "-c", "copy", "-f", "md5", "-"]).toString().trim();
    if (md5(mp4) !== md5(out)) throw new Error("video stream changed");
    console.log(`challenge video: stream identical, ${(fs.statSync(out).size / 1048576).toFixed(1)} MB`);
  }
})();
