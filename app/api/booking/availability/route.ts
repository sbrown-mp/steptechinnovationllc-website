import { NextResponse } from "next/server";
import {
  BOOKING_MIN_NOTICE_HOURS,
  BOOKING_SLOT_MINUTES,
  BOOKING_WORK_END_HOUR,
  BOOKING_WORK_START_HOUR,
  BOOKING_BUFFER_MINUTES,
  filterSlotsByBusyTimes,
  generateCandidateSlots,
  getDayRangeUtc,
} from "@/lib/booking";
import { getBusyTimes } from "@/lib/googleCalendar";

export const runtime = "nodejs";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DEFAULT_BOOKING_TIMEZONE = process.env.BOOKING_TIMEZONE?.trim() || "America/New_York";
const MIN_VISIBLE_SLOT_CAP = 6;
const MAX_VISIBLE_SLOT_CAP = 8;

const seedFromDate = (dateYmd: string): number => {
  return [...dateYmd].reduce((seed, char) => ((seed * 31 + char.charCodeAt(0)) >>> 0), 0);
};

const mulberry32 = (seed: number): (() => number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
};

const seededShuffle = <T>(items: T[], seed: number): T[] => {
  const result = [...items];
  const rand = mulberry32(seed);

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

const isValidTimeZone = (timeZone: string): boolean => {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date")?.trim() ?? "";
    const rawTimeZone = searchParams.get("timezone")?.trim();

    if (!DATE_PATTERN.test(date)) {
      return NextResponse.json(
        {
          message: "Invalid date. Expected YYYY-MM-DD.",
        },
        { status: 400 },
      );
    }

    const bookingTimeZone = rawTimeZone || DEFAULT_BOOKING_TIMEZONE;
    if (!isValidTimeZone(bookingTimeZone)) {
      return NextResponse.json(
        {
          message: "Invalid timezone.",
        },
        { status: 400 },
      );
    }

    const dayRange = getDayRangeUtc(date, bookingTimeZone);
    const busyTimes = await getBusyTimes(dayRange.start, dayRange.end, bookingTimeZone);

    const candidateSlots = generateCandidateSlots({
      dateYmd: date,
      timeZone: bookingTimeZone,
      slotMinutes: BOOKING_SLOT_MINUTES,
      minNoticeHours: BOOKING_MIN_NOTICE_HOURS,
      workStartHour: BOOKING_WORK_START_HOUR,
      workEndHour: BOOKING_WORK_END_HOUR,
    });

    const availableSlots = filterSlotsByBusyTimes({
      slots: candidateSlots,
      busyIntervals: busyTimes,
      bufferMinutes: BOOKING_BUFFER_MINUTES,
    });

    const seed = seedFromDate(date);
    const visibleSlotCap = MIN_VISIBLE_SLOT_CAP + (seed % (MAX_VISIBLE_SLOT_CAP - MIN_VISIBLE_SLOT_CAP + 1));
    const stableSelectedSlots = seededShuffle(availableSlots, seed ^ 0x9e3779b9)
      .slice(0, visibleSlotCap)
      .sort((a, b) => a.start.localeCompare(b.start));

    return NextResponse.json({
      slots: stableSelectedSlots,
    });
  } catch (error) {
    console.error("[booking-availability-error]", error);
    const message =
      process.env.NODE_ENV !== "production" && error instanceof Error
        ? error.message
        : "Could not load availability.";

    return NextResponse.json(
      {
        message,
      },
      { status: 500 },
    );
  }
}
