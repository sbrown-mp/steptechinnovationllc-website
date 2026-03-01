import type { Metadata } from "next";
import { BarChart3, ClipboardList, DollarSign, MoveRight } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { siteConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Workflow Audit",
  description:
    "Book a Workflow Audit with Steptech Innovation LLC to map bottlenecks, prioritize automation, and estimate ROI.",
  path: "/audit",
});

const deliverables = [
  {
    title: "Process map",
    description: "A clear current-state map showing where work stalls, handoffs fail, or admin time gets burned.",
    icon: ClipboardList,
  },
  {
    title: "Automation plan",
    description: "A scoped implementation roadmap for the fastest, highest-ROI workflow improvement.",
    icon: BarChart3,
  },
  {
    title: "ROI estimate",
    description: "A practical estimate of labor hours, follow-up recovery, and cashflow lift from your recommended build.",
    icon: DollarSign,
  },
];

export default function AuditPage() {
  return (
    <main className="section-space">
      <Container>
        <div className="mx-auto max-w-5xl space-y-10">
          <Reveal>
            <section className="glass-card p-8 md:p-10">
              <p className="eyebrow">Main CTA destination</p>
              <h1 className="mt-5 text-4xl font-semibold leading-tight text-white md:text-5xl">
                Workflow Audit for Florida service businesses ready to fix bottlenecks fast.
              </h1>
              <p className="mt-5 max-w-3xl text-lg text-slate-200">
                This is the fastest way to identify where your current process is slowing growth and what system should be
                built first.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href={siteConfig.calendlyUrl} className="btn-primary w-full sm:w-auto" target="_blank" rel="noreferrer">
                  Book Audit Call
                  <MoveRight className="ml-2 h-4 w-4" />
                </a>
                <a href="#request-audit" className="btn-secondary w-full sm:w-auto">
                  Request Audit
                </a>
              </div>
            </section>
          </Reveal>

          <section className="grid gap-5 md:grid-cols-3">
            {deliverables.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={index * 0.08}>
                  <article className="glass-card h-full p-6">
                    <div className="inline-flex rounded-xl bg-cyan-400/15 p-3 text-cyan-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-xl font-semibold text-white">{item.title}</h2>
                    <p className="mt-3 text-sm text-slate-300">{item.description}</p>
                  </article>
                </Reveal>
              );
            })}
          </section>

          <Reveal>
            <section className="glass-card p-6 md:p-8">
              <h2 className="text-2xl font-semibold text-white">Workflow Audit (credited toward build)</h2>
              <p className="mt-3 text-slate-200">
                Audit fee: <span className="font-semibold text-cyan-200">${siteConfig.auditPrice}</span>. If we move into
                a build package, this amount is credited toward the project.
              </p>
            </section>
          </Reveal>

          <section id="request-audit" className="scroll-mt-24">
            <h2 className="mb-5 text-2xl font-semibold text-white">Request Your Audit</h2>
            <ContactForm
              inquiryType="audit"
              sourcePage="/audit"
              submitLabel="Request Audit"
              successMessage="Audit request received. We will reach out within one business day to confirm your call."
            />
          </section>
        </div>
      </Container>
    </main>
  );
}
