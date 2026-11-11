import Image from "next/image";
import type { Block, CaseStudy as CS, Media } from "../../content/caseStudies";
import { projects } from "../../content/projects";
import { rich } from "../rich";
import CaseBar from "./CaseBar";
import Reveal from "./Reveal";
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
        <Image src={media.src} alt={media.label} fill sizes="(max-width: 767px) 100vw, 840px" quality={90} priority={priority} className={styles.mediaFill} />
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
  const more = cs.more.map((m) => ({ ...m, p: projects.find((p) => p.name === m.project) }));

  return (
    <div className={styles.page}>
      <CaseBar tabs={tabs} spy={spy} />
      <Reveal />
      <main className={`container grid ${styles.main}`}>
        <article className={styles.col}>
          <header className={styles.header} data-reveal-item="">
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
            <Artifact media={cs.hero} priority />
          </header>

          {cs.sections.map((s) => (
            <section key={s.id} id={s.id} className={styles.section} aria-labelledby={`${s.id}-title`} data-reveal-item="">
              <p className={styles.eyebrow}>{s.eyebrow}</p>
              <h2 id={`${s.id}-title`} className={styles.h2}>
                {s.title}
              </h2>
              {s.blocks.map((b, i) => (
                <BlockView key={i} block={b} />
              ))}
            </section>
          ))}

          <section className={styles.more} aria-labelledby="more-title" data-reveal-item="">
            <h2 id="more-title" className={styles.moreTitle}>
              Explore more
            </h2>
            <ul className={styles.moreList}>
              {more.map((m) => (
                // The other case study pages are not built yet: each card says so instead of linking.
                <li key={m.project} className={styles.moreCard} aria-disabled="true">
                  <span className={styles.moreShot}>
                    {m.p?.image && <Image src={m.p.image.src} alt="" fill sizes="(max-width: 767px) 100vw, 280px" className={styles.mediaFill} />}
                  </span>
                  <span className={styles.moreText}>{m.title}</span>
                  <span className={styles.soon}>Coming soon</span>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </main>
    </div>
  );
}
