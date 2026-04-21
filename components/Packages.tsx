import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";

export function Packages() {
  return (
    <section className="section-space" id="packages">
      <Container>
        <SectionHeader
          eyebrow="Core service pillars"
          title="Engineering-led systems with clear pricing."
          description="Each service includes discovery, implementation, and operational handover to keep delivery measurable and controlled."
          center
        />

        <div className="grid gap-6 md:grid-cols-2">
          {siteConfig.packages.map((pkg, index) => (
            <Reveal key={pkg.name} delay={index * 0.08}>
              <article className="glass-card flex h-full flex-col p-6">
                <h3 className="text-2xl font-semibold text-white">{pkg.name}</h3>
                <p className="mt-2 text-sm text-slate-200">{pkg.description}</p>

                <ul className="mt-5 space-y-3">
                  {pkg.deliverables.map((deliverable) => (
                    <li key={deliverable} className="flex items-start gap-2 text-sm text-slate-200">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                      <span>{deliverable}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <Link href={pkg.ctaHref} className="btn-primary w-full">
                    {pkg.ctaLabel}
                  </Link>
                  <p className="mt-4 text-xs text-slate-400">{pkg.engagementRange}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
