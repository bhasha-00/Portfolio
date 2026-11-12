import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { caseStudyHref, type ArtifactName, type Block, type CaseStudy as CS, type Media } from "../../content/caseStudies";
import { projects, type Project } from "../../content/projects";
import { rich } from "../rich";
import CaseBar from "./CaseBar";
import Context from "./lsneo/Context";
import Synthesis from "./lsneo/Synthesis";
import Tldr from "./lsneo/Tldr";
import { Duplicate, Flow, HandoffIsbn, Onboarding, PrototypeFinal, SearchByTitle, SixChanges, Versions, Walkthrough } from "./lsneo/artifacts";
import styles from "./CaseStudy.module.css";

// A case study page: the sticky bar (back to Projects + one tab per section), the header (product,
// year, headline, role / timeline / team / platform, cover), then each section in order, and
// "Explore more". On the case study cards' cream with their paper grain; ink type, muted body,
// hand-lettered eyebrows in red. Content is content/caseStudies.ts, exactly as on Framer.

// An artifact. Until its file is supplied: a placeholder in its final shape.
function Artifact({ media, priority = false }: { media: Media; priority?: boolean }) {
  const shape = { aspectRatio: String(media.ratio) };
  if (media.src && media.kind === "image") {
    return (
      <figure className={styles.media} style={shape}>
        {/* Served exactly as exported (stored lossless, no resize or re-encode by Next), so what Bhasha
            exports is what visitors see. */}
        <Image src={media.src} alt={media.label} fill unoptimized priority={priority} className={styles.mediaFill} />
      </figure>
    );
  }
  if (media.src && media.kind === "video") {
    return (
      <figure className={styles.media} style={shape}>
        <video className={styles.mediaFill} src={media.src} muted loop playsInline controls preload="none" aria-label={media.label} />
      </figure>
    );
  }
  return (
    <figure className={`${styles.media} ${styles.placeholder}`} style={shape} role="img" aria-label={`${media.label} (placeholder)`}>
      <span className={styles.phKind}>{media.kind === "video" ? "Video" : "Image"}</span>
      <span className={styles.phLabel}>{media.label}</span>
    </figure>
  );
}

// The cover: the same shot as the project's card on home, served the same way. Tablet and desktop get
// the SVG export itself (vector type stays crisp, embedded screenshots scale once from full size);
// phones get a raster sized by Next, so they never download the full file.
function Cover({ image }: { image: NonNullable<Project["image"]> }) {
  const { props } = getImageProps({
    src: image.src,
    alt: image.alt,
    fill: true,
    quality: 90,
    sizes: "calc(100vw - 40px)", // phones: the column, inside the 20px margins
  });
  return (
    <figure className={styles.media} style={{ aspectRatio: "2291 / 1558" }}>
      <picture>
        {image.svg && <source media="(min-width: 768px)" srcSet={image.svg} type="image/svg+xml" />}
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- props from getImageProps */}
        <img {...props} fetchPriority="high" decoding="async" className={styles.mediaFill} />
      </picture>
    </figure>
  );
}

