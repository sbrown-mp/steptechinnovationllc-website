import type { Metadata } from "next";
import { BarChart3, ClipboardList, DollarSign } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Free System Audit",
  description:
    "Book a free System Audit with Steptech Innovation LLC to identify disconnected systems, prioritize upgrades, and estimate ROI.",
  path: "/audit",
});

const deliverables = [
  {
    title: "Operational Breakdown",
    description: "A clear current-state map showing where revenue leaks, delays, or manual work are slowing growth.",
    icon: ClipboardList,
  },
  {
    title: "System Recommendation",
    description:
      "A practical recommendation outlining whether you need custom software, SaaS consolidation, automation, or hardware integration.",
    icon: BarChart3,
  },
  {
    title: "ROI Projection",
    description:
      "A realistic estimate of time savings, cost reduction, and operational improvement from your recommended system upgrade.",
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
              <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
                Free System Audit for businesses ready to eliminate inefficiencies and regain operational control.
              </h1>
              <p className="mt-5 max-w-3xl text-lg text-slate-200">
                We identify where revenue is leaking, which systems are disconnected, and what should be built, replaced,
                or automated first.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="#request-audit" className="btn-secondary w-full sm:w-auto">
                  Request Free Audit
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

          <section id="request-audit" className="scroll-mt-24">
            <h2 className="mb-5 text-2xl font-semibold text-white">Request Your Free System Audit</h2>
            <ContactForm
              inquiryType="audit"
              sourcePage="/audit"
              submitLabel="Request Free Audit"
              successMessage="Form submitted successfully. We will reach out within one business day. Redirecting you to the home page..."
            />
          </section>
        </div>
      </Container>
    </main>
  );
}
