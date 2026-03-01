import { faqItems } from "@/lib/config";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";

export function FAQ() {
  return (
    <section className="section-space">
      <Container>
        <SectionHeader
          eyebrow="FAQ"
          title="Answers to common objections before you commit."
          description="Straightforward delivery expectations for busy operators."
        />

        <div className="space-y-4">
          {faqItems.map((item) => (
            <details key={item.question} className="glass-card group p-5" open={false}>
              <summary className="cursor-pointer list-none text-base font-semibold text-white marker:content-none">
                <span>{item.question}</span>
              </summary>
              <p className="mt-3 text-sm text-slate-300">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
