import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/Container";
import { Packages } from "@/components/Packages";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Services",
  description:
    "Explore Steptech Innovation LLC services for custom applications, SaaS consolidation, workflow automation, and hardware-integrated systems.",
  path: "/services",
});

const serviceDetails = [
  {
    title: "Custom Application Development",
    startingPrice: "$15,000",
    range: "$15,000 - $150,000+ depending on complexity",
    paragraphs: [
      "We engineer custom software platforms around your exact operational model, not generic templates. This includes secure data architecture, role-based user access, and business logic tailored to how your teams actually execute work.",
      "AI capabilities are integrated where they improve speed and decision quality, while keeping workflows explainable and accountable for leadership and frontline teams.",
    ],
    bullets: [
      "Internal operations software built for your process constraints",
      "Client portals and role-based dashboards for controlled visibility",
      "AI-assisted workflow automation integrated into existing operations",
      "Secure cloud architecture with audit-ready permission models",
      "API integrations across CRM, scheduling, finance, and communications",
      "Scalable system design for multi-site and multi-team growth",
    ],
  },
  {
    title: "SaaS Consolidation & System Replacement",
    startingPrice: "$15,000",
    range: "$15,000 - $120,000+ depending on scope",
    paragraphs: [
      "When your team is forced to switch between disconnected tools, performance drops and costs rise. We audit your current stack, identify redundancy, and design a unified replacement strategy with clear implementation phases.",
      "The result is fewer subscriptions, cleaner reporting, and a system architecture aligned to operational outcomes instead of vendor feature overlap.",
    ],
    bullets: [
      "SaaS audit and cost analysis across your active tool stack",
      "Redundancy elimination and workflow-level consolidation planning",
      "Data migration and controlled system rebuild sequencing",
      "Unified reporting dashboards for finance, operations, and leadership",
      "Access, permissions, and governance model alignment",
      "Subscription cost reduction strategy tied to measurable ROI",
    ],
  },
  {
    title: "Workflow Automation Systems",
    startingPrice: "$3,500",
    range: "$3,500 - $12,000 depending on scope",
    paragraphs: [
      "We map operational bottlenecks and implement automation logic that removes repetitive administrative work. The focus is practical throughput gains: faster dispatch cycles, cleaner handoffs, and reduced follow-up failures.",
      "AI-triggered alerts and decision support can be layered into routing and escalation flows so teams respond faster without adding operational overhead.",
    ],
    bullets: [
      "Dispatch and scheduling automation with rule-based routing",
      "Invoicing acceleration and payment handoff workflows",
      "Task routing systems for office and field coordination",
      "Real-time operational dashboards with performance visibility",
      "AI-triggered process alerts for exceptions and SLA risk",
      "Automated follow-up sequences to reduce dropped revenue",
    ],
  },
  {
    title: "Hardware-Integrated Systems",
    startingPrice: "$25,000",
    range: "$25,000 - $150,000+ depending on hardware complexity",
    paragraphs: [
      "For teams that rely on physical assets, field movement, or device-driven workflows, we engineer hardware-integrated platforms that connect operations in real time. We design the digital and physical layers to work as one accountable system.",
      "This includes selecting integration methods, defining synchronization logic, and building dashboards that turn raw device events into operational control and measurable outcomes.",
    ],
    bullets: [
      "QR and barcode scanning systems for asset-state verification",
      "RFID and NFC integration for low-friction identification workflows",
      "GPS-based tracking tied to operational routing and status control",
      "Asset and equipment monitoring with event-level traceability",
      "Real-time device synchronization with cloud dashboards",
      "Hardware telemetry pipelines with alerting and audit history",
    ],
  },
];

export default function ServicesPage() {
  return (
    <main>
      <section className="section-space pb-12">
        <Container>
          <div className="glass-card p-8 md:p-10">
            <p className="eyebrow">Services</p>
            <h1 className="mt-5 text-4xl font-semibold text-white md:text-5xl">Systems that remove friction from daily operations.</h1>
            <p className="mt-5 max-w-3xl text-slate-200">
              We build practical business technology solutions that reduce admin labor, improve workflow reliability,
              and increase operational throughput.
            </p>
          </div>
        </Container>
      </section>

      <Packages />

      <section className="section-space pt-4">
        <Container>
          <h2 className="text-3xl font-semibold text-white">Detailed service scopes</h2>
          <div className="mt-6 grid gap-5">
            {serviceDetails.map((service) => (
              <article key={service.title} className="glass-card p-7">
                <h3 className="text-2xl font-semibold text-white">{service.title}</h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  <p className="rounded-lg bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-100">
                    Starting at {service.startingPrice}
                  </p>
                  <p className="rounded-lg bg-slate-900/70 px-3 py-2 text-sm text-slate-200">Typical range: {service.range}</p>
                </div>
                {service.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-4 text-slate-200">
                    {paragraph}
                  </p>
                ))}

                <ul className="mt-5 space-y-3">
                  {service.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-sm text-slate-200">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/audit" className="btn-primary mt-6 w-full sm:w-auto">
                  Discuss This Build
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>

          <div className="glass-card mt-10 p-7">
            <h2 className="text-2xl font-semibold text-white">Start with a Workflow Audit</h2>
            <p className="mt-3 text-slate-200">We will identify which package creates the fastest measurable impact for your team.</p>
            <Link href="/audit" className="btn-primary mt-6">
              Get Workflow Audit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
