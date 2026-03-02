import type { Metadata } from "next";
import { BookingScheduler } from "@/components/BookingScheduler";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Book Free System Audit",
  description:
    "Choose a date and time to book your free system audit with Steptech Innovation LLC. Availability is powered by Google Calendar.",
  path: "/book-audit",
});

export default function BookAuditPage() {
  const defaultTimeZone = process.env.BOOKING_TIMEZONE?.trim() || "America/New_York";

  return (
    <main className="section-space">
      <Container>
        <div className="mx-auto max-w-6xl space-y-8">
          <Reveal>
            <section className="glass-card p-8 md:p-10">
              <p className="eyebrow">Custom Booking</p>
              <h1 className="mt-5 text-4xl font-semibold leading-tight text-white md:text-5xl">
                Book your Free System Audit
              </h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-200">
                Pick an open time slot, confirm your details, and your meeting will be instantly reserved on our
                calendar.
              </p>
            </section>
          </Reveal>

          <Reveal delay={0.06}>
            <BookingScheduler defaultTimeZone={defaultTimeZone} />
          </Reveal>
        </div>
      </Container>
    </main>
  );
}
