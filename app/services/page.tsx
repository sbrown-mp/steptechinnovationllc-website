import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Cpu, LayoutDashboard, Link2 } from "lucide-react";
import { Container } from "@/components/Container";
import { Packages } from "@/components/Packages";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Services",
  description:
    "Explore Steptech Innovation LLC service packages for workflow automation, scheduling systems, and compliance documentation.",
  path: "/services",
});

const addons = [
  {
    title: "Custom dashboards",
    description: "Live visibility into jobs, team utilization, pipeline status, and cashflow signals.",
    icon: LayoutDashboard,
  },
  {
    title: "Tool integrations",
    description: "Connect CRM, scheduling, invoicing, and communication systems into one cleaner workflow.",
    icon: Link2,
  },
  {
    title: "AI-assisted workflows",
    description: "Use AI where it supports speed and accuracy without disrupting proven operational processes.",
    icon: Cpu,
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
          <h2 className="text-3xl font-semibold text-white">Add-on capabilities</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {addons.map((addon) => {
              const Icon = addon.icon;
              return (
                <article key={addon.title} className="glass-card p-6">
                  <div className="inline-flex rounded-xl bg-cyan-300/10 p-3 text-cyan-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white">{addon.title}</h3>
                  <p className="mt-3 text-sm text-slate-300">{addon.description}</p>
                </article>
              );
            })}
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
