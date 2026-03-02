"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { format, parseISO, startOfDay } from "date-fns";
import { CalendarCheck2, Loader2 } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

interface SlotRange {
  start: string;
  end: string;
}

interface BookingSchedulerProps {
  defaultTimeZone: string;
}

interface BookingSuccess {
  start: string;
  end: string;
  googleEventId: string;
  participantUrl?: string;
}

const commonTimeZones = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Anchorage",
  "Pacific/Honolulu",
  "UTC",
];

const serviceTypeOptions = [
  "Custom application development",
  "Replace or consolidate existing software",
  "Workflow automation",
  "Hardware-integrated systems",
  "Not sure - need guidance",
];

const industryOptions = [
  "HVAC",
  "Plumbing",
  "Electrical",
  "Home Health Agency",
  "Property Management",
  "Construction",
  "Other Service Business",
];

const slotTemplate = Array.from({ length: 16 }, (_, index) => {
  const totalMinutes = 9 * 60 + index * 30;
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return {
    key: `${`${hour}`.padStart(2, "0")}:${`${minute}`.padStart(2, "0")}`,
  };
});

const getBrowserTimeZone = (fallbackTimeZone: string): string => {
  const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return browserTimeZone?.trim() || fallbackTimeZone;
};

const getSupportedTimeZones = (): string[] => {
  const intlWithSupported = Intl as typeof Intl & {
    supportedValuesOf?: (key: "timeZone") => string[];
  };

  const dynamicTimeZones = typeof intlWithSupported.supportedValuesOf === "function"
    ? intlWithSupported.supportedValuesOf("timeZone")
    : [];

  return Array.from(new Set([...commonTimeZones, ...dynamicTimeZones]));
};

const getTimeKeyFromIso = (iso: string, timeZone: string): string => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  const hour = values.hour ?? "00";
  const minute = values.minute ?? "00";
  return `${hour}:${minute}`;
};

const slotLabel = (key: string): string => {
  const [hourText, minuteText] = key.split(":");
  const hour = Number.parseInt(hourText, 10);
  const minute = Number.parseInt(minuteText, 10);

  const date = new Date(2025, 0, 1, hour, minute, 0, 0);
  return format(date, "h:mm a");
};

const fieldClass =
  "mt-2 w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300/60 focus:outline-none";

