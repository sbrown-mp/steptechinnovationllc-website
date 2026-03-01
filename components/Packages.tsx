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
          eyebrow="Fixed-scope packages"
          title="Choose the build that solves your biggest workflow pain first."
          description="Each package includes discovery, implementation, and team handover so you can launch quickly with less risk."
          center
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {siteConfig.packages.map((pkg, index) => (
            <Reveal key={pkg.name} delay={index * 0.08}>
              <article className="glass-card flex h-full flex-col p-6">
                <h3 className="text-2xl font-semibold text-white">{pkg.name}</h3>
                <p className="mt-2 text-lg font-semibold text-cyan-200">{pkg.priceRange}</p>
                <p className="mt-1 text-sm text-slate-300">Timeline: {pkg.timeline}</p>
                <p className="mt-3 rounded-lg bg-cyan-400/10 p-3 text-sm text-cyan-100">Best for: {pkg.bestFor}</p>

                <ul className="mt-5 space-y-3">
                  {pkg.deliverables.map((deliverable) => (
                    <li key={deliverable} className="flex items-start gap-2 text-sm text-slate-200">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                      <span>{deliverable}</span>
                    </li>
                  ))}
                </ul>

                <Link href={pkg.ctaHref} className="btn-primary mt-6 w-full">
                  {pkg.ctaLabel}
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
