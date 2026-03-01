import { AlarmClockOff, ClipboardCheck, FileClock, HandCoins } from "lucide-react";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";

const painCards = [
  {
    icon: AlarmClockOff,
    title: "Disconnected Software Stack",
    description:
      "Multiple SaaS tools that don't fully integrate create fragmented data, duplicate entry, and reporting you can't trust.",
  },
  {
    icon: ClipboardCheck,
    title: "Systems Not Built Around Your Workflow",
    description:
      "Generic software forces your team to adapt to the tool - instead of the system adapting to how your operation actually runs.",
  },
  {
    icon: HandCoins,
    title: "Limited Operational Visibility",
    description:
      "When data lives across platforms, leaders lose real-time insight into performance, bottlenecks, and revenue flow.",
  },
  {
    icon: FileClock,
    title: "Physical Operations Without Digital Control",
    description:
      "Assets, equipment, field activity, and facilities operate outside the system - creating blind spots in accountability and tracking.",
  },
];

export function PainPoints() {
  return (
    <section className="section-space">
      <Container>
        <SectionHeader
          eyebrow="OPERATIONAL BOTTLENECKS"
          title="Growth breaks where systems don't integrate."
          description="We identify where disconnected tools, generic software constraints, limited visibility, and unmanaged physical operations create hidden inefficiencies - then engineer unified systems to restore control."
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
