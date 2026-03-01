import { Compass, Rocket, TrendingUp } from "lucide-react";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";

const steps = [
  {
    title: "Audit",
    description:
      "We map your workflow, identify where labor and revenue leak, and define your highest-ROI system upgrade.",
    icon: Compass,
  },
  {
    title: "Build",
    description:
      "We implement the automation, dashboard, and operating logic with milestones your team can validate weekly.",
    icon: Rocket,
  },
  {
    title: "Scale",
    description:
      "We launch, train your team, and track impact so your process keeps improving after go-live.",
    icon: TrendingUp,
  },
];

export function ProcessSteps() {
  return (
    <section className="section-space">
      <Container>
        <SectionHeader
          eyebrow="3-step delivery"
          title="Simple process. Fast outcomes."
          description="No bloated multi-month roadmap. We prioritize one critical workflow and ship quickly."
          center
        />

        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} delay={index * 0.08}>
                <article className="glass-card h-full p-6 text-center">
                  <div className="mx-auto inline-flex rounded-xl bg-emerald-300/15 p-3 text-emerald-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200/90">Step {index + 1}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm text-slate-300">{step.description}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
