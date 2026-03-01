import { LockKeyhole, ShieldCheck, TimerReset } from "lucide-react";
import { Container } from "@/components/Container";

const credibilityPoints = [
  {
    icon: ShieldCheck,
    title: "Enterprise-grade engineering",
    text: "Reliable architecture and clean implementation patterns from day one.",
  },
  {
    icon: LockKeyhole,
    title: "Secure systems",
    text: "Built with role-based access, strong data handling, and audit-aware workflows.",
  },
  {
    icon: TimerReset,
    title: "Fast delivery",
    text: "Focused project scope and weekly milestones to move from bottleneck to launch quickly.",
  },
];

export function CredibilityStrip() {
  return (
    <section className="pb-8 pt-2 md:pb-10">
      <Container>
        <div className="glass-card grid gap-4 px-5 py-5 md:grid-cols-3 md:px-7">
          {credibilityPoints.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="flex items-start gap-3">
                <div className="rounded-lg bg-cyan-300/10 p-2 text-cyan-200">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-xs text-slate-300">{item.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
