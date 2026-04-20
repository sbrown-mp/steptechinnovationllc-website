import type { Metadata } from "next";
import { CheckCircle2, Phone } from "lucide-react";
import { FlyerPrintButton } from "@/components/FlyerPrintButton";
import { siteConfig } from "@/lib/config";
import { industryCards } from "@/lib/industries";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Print Flyer",
  description:
    "Printable 8.5x11 flyer for Steptech Innovation LLC services, industries, and contact details.",
  path: "/flyer",
});

const sanitizePhone = (phone: string): string => phone.replace(/[^+\d]/g, "");
const condensedOutcome = (outcome: string): string => outcome.split(",")[0]?.trim() ?? outcome;
const shorten = (text: string, max = 132): string => (text.length > max ? `${text.slice(0, max).trimEnd()}...` : text);

export default function FlyerPage() {
  return (
    <main className="flyer-page mx-auto w-full py-8 print:py-0">
      <FlyerPrintButton />

      <section className="flyer-screen flyer-sheet mx-auto rounded-2xl border border-white/20 bg-slate-950 shadow-2xl shadow-cyan-950/30 print:hidden">
        <div className="flyer-content h-full w-full bg-[radial-gradient(circle_at_15%_8%,rgba(45,212,191,0.2),transparent_32%),radial-gradient(circle_at_85%_6%,rgba(56,189,248,0.22),transparent_36%),linear-gradient(180deg,#020617_0%,#0b1120_100%)] p-7 text-slate-100 print:p-3">
          <header className="glass-card border-cyan-300/35 p-5 print:p-3.5">
            <p className="eyebrow">Business Technology Solutions</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-white print:mt-3 print:text-[1.65rem]">Steptech Innovation LLC</h1>
            <p className="mt-2 text-sm text-cyan-50/95 print:text-[11px]">
              Stop losing revenue to broken processes and disconnected systems. We engineer custom software and
              hardware-integrated systems that streamline operations and reduce admin burden.
            </p>
          </header>

          <section className="flyer-section mt-4 print:mt-2">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200 print:text-xs">Core Services</h2>
            <div className="core-services-grid mt-3 grid grid-cols-1 gap-3 print:gap-2 sm:grid-cols-2">
              {siteConfig.packages.map((pkg) => (
                <article key={pkg.name} className="glass-card border-white/20 p-3.5 print:p-2.5">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200 print:text-[10px]">Starting at {pkg.startingPrice}</p>
                  <h3 className="mt-1 text-sm font-semibold leading-snug text-white print:text-xs">{pkg.name}</h3>
                  <p className="mt-1 text-[0.95rem] text-slate-300 print:text-[10px]">{shorten(pkg.description, 100)}</p>
                  <ul className="mt-2 space-y-1.5 print:mt-1 print:space-y-1">
                    {pkg.deliverables.slice(0, 3).map((deliverable) => (
                      <li key={deliverable} className="flex items-start gap-1.5 text-sm leading-snug text-slate-200 print:text-[10px]">
                        <CheckCircle2 className="mt-[1px] h-3 w-3 shrink-0 text-emerald-300" />
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="flyer-section bottom-cards-grid mt-4 grid grid-cols-1 gap-3 print:mt-3 print:gap-2">
            <article className="glass-card border-white/20 p-4 print:p-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-200 print:text-xs">Industries Served</h2>
              <div className="mt-2 space-y-1.5 text-sm leading-relaxed text-slate-200 print:mt-1 print:space-y-1 print:text-[10px]">
                {industryCards.map((industry) => (
                  <p key={industry.name}>
                    <span className="font-semibold text-white">{industry.name}:</span> {condensedOutcome(industry.outcome)}.
                  </p>
                ))}
                <p>
                  <span className="font-semibold text-white">All Industries:</span> We serve all industries with custom solutions for software and hardware-integrated systems.
                </p>
              </div>
            </article>
          </section>

          <section className="flyer-section mt-4 rounded-xl border border-cyan-300/35 bg-cyan-300/10 p-5 print:mt-2 print:p-3">
            <h2 className="text-base font-semibold text-white print:text-sm">Ready to eliminate process friction?</h2>
            <p className="mt-1 text-sm text-slate-200 print:text-[10px]">
              Call now for a workflow audit and we will map your highest-impact system upgrade.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-100 print:mt-2 print:gap-x-3 print:gap-y-1 print:text-[10px]">
              <a href={`tel:${sanitizePhone(siteConfig.phone)}`} className="inline-flex items-center gap-2 font-semibold text-white">
                <Phone className="h-4 w-4 text-cyan-200" />
                {siteConfig.phone}
              </a>
              <span>{siteConfig.email}</span>
              <span>steptechinnovation.com</span>
            </div>
            <p className="mt-2 text-xs text-slate-300 print:mt-1 print:text-[10px]">
              Serving Locally In {siteConfig.serviceAreas.join(", ")}, Florida
            </p>
          </section>
        </div>
      </section>

      <section className="flyer-print hidden print:block">
        <div className="flyer-print-page">
          <div className="flyer-print-main">
            <header className="flyer-print-card flyer-print-header">
              <p className="flyer-print-eyebrow">Business Technology Solutions</p>
              <h1 className="flyer-print-title">Steptech Innovation LLC</h1>
              <p className="flyer-print-subtitle">
                Stop losing revenue to broken processes and disconnected systems. We engineer custom software and
                hardware-integrated systems that streamline operations and reduce admin burden.
              </p>
            </header>

            <section className="flyer-print-section">
              <h2 className="flyer-print-section-title">Core Services</h2>
              <div className="flyer-print-grid">
                {siteConfig.packages.map((pkg) => (
                  <article key={`print-${pkg.name}`} className="flyer-print-card">
                    <p className="flyer-print-price">Starting at {pkg.startingPrice}</p>
                    <h3 className="flyer-print-card-title">{pkg.name}</h3>
                  <p className="flyer-print-copy">{shorten(pkg.description, 120)}</p>
                  <ul className="flyer-print-list flyer-print-checklist">
                    {pkg.deliverables.slice(0, 3).map((deliverable) => (
                      <li key={`print-${pkg.name}-${deliverable}`} className="flyer-print-checklist-item">
                        <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-300" />
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </article>
                ))}
              </div>
            </section>

            <section className="flyer-print-section">
              <article className="flyer-print-card">
                <h2 className="flyer-print-section-title">Industries Served</h2>
                <div className="flyer-print-copy-stack">
                  {industryCards.map((industry) => (
                    <p key={`print-industry-${industry.name}`}>
                      <strong>{industry.name}:</strong> {condensedOutcome(industry.outcome)}.
                    </p>
                  ))}
                  <p>
                    <strong>All Industries:</strong> We serve all industries with custom solutions for software and
                    hardware-integrated systems.
                  </p>
                </div>
              </article>
            </section>
          </div>

          <section className="flyer-print-card flyer-print-cta">
            <h2 className="flyer-print-card-title">Ready to eliminate process friction?</h2>
            <p className="flyer-print-copy">
              Call now for a workflow audit and we will map your highest-impact system upgrade.
            </p>
            <p className="flyer-print-meta">
              {siteConfig.phone} | {siteConfig.email} | steptechinnovation.com
            </p>
            <p className="flyer-print-meta">Serving Locally In {siteConfig.serviceAreas.join(", ")}, Florida</p>
          </section>
        </div>
      </section>
    </main>
  );
}
