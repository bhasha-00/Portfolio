import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "../../content/projects";
import { caseStudies, caseStudyBySlug } from "../../content/caseStudies";
import CaseStudy from "../../components/case-study/CaseStudy";

// One static page per case study (content/caseStudies.ts).
export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const cs = caseStudyBySlug((await params).slug);
  if (!cs) return {};
  return { title: `${cs.product}: ${projects.find((p) => p.name === cs.project)?.title ?? cs.title} · Bhasha Maheshwari`, description: cs.sections[0]?.title };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const cs = caseStudyBySlug((await params).slug);
  if (!cs) notFound();
  return <CaseStudy cs={cs} />;
}
