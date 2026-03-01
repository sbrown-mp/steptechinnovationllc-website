import { Quote } from "lucide-react";
import { testimonialItems } from "@/lib/config";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";

export function Testimonials() {
  return (
    <section className="section-space">
      <Container>
        <SectionHeader
          eyebrow="Social proof"
          title="Trusted by teams that need operational control fast."
          description="Representative client feedback placeholders until production case studies are published."
          center
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {testimonialItems.map((item, index) => (
            <Reveal key={item.name} delay={index * 0.08}>
              <article className="glass-card h-full p-6">
                <Quote className="h-5 w-5 text-cyan-200" />
                <p className="mt-4 text-sm text-slate-200">&quot;{item.quote}&quot;</p>
                <p className="mt-5 text-sm font-semibold text-white">{item.name}</p>
                <p className="text-xs uppercase tracking-[0.12em] text-cyan-200/80">{item.role}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
