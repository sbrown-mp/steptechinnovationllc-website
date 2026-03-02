import { parseISO } from "date-fns";
import { NextResponse } from "next/server";
import { z } from "zod";
import { BOOKING_BUFFER_MINUTES, hasBusyConflict, isBookingWindowValid } from "@/lib/booking";
import { createEvent, getBusyTimes } from "@/lib/googleCalendar";

export const runtime = "nodejs";
const DEFAULT_BOOKING_TIMEZONE = process.env.BOOKING_TIMEZONE?.trim() || "America/New_York";

const isValidTimeZone = (timeZone: string): boolean => {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
};

const bookingCreateSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email: z.string().trim().email("A valid email is required."),
  phone: z.string().trim().min(1, "Phone is required."),
  business_name: z.string().trim().optional().default(""),
  industry: z.string().trim().optional().default(""),
  service_type: z.string().trim().min(1, "Service type is required."),
  notes: z.string().trim().optional().default(""),
  start: z.string().trim().min(1, "Start time is required."),
  end: z.string().trim().min(1, "End time is required."),
  timezone: z.string().trim().optional().default(""),
});

const formatEventDescription = (payload: z.infer<typeof bookingCreateSchema>) => {
  return [
    "Steptech Free System Audit Booking",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
    `Business Name: ${payload.business_name || "N/A"}`,
    `Industry: ${payload.industry || "N/A"}`,
    `Service Type: ${payload.service_type}`,
    `Notes: ${payload.notes || "N/A"}`,
    `Submitted Timezone: ${payload.timezone || "N/A"}`,
    `Booking Start: ${payload.start}`,
    `Booking End: ${payload.end}`,
  ].join("\n");
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = bookingCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Please review the booking form fields and try again.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const payload = parsed.data;
    const submittedTimeZone = payload.timezone || DEFAULT_BOOKING_TIMEZONE;
    if (!isValidTimeZone(submittedTimeZone)) {
      return NextResponse.json(
        {
          message: "Invalid timezone.",
        },
        { status: 400 },
      );
    }

    const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim() || "primary";

    const startDate = parseISO(payload.start);
    const endDate = parseISO(payload.end);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return NextResponse.json(
        {
          message: "Invalid booking time range.",
        },
        { status: 400 },
      );
    }

    const isWindowValid = isBookingWindowValid({
      startIso: payload.start,
      endIso: payload.end,
      timeZone: submittedTimeZone,
    });

    if (!isWindowValid) {
      return NextResponse.json(
        {
          message: "Selected time is outside booking rules. Please choose another slot.",
        },
        { status: 400 },
      );
    }

    const bufferMs = BOOKING_BUFFER_MINUTES * 60_000;
    const busyTimes = await getBusyTimes(
      new Date(startDate.getTime() - bufferMs).toISOString(),
      new Date(endDate.getTime() + bufferMs).toISOString(),
      submittedTimeZone,
    );

    const hasConflict = hasBusyConflict({
      startIso: payload.start,
      endIso: payload.end,
      busyIntervals: busyTimes,
      bufferMinutes: BOOKING_BUFFER_MINUTES,
    });

    if (hasConflict) {
      return NextResponse.json(
        {
          message: "That time is no longer available. Please select another slot.",
        },
        { status: 409 },
      );
    }

    const eventTitle = `Free System Audit — ${payload.business_name || payload.name}`;
    const eventDescription = formatEventDescription({
      ...payload,
      timezone: submittedTimeZone,
    });

    const createdEvent = await createEvent({
      summary: eventTitle,
      description: eventDescription,
      startISO: payload.start,
      endISO: payload.end,
      attendeeEmail: payload.email,
      timeZone: submittedTimeZone,
    });

    const googleEventId = createdEvent.id?.trim();
    if (!googleEventId) {
      console.error("[booking-google-create-error] Missing event ID from Google Calendar.", createdEvent);
      return NextResponse.json(
        {
          message: "Unable to confirm booking at this time. Please try again.",
        },
        { status: 502 },
      );
    }

    const xanoEndpoint = process.env.XANO_BOOKING_ENDPOINT?.trim();
    if (!xanoEndpoint) {
      console.error("[booking-xano-config-error] Missing XANO_BOOKING_ENDPOINT.");
    } else {
      const xanoPayload = {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        business_name: payload.business_name,
        industry: payload.industry,
        service_type: payload.service_type,
        notes: payload.notes,
        booking_start: payload.start,
        booking_end: payload.end,
        timezone: submittedTimeZone,
        google_event_id: googleEventId,
        calendar_id: calendarId,
        meeting_type: "Free System Audit",
        status: "confirmed",
        created_date: new Date().toISOString(),
      };

      try {
        const xanoResponse = await fetch(xanoEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(xanoPayload),
          cache: "no-store",
        });

        if (!xanoResponse.ok) {
          const xanoErrorText = await xanoResponse.text();
          console.error("[booking-xano-error]", {
            status: xanoResponse.status,
            body: xanoErrorText,
          });
        }
      } catch (xanoError) {
        console.error("[booking-xano-network-error]", xanoError);
      }
    }

    return NextResponse.json({
      ok: true,
      start: payload.start,
      end: payload.end,
      google_event_id: googleEventId,
    });
  } catch (error) {
    console.error("[booking-create-error]", error);
    const message =
      process.env.NODE_ENV !== "production" && error instanceof Error
        ? error.message
        : "Unable to complete booking right now. Please try again.";

    return NextResponse.json(
      {
        message,
      },
      { status: 500 },
    );
  }
}
