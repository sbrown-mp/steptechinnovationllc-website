import { AlarmClockOff, ClipboardCheck, FileClock, HandCoins } from "lucide-react";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";

const painCards = [
  {
    icon: AlarmClockOff,
    title: "Scheduling chaos",
    description:
      "Prevent double-bookings and no-shows with automated dispatch logic, reminders, and real-time visibility.",
  },
  {
    icon: ClipboardCheck,
    title: "Missed follow-ups",
    description:
      "Automatically trigger next steps after estimates, service visits, and customer interactions so leads do not slip away.",
  },
  {
    icon: HandCoins,
    title: "Slow invoicing and collections",
    description:
      "Tighten your post-job flow to send invoices faster, reduce billing errors, and collect revenue sooner.",
  },
  {
    icon: FileClock,
    title: "Admin overload",
    description:
      "Remove repetitive manual updates with custom workflows and centralized dashboards your team can trust.",
  },
];

export function PainPoints() {
  return (
    <section className="section-space">
      <Container>
        <SectionHeader
          eyebrow="Operational bottlenecks"
          title="If your office team is swamped, your growth gets capped."
          description="We target the process gaps that quietly drain profit so your crew can stay focused on billable work."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {painCards.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 0.06}>
                <article className="glass-card h-full p-6">
                  <div className="inline-flex rounded-xl bg-cyan-300/15 p-3 text-cyan-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm text-slate-300">{item.description}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
