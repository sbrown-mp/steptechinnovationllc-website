import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCheck, Phone } from "lucide-react";
import { Container } from "@/components/Container";
import { siteConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "Learn how Steptech Innovation LLC delivers practical workflow systems for service operators across Central Florida.",
  path: "/about",
});

const principles = [
  "Solve one high-impact bottleneck first",
  "Keep systems practical for real teams",
  "Ship quickly with measurable milestones",
  "Build secure, maintainable foundations",
];

const sanitizePhone = (phone: string): string => phone.replace(/[^+\d]/g, "");

export default function AboutPage() {
  return (
    <main className="section-space">
      <Container>
        <div className="mx-auto max-w-5xl space-y-8">
          <section className="glass-card p-8 md:p-10">
            <p className="eyebrow">About Steptech Innovation LLC</p>
            <h1 className="mt-5 text-4xl font-semibold text-white md:text-5xl">Engineering-first systems for growth-stage operators.</h1>
            <p className="mt-5 text-slate-200">
              Steptech Innovation LLC helps small and midsize service businesses in Central Florida modernize core
              workflows without enterprise-level complexity. We combine software engineering discipline with practical
              operations thinking so owners can close work faster with less admin drag.
            </p>
          </section>

          <section className="grid gap-5 md:grid-cols-2">
            <article className="glass-card p-7">
              <h2 className="text-2xl font-semibold text-white">Why local teams choose us</h2>
              <p className="mt-4 text-sm text-slate-300">
                We understand how field teams, dispatchers, and office admins actually work together. That means cleaner
                implementations, better adoption, and faster business impact.
              </p>
            </article>

            <article className="glass-card p-7">
              <h2 className="text-2xl font-semibold text-white">Delivery principles</h2>
              <ul className="mt-4 space-y-3">
                {principles.map((principle) => (
                  <li key={principle} className="flex items-center gap-2 text-sm text-slate-200">
                    <CheckCheck className="h-4 w-4 text-emerald-300" />
                    {principle}
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <section className="glass-card p-7 md:p-8">
            <h2 className="text-2xl font-semibold text-white">Next step</h2>
            <p className="mt-3 text-slate-200">
              Start with a Workflow Audit so we can map your operation and define the fastest path to measurable gains.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/audit" className="btn-primary w-full sm:w-auto">
                Get Workflow Audit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a href={`tel:${sanitizePhone(siteConfig.phone)}`} className="btn-secondary w-full sm:w-auto">
                Call Now
                <Phone className="ml-2 h-4 w-4" />
              </a>
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}