// Artifacts rebuilt on the page, so their type is the site's (Geist / Caveat).
const artifacts: Record<ArtifactName, () => React.ReactNode> = {
  tldr: Tldr,
  context: Context,
  walkthrough: Walkthrough,
  synthesis: Synthesis,
  flow: Flow,
  versions: Versions,
  "six-changes": SixChanges,
  onboarding: Onboarding,
  "search-by-title": SearchByTitle,
  duplicate: Duplicate,
  "handoff-isbn": HandoffIsbn,
  "prototype-final": PrototypeFinal,
};

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p className={styles.p}>{rich(block.text)}</p>;
    case "h3":
      return <h3 className={styles.h3}>{block.text}</h3>;
    case "label":
      return <p className={styles.label}>{block.text}</p>;
    case "callout":
      return (
        <div className={styles.callout}>
          <h3 className={styles.calloutTitle}>{block.title}</h3>
          <p className={styles.p}>{rich(block.text)}</p>
        </div>
      );
    case "stats":
      return (
        <dl className={styles.stats}>
          {block.items.map((s) => (
            <div key={s.value} className={styles.stat}>
              <dt className={styles.statValue}>{s.value}</dt>
              <dd className={styles.statLabel}>{s.label}</dd>
            </div>
          ))}
        </dl>
      );
    case "media":
      return <Artifact media={block.media} />;
    case "artifact": {
      const A = artifacts[block.name];
      return <A />;
    }
    case "table":
      return (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {block.head.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={i} scope="row">
                        {rich(cell)}
                      </th>
                    ) : (
                      <td key={i}>{rich(cell)}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default function CaseStudy({ cs }: { cs: CS }) {
  const tabs = cs.sections.filter((s) => s.tab).map((s) => ({ id: s.id, label: s.tab! }));
  // Every section, with the tab it belongs to: one without a tab of its own counts as the last tab before it.
  let last = tabs[0]?.id ?? "";
  const spy = cs.sections.map((s) => ({ id: s.id, tab: s.tab ? (last = s.id) : last }));
  spy.push({ id: "more", tab: last }); // Explore more keeps the last tab marked
  const cover = projects.find((p) => p.name === cs.project)?.image;
  const more = cs.more.map((m) => ({ ...m, p: projects.find((p) => p.name === m.project), href: caseStudyHref(m.project) }));

  return (
    <div className={styles.page}>
      <CaseBar tabs={tabs} spy={spy} />
      <main className={`container grid ${styles.main}`}>
        <article className={styles.col}>
          <header className={styles.header}>
            <p className={styles.kicker}>
              {cs.product} <span aria-hidden="true">•</span> {cs.year}
            </p>
            <h1 className={styles.h1}>{cs.title}</h1>
            <dl className={styles.meta}>
              {cs.meta.map((m) => (
                <div key={m.label}>
                  <dt className={styles.metaLabel}>{m.label}</dt>
                  <dd className={styles.metaValue}>{m.value}</dd>
                </div>
              ))}
            </dl>
            {cover ? <Cover image={cover} /> : <Artifact media={cs.hero} priority />}
          </header>

          {cs.sections.map((s) => (
            <section
              key={s.id}
              id={s.id}
              className={styles.section}
              aria-labelledby={s.title ? `${s.id}-title` : undefined}
              aria-label={s.title ? undefined : s.eyebrow}
            >
              {s.eyebrow && <p className={styles.eyebrow}>{s.eyebrow}</p>}
              {s.title && (
                <h2 id={`${s.id}-title`} className={styles.h2}>
                  {s.title}
                </h2>
              )}
              {s.blocks.map((b, i) => (
                <BlockView key={i} block={b} />
              ))}
            </section>
          ))}

          <section id="more" className={styles.more} aria-labelledby="more-title">
            <h2 id="more-title" className={styles.moreTitle}>
              Explore more
            </h2>
            <ul className={styles.moreList}>
              {more.map((m) => {
                const shot = (
                  <span className={styles.moreShot}>
                    {m.p?.image && <Image src={m.p.image.src} alt="" fill sizes="(max-width: 767px) 100vw, 280px" className={styles.mediaFill} />}
                  </span>
                );
                return (
                  <li key={m.project} className={styles.moreCard}>
                    {m.href ? (
                      <Link href={m.href} className={styles.moreLink}>
                        {shot}
                        <span className={styles.moreText}>{m.title}</span>
                      </Link>
                    ) : (
                      // Not built yet: the card says so instead of linking.
                      <div className={styles.moreLink} aria-disabled="true">
                        {shot}
                        <span className={styles.moreText}>{m.title}</span>
                        <span className={styles.soon}>Coming soon</span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </article>
      </main>
    </div>
  );
}
