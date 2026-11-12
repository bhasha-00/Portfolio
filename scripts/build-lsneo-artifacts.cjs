// Builds the LSNeo Lite case study artifacts from Bhasha's Figma exports (repo root, 1*.svg).
// Every embedded picture is re-stored as lossless WebP (checked pixel-identical, never resized), and
// the outlined text is removed: the page sets that text again in Geist / Caveat on top (see
// app/components/case-study/lsneo). Run: node scripts/build-lsneo-artifacts.cjs
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const OUT = "public/case-studies/lsneo-lite";
const V = "v1"; // bump for a new export so no cache serves the old file

async function lossless(buf) {
  const webp = await sharp(buf).webp({ lossless: true, exact: true, effort: 6 }).toBuffer();
  const [a, b] = await Promise.all([buf, webp].map((x) => sharp(x).ensureAlpha().raw().toBuffer({ resolveWithObject: true })));
  if (a.info.width !== b.info.width || a.info.height !== b.info.height || !a.data.equals(b.data)) throw new Error("not pixel-identical");
  return { webp, w: a.info.width, h: a.info.height };
}

async function reencode(svg) {
  const re = /href="data:image\/png;base64,([^"]+)"/g;
  let out = "", last = 0, m;
  while ((m = re.exec(svg))) {
    const { webp, w, h } = await lossless(Buffer.from(m[1], "base64"));
    console.log(`   picture ${w}x${h} lossless`);
    out += svg.slice(last, m.index) + `href="data:image/webp;base64,${webp.toString("base64")}"`;
    last = re.lastIndex;
  }
  return out + svg.slice(last);
}

const drop = (svg, res) => res.reduce((s, r) => s.replace(r, ""), svg);
const TEXT = [/<path d="[^"]*" fill="#1E1E1E"\/>\n?/g, /<path d="[^"]*" fill="black" fill-opacity="0.501961"\/>\n?/g];

const jobs = {
  walkthrough: { src: "1errorwalkthrough.svg", strip: [...TEXT, /<path d="[^"]*" fill="#E59310"\/>\n?/g] },
  duplicate: {
    src: "1duplicate.svg",
    // a 400x400 picture that sits fully under the screenshot: never visible
    strip: [...TEXT, /<rect x="801" y="387"[^>]*\/>\n?/, /<pattern id="pattern0_884_94810"[\s\S]*?<\/pattern>\n?/, /<image id="image0_884_94810"[^>]*\/>\n?/],
  },
  versions: { src: "1versions.svg", strip: [/<path d="[^"]*" fill="black"\/>\n?/g, /<path d="[^"]*" fill="#106EAD"\/>\n?/g] },
  // the diagram itself is redrawn on the page (under this layer); this keeps the sketch and its arrow
  flow: {
    src: "1flow.svg",
    strip: [/<rect x="0.5" y="0.5"[^>]*\/>\n?/g, /<rect x="285" y="54"[^>]*\/>\n?/, /<pattern id="pattern0_952_94531"[\s\S]*?<\/pattern>\n?/, /<image id="image0_952_94531"[^>]*\/>\n?/],
  },
  "search-by-title": { src: "1searchbytitle.svg", strip: [] },
};

if (process.argv[2] !== "gif") (async () => {
  for (const [name, j] of Object.entries(jobs)) {
    console.log(name);
    const svg = await reencode(drop(fs.readFileSync(j.src, "utf8"), j.strip));
    const f = path.join(OUT, `${name}-${V}.svg`);
    fs.writeFileSync(f, svg);
    console.log(`   ${f} ${(svg.length / 1024).toFixed(0)} KB`);
  }
  const { webp, w, h } = await lossless(fs.readFileSync("1onboarding.png"));
  fs.writeFileSync(path.join(OUT, `onboarding-${V}.webp`), webp);
  console.log(`onboarding ${w}x${h} lossless ${(webp.length / 1024).toFixed(0)} KB`);
})();

// The walkthrough is her GIF (1errorwalkthrough.gif, 1600x900, every frame kept): lossless animated
// WebP, checked frame for frame, plus its first frame as a still for reduced motion.
// Run: node scripts/build-lsneo-artifacts.cjs gif
if (process.argv[2] === "gif") {
  (async () => {
    const o = { animated: true, limitInputPixels: false };
    const webp = await sharp("1errorwalkthrough.gif", o).webp({ lossless: true, exact: true, effort: 4, loop: 0 }).toBuffer();
    // WebP merges back-to-back identical frames, so compare what shows at each GIF frame's moment.
    const [ma, mb] = await Promise.all(["1errorwalkthrough.gif", webp].map((x) => sharp(x, o).metadata()));
    const [a, b] = await Promise.all(["1errorwalkthrough.gif", webp].map((x) => sharp(x, o).ensureAlpha().raw().toBuffer()));
    const F = ma.width * ma.pageHeight * 4;
    const at = (t) => { let s = 0; for (let j = 0; j < mb.pages; j++) { s += mb.delay[j]; if (t < s) return j; } return mb.pages - 1; };
    for (let i = 0, t = 0; i < ma.pages; t += ma.delay[i++]) {
      const j = at(t + 1);
      if (!a.subarray(i * F, (i + 1) * F).equals(b.subarray(j * F, (j + 1) * F))) throw new Error(`frame ${i} differs`);
    }
    fs.writeFileSync(path.join(OUT, `walkthrough-${V}.webp`), webp);
    const still = await sharp("1errorwalkthrough.gif", { limitInputPixels: false }).webp({ lossless: true, exact: true }).toBuffer();
    fs.writeFileSync(path.join(OUT, `walkthrough-still-${V}.webp`), still);
    console.log(`walkthrough ${ma.width}x${ma.pageHeight}, ${ma.pages} frames identical, ${(webp.length / 1048576).toFixed(1)} MB`);
  })();
}
