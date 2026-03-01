import type { Metadata } from "next";
import { Clock3, PhoneCall } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { Container } from "@/components/Container";
import { siteConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Talk to Steptech Innovation LLC about workflow automation, custom software, and dashboard systems for service businesses.",
  path: "/contact",
});

const sanitizePhone = (phone: string): string => phone.replace(/[^+\d]/g, "");

export default function ContactPage() {
  return (
    <main className="section-space">
      <Container>
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_1.3fr]">
          <section className="glass-card h-fit p-7 md:p-8">
            <p className="eyebrow">Contact Steptech</p>
            <h1 className="mt-5 text-4xl font-semibold text-white">Need a system that actually fits your workflow?</h1>
            <p className="mt-4 text-slate-200">
              Tell us where operations are breaking down and we will recommend the fastest practical fix.
            </p>

            <div className="mt-7 space-y-4 text-sm text-slate-200">
              <p className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-cyan-200" />
                <a href={`tel:${sanitizePhone(siteConfig.phone)}`} className="font-semibold text-white hover:text-cyan-100">
                  Call now: {siteConfig.phone}
                </a>
              </p>
              <p className="flex items-start gap-2">
                <Clock3 className="mt-0.5 h-4 w-4 text-cyan-200" />
                Quick response window: usually within one business day.
              </p>
            </div>

            <p className="mt-7 text-sm text-slate-300">
              Service area: <span className="text-cyan-200">{siteConfig.serviceAreas.join(", ")}, Florida</span>
            </p>
          </section>

          <section>
            <h2 className="mb-5 text-2xl font-semibold text-white">Book a conversation</h2>
            <ContactForm
              inquiryType="contact"
              sourcePage="/contact"
              submitLabel="Send Message"
              successMessage="Message received. We will reach out shortly with next steps."
            />
          </section>
        </div>
      </Container>
    </main>
  );
}
