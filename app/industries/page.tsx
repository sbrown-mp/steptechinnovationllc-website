import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { industryCards } from "@/lib/industries";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Industries",
  description:
    "Steptech Innovation LLC helps HVAC, plumbing, electrical, home health, property management, and construction teams run cleaner operations.",
  path: "/industries",
});

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
            <article
              key={industry.name}
              className={`glass-card h-full p-6 ${
                industry.name === "Real Estate and Land Operations" ? "md:col-span-2 xl:col-span-3" : ""
              }`}
            >
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
