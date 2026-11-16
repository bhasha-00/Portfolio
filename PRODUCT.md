# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and hiring managers filling product design and UX/UI design roles at any kind of product company, consumer or B2B. They are screening many portfolios and give each one about ten seconds before deciding whether to read further. Their job: decide quickly whether Bhasha is worth an interview, then find the proof (a case study) and a way to contact her.

## Product Purpose

The portfolio of Bhasha Maheshwari, a product and UX/UI designer with 2+ years across B2B SaaS. It exists to get her interviews for full-time product design roles. Success is a recruiter who, in one visit, understands what she does, sees evidence she can do it, senses who she is, and reaches out.

It should read as the portfolio of a designer with personality and with product thinking: someone who reasons about business goals and user needs, not only screens.

## Positioning

Three things, confirmed by Bhasha, that the portfolio must make a recruiter remember:

- **Complex systems at scale.** She takes dense enterprise workflows and makes them simple, with measured results.
- **Industrial design roots.** She trained in product design and still makes things by hand: paper, light, charcoal.
- **End-to-end ownership.** Research through handoff: interviews, flows, states, and documentation the development team adopts.

Building her own tools with AI is real and shown on the site (AI Tinkering), but it is supporting evidence, not one of the three lead claims.

## Operating Context

- Reached from a link in an application, a resume or LinkedIn; read on a laptop at work or on a phone.
- One home page with four parts (Home, Projects, AI Tinkering, About) and one page per case study.
- Contact is by email or LinkedIn, from the end of the home page.

## Capabilities and Constraints

- Next.js (App Router), TypeScript and CSS, deployed on Vercel from the `main` branch of `bhasha-00/Portfolio`.
- Four case studies: LSNeo Lite (cataloguing), Design system, Chatbot, NOVA.
- **Metrics stay as written.** The numbers in the case studies are real; they are never rounded up, reworded into bigger claims, or added to.
- **NOVA is under NDA.** Only what is already cleared is shown; nothing more is revealed or invented.
- **Original art only.** Bhasha's own illustrations, characters and artifacts; no third-party IP.
- **Artifacts are pixel-identical.** Every image she supplies is shown exactly as exported: lossless, never resized or re-encoded.
- Undecided: a custom domain (planned as the last build step).

## Brand Commitments

- Name: Bhasha Maheshwari. Role line: Product designer.
- Headline: "Translating business goals and user needs into interfaces that perform."
- Closing line: "Let's think out loud together." / "Open to full-time roles and occasional tea breaks."
- The visual system is already built and is binding: see `artdirection.md` and `app/tokens.css` (red, cream and ink; Geist and Caveat; the origami crane companion).

## Evidence on Hand

- Case study content and artifacts: `app/content/caseStudies.ts`, `public/case-studies/`.
- Card summaries and results: `app/content/projects.ts`.
- Working tools: Pixel peeper (live), Slither (live), Exploded Hierarchy (not released; shown as "Coming soon").
- Hand-made work, photographed: `public/about/photos/`.
- Not on hand, never to be fabricated: testimonials, client logos, awards, press.

## Product Principles

1. **Ten seconds first.** The first screen must say who she is and what she delivers before anything asks for attention.
2. **Proof over claims.** Every statement about her ability points at a result, an artifact or a working tool.
3. **Personality carries, it does not compete.** Illustration, handwriting and the crane show who she is; they never slow a recruiter reaching the work.
4. **Show the thinking.** Case studies show the reasoning from business goal and user need to the design, not only the final screens.
5. **Nothing embellished.** Real metrics, cleared material only, her own art.

## Accessibility & Inclusion

Text meets WCAG AA contrast. Motion respects `prefers-reduced-motion`. Animation never delays content, and the intro is skippable.
