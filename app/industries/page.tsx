import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Industries",
  description:
    "Steptech Innovation LLC helps HVAC, plumbing, electrical, home health, property management, and construction teams run cleaner operations.",
  path: "/industries",
});

const industryCards = [
  {
    name: "HVAC",
    pain: "Dispatch complexity, maintenance follow-up gaps, and inconsistent invoicing speed.",
    outcome: "Cleaner dispatch workflows, tighter follow-up automation, and faster post-job billing.",
  },
  {
    name: "Plumbing",
    pain: "Emergency scheduling pressure and manual handoffs between field and office staff.",
    outcome: "Live scheduling visibility and standardized handoffs that reduce office rework.",
  },
  {
    name: "Electrical",
    pain: "Project documentation inconsistencies and quote-to-job conversion delays.",
    outcome: "Repeatable documentation workflows and automated follow-up for open estimates.",
  },
  {
    name: "Home Health Agencies",
    pain: "Documentation overhead, compliance friction, and fragmented tools.",
    outcome: "Digital documentation systems with stronger process control and secure data handling.",
  },
  {
    name: "Property Management",
    pain: "Scattered maintenance requests and unpredictable vendor communication loops.",
    outcome: "Centralized request workflows and automation that improves response consistency.",
  },
  {
    name: "Construction",
    pain: "Coordination bottlenecks, paperwork lag, and delayed billing cycles.",
    outcome: "Structured workflows for job updates, approvals, and invoicing acceleration.",
  },
];

export default function IndustriesPage() {
  return (
    <main className="section-space">
      <Container>
        <section className="glass-card p-8 md:p-10">
          <p className="eyebrow">Industries</p>
          <h1 className="mt-5 text-4xl font-semibold text-white md:text-5xl">Built for high-velocity service operations.</h1>
          <p className="mt-5 max-w-3xl text-slate-200">
            We adapt each system to your field reality, team structure, and compliance environment instead of forcing a
            generic template.
          </p>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {industryCards.map((industry) => (
            <article key={industry.name} className="glass-card h-full p-6">
              <h2 className="text-2xl font-semibold text-white">{industry.name}</h2>
              <p className="mt-4 text-sm text-slate-300">
                <span className="font-semibold text-slate-100">Common pain:</span> {industry.pain}
              </p>
              <p className="mt-3 text-sm text-cyan-100">
                <span className="font-semibold text-cyan-200">Expected outcome:</span> {industry.outcome}
              </p>
            </article>
          ))}
        </section>

        <section className="glass-card mt-10 p-7 md:p-8">
          <h2 className="text-2xl font-semibold text-white">Not listed? We still may be a fit.</h2>
          <p className="mt-3 text-slate-200">If your team runs recurring workflows with high admin load, we can likely improve it.</p>
          <Link href="/audit" className="btn-primary mt-6">
            Request Workflow Audit
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </section>
      </Container>
    </main>
  );
}
