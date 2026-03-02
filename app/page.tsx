import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";
import { CredibilityStrip } from "@/components/CredibilityStrip";
import { FAQ } from "@/components/FAQ";
import { Hero } from "@/components/Hero";
import { Packages } from "@/components/Packages";
import { PainPoints } from "@/components/PainPoints";
import { ProcessSteps } from "@/components/ProcessSteps";
import { Testimonials } from "@/components/Testimonials";
import { Container } from "@/components/Container";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Business Technology Solutions",
  description:
    "Steptech Innovation LLC helps Florida service businesses reduce admin labor, improve scheduling, and speed up collections.",
  path: "/",
});

export default function HomePage() {
  return (
    <main>
      <Hero />
      <CredibilityStrip />
      <PainPoints />
      <Packages />
      <ProcessSteps />
      <Testimonials />
      <FAQ />

      <section className="pb-24 pt-4">
        <Container>
          <div className="glass-card bg-gradient-to-r from-slate-900/90 via-slate-800/70 to-cyan-950/50 p-8 md:p-10">
            <p className="eyebrow">Ready to move fast?</p>
            <h2 className="mt-5 text-3xl font-semibold text-white md:text-4xl">
              Get a Workflow Audit and a practical system build plan you can act on immediately.
            </h2>
            <p className="mt-4 max-w-3xl text-slate-200">
              We&apos;ll identify the highest-impact system upgrade, estimate ROI, and map delivery milestones so you know
              exactly what to build first.
            </p>
            <p className="mt-3 text-sm text-slate-300">
              Designed for small businesses and high-accountability environments.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/audit" className="btn-primary w-full sm:w-auto">
                Get Workflow Audit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/book-audit" className="btn-secondary w-full sm:w-auto">
                Book a 15-minute Call
                <CalendarClock className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
