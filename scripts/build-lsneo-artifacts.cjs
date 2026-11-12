// Builds the LSNeo Lite case study artifacts from Bhasha's Figma exports (repo root, 1*.svg).
// Every embedded picture is re-stored as lossless WebP (checked pixel-identical, never resized), and
// the outlined text is removed: the page sets that text again in Geist / Caveat on top (see
// app/components/case-study/lsneo). Run: node scripts/build-lsneo-artifacts.cjs
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const OUT = "public/case-studies/lsneo-lite";
const V = "v2"; // bump for a new export so no cache serves the old file

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
// Her frame (the rounded rectangle and its outline): the page draws it instead, at 16px for every artifact.
const FRAME = /<rect x="0.5" y="0.5" width="\d+" height="\d+" rx="15.5" (fill|stroke)="#[0-9A-F]{6}"\/>\n?/g;
const TEXT = [/<path d="[^"]*" fill="#1E1E1E"\/>\n?/g, /<path d="[^"]*" fill="black" fill-opacity="0.501961"\/>\n?/g];

const jobs = {
  duplicate: {
    src: "1duplicate.svg",
    // a 400x400 picture that sits fully under the screenshot: never visible
    strip: [FRAME, ...TEXT, /<rect x="801" y="387"[^>]*\/>\n?/, /<pattern id="pattern0_884_94810"[\s\S]*?<\/pattern>\n?/, /<image id="image0_884_94810"[^>]*\/>\n?/],
  },
  // the diagram itself is redrawn on the page (under this layer); this keeps the sketch and its arrow
  flow: {
    src: "1flow.svg",
    strip: [/<rect x="0.5" y="0.5"[^>]*\/>\n?/g, /<rect x="285" y="54"[^>]*\/>\n?/, /<pattern id="pattern0_952_94531"[\s\S]*?<\/pattern>\n?/, /<image id="image0_952_94531"[^>]*\/>\n?/],
  },
  "search-by-title": { src: "1searchbytitle.svg", strip: [FRAME] },
};

if (process.argv[2] !== "gif") (async () => {
  for (const [name, j] of Object.entries(jobs)) {
    console.log(name);
    const svg = await reencode(drop(fs.readFileSync(j.src, "utf8"), j.strip));
    const f = path.join(OUT, `${name}-${V}.svg`);
    fs.writeFileSync(f, svg);
    console.log(`   ${f} ${(svg.length / 1024).toFixed(0)} KB`);
  }
  // Onboarding: her 4px frame with a ~72px corner is trimmed (26px a side); the page draws the frame.
  const T = 26, png = sharp("1onboarding.png"), om = await png.metadata();
  const cut = await sharp("1onboarding.png").extract({ left: T, top: T, width: om.width - 2 * T, height: om.height - 2 * T }).png().toBuffer();
  const { webp, w, h } = await lossless(cut);
  fs.writeFileSync(path.join(OUT, `onboarding-${V}.webp`), webp);
  console.log(`onboarding ${w}x${h} lossless ${(webp.length / 1024).toFixed(0)} KB`);
  // Versions: her 2026-11-12 export only darkened the panels' ring (#F4F0E6 to #EFE9DC; same screenshots,
  // but cropped at 1180x518 and missing the V2 note), so the ring colour goes onto the full artifact.
  const ver = fs.readFileSync(path.join(OUT, "versions-v1.svg"), "utf8").replaceAll('stroke="#F4F0E6"', 'stroke="#EFE9DC"');
  fs.writeFileSync(path.join(OUT, `versions-${V}.svg`), ver);
  console.log("versions ring #EFE9DC");
})();

// Her GIFs: lossless animated WebP, every frame checked against the GIF at the same moment (WebP
// merges back-to-back identical frames). `trim` takes her baked frame off (border and rounded corner)
// so the page draws the one 16px frame every artifact shares; nothing inside is touched. The first
// frame is also saved as a still for reduced motion. Run: node scripts/build-lsneo-artifacts.cjs gif
async function gif(src, name, trim = 0) {
  const o = { animated: true, limitInputPixels: false };
  const m = await sharp(src, o).metadata();
  const w = m.width - 2 * trim, h = m.pageHeight - 2 * trim;
  // Crop frame by frame (raw, so nothing is resampled), then stack them back into one animation.
  const raw = await sharp(src, o).ensureAlpha().raw().toBuffer();
  const F = m.width * m.pageHeight * 4, out = Buffer.alloc(w * h * 4 * m.pages);
  for (let p = 0; p < m.pages; p++)
    for (let y = 0; y < h; y++) {
      const from = p * F + ((y + trim) * m.width + trim) * 4;
      raw.copy(out, (p * h + y) * w * 4, from, from + w * 4);
    }
  const webp = await sharp(out, { raw: { width: w, height: h * m.pages, channels: 4, pageHeight: h }, limitInputPixels: false })
    .webp({ lossless: true, exact: true, effort: 4, loop: 0, delay: m.delay })
    .toBuffer();
  const mb = await sharp(webp, o).metadata();
  const back = await sharp(webp, o).ensureAlpha().raw().toBuffer();
  const G = w * h * 4;
  const at = (t) => { let s = 0; for (let j = 0; j < mb.pages; j++) { s += mb.delay[j]; if (t < s) return j; } return mb.pages - 1; };
  for (let i = 0, t = 0; i < m.pages; t += m.delay[i++]) {
    const j = at(t + 1);
    if (!out.subarray(i * G, (i + 1) * G).equals(back.subarray(j * G, (j + 1) * G))) throw new Error(`${name}: frame ${i} differs`);
  }
  fs.writeFileSync(path.join(OUT, `${name}.webp`), webp);
  const still = await sharp(out.subarray(0, G), { raw: { width: w, height: h, channels: 4 } }).webp({ lossless: true, exact: true }).toBuffer();
  fs.writeFileSync(path.join(OUT, `${name}-still.webp`), still);
  console.log(`${name}: ${w}x${h} (trim ${trim}), ${m.pages} frames identical, ${(webp.length / 1048576).toFixed(1)} MB`);
}

if (process.argv[2] === "gif") {
  (async () => {
    await gif("1errorwalkthrough-v4.gif", "walkthrough-v2", 6); // 1px border, ~10px corner
    await gif("1sixchanges.gif", "six-changes-v1"); // her two panels; corners clipped on the page
    await gif("1handoff-isbn.gif", "handoff-isbn-v1", 8); // 1px border, ~20px corner
  })();
}