export function BookingScheduler({ defaultTimeZone }: BookingSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [today, setToday] = useState<Date>();
  const [selectedTimeZone, setSelectedTimeZone] = useState(defaultTimeZone);

  const [selectedSlotKey, setSelectedSlotKey] = useState<string | null>(null);
  const [slots, setSlots] = useState<SlotRange[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<BookingSuccess | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [notes, setNotes] = useState("");

  const timeZoneOptions = useMemo(() => {
    const browserTimeZone = getBrowserTimeZone(defaultTimeZone);
    return Array.from(new Set([browserTimeZone, ...getSupportedTimeZones()]));
  }, [defaultTimeZone]);

  useEffect(() => {
    const browserTimeZone = getBrowserTimeZone(defaultTimeZone);
    const now = startOfDay(new Date());
    setSelectedTimeZone(browserTimeZone);
    setToday(now);
    setSelectedDate(now);
  }, [defaultTimeZone]);

  const availableSlotByKey = useMemo(() => {
    const map = new Map<string, SlotRange>();
    for (const slot of slots) {
      map.set(getTimeKeyFromIso(slot.start, selectedTimeZone), slot);
    }
    return map;
  }, [selectedTimeZone, slots]);

  const selectedSlot = selectedSlotKey ? availableSlotByKey.get(selectedSlotKey) ?? null : null;

  useEffect(() => {
    if (!selectedDate || !selectedTimeZone) {
      return;
    }

    const controller = new AbortController();
    const dateParam = format(selectedDate, "yyyy-MM-dd");
    const params = new URLSearchParams({
      date: dateParam,
      timezone: selectedTimeZone,
    });

    const load = async () => {
      setIsLoadingSlots(true);
      setAvailabilityError(null);
      setSubmitError(null);
      setSelectedSlotKey(null);

      try {
        const response = await fetch(`/api/booking/availability?${params.toString()}`, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        const payload: { slots?: SlotRange[]; message?: string } = await response.json();

        if (!response.ok) {
          setSlots([]);
          setAvailabilityError(payload.message ?? "Unable to load time slots.");
          return;
        }

        setSlots(payload.slots ?? []);
      } catch (error) {
        if ((error as { name?: string }).name !== "AbortError") {
          setSlots([]);
          setAvailabilityError("Unable to load time slots.");
        }
      } finally {
        setIsLoadingSlots(false);
      }
    };

    void load();

    return () => {
      controller.abort();
    };
  }, [selectedDate, selectedTimeZone]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!selectedDate) {
      setSubmitError("Select a date before confirming your booking.");
      return;
    }

    if (!selectedSlot) {
      setSubmitError("Select an available time slot to continue.");
      return;
    }

    if (!name.trim() || !email.trim() || !phone.trim() || !serviceType.trim()) {
      setSubmitError("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/booking/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          business_name: businessName.trim(),
          industry: industry.trim(),
          service_type: serviceType.trim(),
          notes: notes.trim(),
          start: selectedSlot.start,
          end: selectedSlot.end,
          timezone: selectedTimeZone,
        }),
      });

      const payload: {
        ok?: boolean;
        message?: string;
        start?: string;
        end?: string;
        google_event_id?: string;
        daily_participant_url?: string;
      } = await response.json();

      if (response.status === 409) {
        setSubmitError(payload.message ?? "This slot was just booked. Please choose another.");
        setSelectedSlotKey(null);
        setSelectedDate(new Date(selectedDate.getTime()));
        return;
      }

      if (!response.ok || !payload.ok || !payload.start || !payload.end || !payload.google_event_id) {
        setSubmitError(payload.message ?? "Could not confirm booking right now.");
        return;
      }

      setSuccess({
        start: payload.start,
        end: payload.end,
        googleEventId: payload.google_event_id,
        participantUrl: payload.daily_participant_url,
      });
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      timeZone: selectedTimeZone,
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(parseISO(success.start));

    const formattedStart = new Intl.DateTimeFormat("en-US", {
      timeZone: selectedTimeZone,
      hour: "numeric",
      minute: "2-digit",
    }).format(parseISO(success.start));

    const formattedEnd = new Intl.DateTimeFormat("en-US", {
      timeZone: selectedTimeZone,
      hour: "numeric",
      minute: "2-digit",
    }).format(parseISO(success.end));

    return (
      <section className="glass-card max-w-3xl p-6 md:p-8">
        <div className="flex items-start gap-3">
          <span className="rounded-full bg-emerald-500/20 p-2 text-emerald-200">
            <CalendarCheck2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-200">Booking Confirmed</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Your Free System Audit is scheduled.</h2>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-emerald-300/25 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          <p className="font-semibold text-white">{formattedDate}</p>
          <p className="mt-1">
            {formattedStart} - {formattedEnd} ({selectedTimeZone})
          </p>
          <p className="mt-2 text-emerald-200/90">Confirmation ID: {success.googleEventId}</p>
          {success.participantUrl ? (
            <p className="mt-3">
              Join your video meeting:{" "}
              <a
                href={success.participantUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-emerald-100 underline decoration-emerald-200/70 underline-offset-2"
              >
                {success.participantUrl}
              </a>
            </p>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
          <button
            type="button"
            onClick={() => {
              setSuccess(null);
              setSubmitError(null);
              setSelectedSlotKey(null);
            }}
            className="btn-secondary"
          >
            Book Another Time
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-7 lg:grid-cols-[1fr_1.15fr]">
      <section className="glass-card p-5 md:p-6">
        <p className="eyebrow">Step 1</p>
        <h2 className="mt-4 text-2xl font-semibold text-white">Choose a date</h2>
        <p className="mt-2 text-sm text-slate-300">Available Monday through Friday, 9:00 AM - 5:00 PM.</p>

        <label className="mt-4 block text-sm font-medium text-slate-200">
          Timezone
          <select
            value={selectedTimeZone}
            onChange={(event) => {
              setSelectedTimeZone(event.target.value);
              setSelectedSlotKey(null);
            }}
            className={cn(fieldClass, "pr-10")}
          >
            {timeZoneOptions.map((timeZone) => (
              <option key={timeZone} value={timeZone}>
                {timeZone}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-5 rounded-xl border border-white/10 bg-slate-950/50 p-3">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (!date) {
                return;
              }

              const normalizedDate = startOfDay(date);
              setSelectedDate(normalizedDate);
            }}
            disabled={today ? { before: today } : undefined}
            showOutsideDays={false}
            className="text-sm"
            classNames={{
              month: "space-y-3",
              month_caption: "flex items-center justify-between px-2 text-white",
              caption_label: "text-sm font-semibold",
              nav: "flex items-center gap-2",
              button_previous:
                "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-slate-900/70 text-slate-100 hover:border-cyan-300/40",
              button_next:
                "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-slate-900/70 text-slate-100 hover:border-cyan-300/40",
              weekday: "text-xs font-medium uppercase tracking-wide text-slate-400",
              day: "h-10 w-10 p-0",
              day_button:
                "flex h-10 w-10 items-center justify-center rounded-lg p-0 text-sm text-slate-200 transition hover:bg-slate-800",
              selected: "rounded-xl bg-teal-400 text-slate-950 font-semibold hover:bg-teal-400",
              today: "text-teal-200 ring-1 ring-teal-300/35",
              disabled: "cursor-not-allowed text-slate-600 hover:bg-transparent",
            }}
            modifiersClassNames={{
              selected: "rounded-xl bg-teal-400 text-slate-950 font-semibold",
              today: "text-teal-200 ring-1 ring-teal-300/35",
            }}
          />
        </div>

        <p className="mt-4 text-xs text-slate-400">Slots shown in: {selectedTimeZone}</p>
      </section>

      <section className="glass-card p-6 md:p-8">
        <p className="eyebrow">Step 2</p>
        <h2 className="mt-4 text-2xl font-semibold text-white">Select a time and confirm details</h2>
        {selectedDate ? (
          <p className="mt-2 text-sm text-slate-400">
            {format(selectedDate, "EEEE, MMMM d, yyyy")} · {selectedTimeZone}
          </p>
        ) : null}

        {availabilityError ? (
          <p className="mt-4 rounded-lg bg-rose-500/15 p-3 text-sm text-rose-200">{availabilityError}</p>
        ) : null}

        <div className="mt-5">
          <p className="text-sm font-medium text-slate-200">Time slots</p>
          <p className="mt-1 text-xs text-slate-400">
            We release a limited number of audit slots each day to protect build capacity.
          </p>

          {isLoadingSlots ? (
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2 text-sm text-slate-200">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading availability...
            </div>
          ) : (
            <>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {slotTemplate.map((templateSlot) => {
                  const availableSlot = availableSlotByKey.get(templateSlot.key);
                  const isDisabled = !availableSlot || isSubmitting;
                  const isSelected = selectedSlotKey === templateSlot.key;

                  return (
                    <button
                      key={templateSlot.key}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        if (!availableSlot) {
                          return;
                        }
                        setSelectedSlotKey(templateSlot.key);
                        setSubmitError(null);
                      }}
                      className={cn(
                        "rounded-full border px-3 py-2 text-sm font-medium transition",
                        isSelected && !isDisabled
                          ? "border-teal-300/80 bg-teal-500/25 text-teal-100"
                          : "border-white/15 bg-slate-900/70 text-slate-200",
                        isDisabled
                          ? "cursor-not-allowed border-slate-700 bg-slate-900/35 text-slate-500"
                          : "hover:border-cyan-300/55",
                      )}
                    >
                      {slotLabel(templateSlot.key)}
                    </button>
                  );
                })}
              </div>

              {slots.length === 0 ? (
                <p className="mt-3 text-sm text-slate-400">No open slots for this date and timezone. Try another day.</p>
              ) : null}
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-200">
              Name <span className="text-rose-300">*</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                type="text"
                required
                autoComplete="name"
                className={fieldClass}
              />
            </label>

            <label className="text-sm font-medium text-slate-200">
              Email <span className="text-rose-300">*</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                required
                autoComplete="email"
                className={fieldClass}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-200">
              Phone <span className="text-rose-300">*</span>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                type="tel"
                required
                autoComplete="tel"
                className={fieldClass}
              />
            </label>

            <label className="text-sm font-medium text-slate-200">
              What are you primarily looking to improve? <span className="text-rose-300">*</span>
              <select
                value={serviceType}
                onChange={(event) => setServiceType(event.target.value)}
                required
                className={cn(fieldClass, "pr-10")}
              >
                <option value="">Select one</option>
                {serviceTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-200">
              Business Name (optional)
              <input
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                type="text"
                autoComplete="organization"
                className={fieldClass}
              />
            </label>

            <label className="text-sm font-medium text-slate-200">
              Industry (optional)
              <select value={industry} onChange={(event) => setIndustry(event.target.value)} className={cn(fieldClass, "pr-10")}>
                <option value="">Select your industry</option>
                {industryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-200">
            Notes (optional)
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              className={fieldClass}
              placeholder="Anything we should know before the audit call?"
            />
          </label>

          {submitError ? <p className="rounded-lg bg-rose-500/15 p-3 text-sm text-rose-200">{submitError}</p> : null}

          <button type="submit" disabled={isSubmitting || isLoadingSlots} className="btn-primary w-full disabled:opacity-70">
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Confirming Booking...
              </span>
            ) : (
              "Confirm Booking"
            )}
          </button>
        </form>
      </section>
    </div>
  );
}
