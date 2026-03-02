import { parseISO } from "date-fns";

export interface BusyInterval {
  start: string;
  end: string;
}

export interface SlotRange {
  start: string;
  end: string;
}

export const BOOKING_SLOT_MINUTES = 30;
export const BOOKING_BUFFER_MINUTES = 15;
export const BOOKING_MIN_NOTICE_HOURS = 2;
export const BOOKING_WORK_START_HOUR = 9;
export const BOOKING_WORK_END_HOUR = 17;

const formatterCache = new Map<string, Intl.DateTimeFormat>();

const getFormatter = (timeZone: string): Intl.DateTimeFormat => {
  const cacheKey = timeZone;
  const cached = formatterCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  formatterCache.set(cacheKey, formatter);
  return formatter;
};

const parseYmd = (dateYmd: string): { year: number; month: number; day: number } | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateYmd);
  if (!match) {
    return null;
  }

  const year = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10);
  const day = Number.parseInt(match[3], 10);

  if (year < 2000 || month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  return { year, month, day };
};

const toYmd = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = `${date.getUTCMonth() + 1}`.padStart(2, "0");
  const day = `${date.getUTCDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const addDaysToYmd = (dateYmd: string, days: number): string => {
  const parsed = parseYmd(dateYmd);
  if (!parsed) {
    throw new Error("Invalid date format. Expected YYYY-MM-DD.");
  }

  const utcDate = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day));
  utcDate.setUTCDate(utcDate.getUTCDate() + days);
  return toYmd(utcDate);
};

const getPartsInTimeZone = (
  date: Date,
  timeZone: string,
): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} => {
  const parts = getFormatter(timeZone).formatToParts(date);
  const bag = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: Number.parseInt(bag.year ?? "0", 10),
    month: Number.parseInt(bag.month ?? "0", 10),
    day: Number.parseInt(bag.day ?? "0", 10),
    hour: Number.parseInt(bag.hour ?? "0", 10),
    minute: Number.parseInt(bag.minute ?? "0", 10),
    second: Number.parseInt(bag.second ?? "0", 10),
  };
};

const getTimeZoneOffsetMs = (utcTimestampMs: number, timeZone: string): number => {
  const date = new Date(utcTimestampMs);
  const parts = getPartsInTimeZone(date, timeZone);
  const asUtcTimestamp = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return asUtcTimestamp - utcTimestampMs;
};

export const zonedDateTimeToUtc = (dateYmd: string, hour: number, minute: number, timeZone: string): Date => {
  const parsed = parseYmd(dateYmd);
  if (!parsed) {
    throw new Error("Invalid date format. Expected YYYY-MM-DD.");
  }

  const utcGuess = Date.UTC(parsed.year, parsed.month - 1, parsed.day, hour, minute, 0, 0);
  const firstOffset = getTimeZoneOffsetMs(utcGuess, timeZone);
  let utcTimestamp = utcGuess - firstOffset;

  const secondOffset = getTimeZoneOffsetMs(utcTimestamp, timeZone);
  if (secondOffset !== firstOffset) {
    utcTimestamp = utcGuess - secondOffset;
  }

  return new Date(utcTimestamp);
};

export const getDayRangeUtc = (dateYmd: string, timeZone: string): SlotRange => {
  const start = zonedDateTimeToUtc(dateYmd, 0, 0, timeZone);
  const end = zonedDateTimeToUtc(addDaysToYmd(dateYmd, 1), 0, 0, timeZone);
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
};

const intervalsOverlap = (aStart: number, aEnd: number, bStart: number, bEnd: number): boolean => {
  return aStart < bEnd && bStart < aEnd;
};

const toInterval = (startIso: string, endIso: string): { startMs: number; endMs: number } | null => {
  const start = parseISO(startIso);
  const end = parseISO(endIso);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
    return null;
  }

  return {
    startMs: start.getTime(),
    endMs: end.getTime(),
  };
};

export const generateCandidateSlots = ({
  dateYmd,
  timeZone,
  now = new Date(),
  slotMinutes = BOOKING_SLOT_MINUTES,
  minNoticeHours = BOOKING_MIN_NOTICE_HOURS,
  workStartHour = BOOKING_WORK_START_HOUR,
  workEndHour = BOOKING_WORK_END_HOUR,
}: {
  dateYmd: string;
  timeZone: string;
  now?: Date;
  slotMinutes?: number;
  minNoticeHours?: number;
  workStartHour?: number;
  workEndHour?: number;
}): SlotRange[] => {
  const workdayStart = zonedDateTimeToUtc(dateYmd, workStartHour, 0, timeZone).getTime();
  const workdayEnd = zonedDateTimeToUtc(dateYmd, workEndHour, 0, timeZone).getTime();
  const slotMs = slotMinutes * 60_000;
  const minNoticeCutoff = now.getTime() + minNoticeHours * 60 * 60_000;

  const slots: SlotRange[] = [];
  for (let startMs = workdayStart; startMs + slotMs <= workdayEnd; startMs += slotMs) {
    if (startMs < minNoticeCutoff) {
      continue;
    }

    const endMs = startMs + slotMs;
    slots.push({
      start: new Date(startMs).toISOString(),
      end: new Date(endMs).toISOString(),
    });
  }

  return slots;
};

export const filterSlotsByBusyTimes = ({
  slots,
  busyIntervals,
  bufferMinutes = BOOKING_BUFFER_MINUTES,
}: {
  slots: SlotRange[];
  busyIntervals: BusyInterval[];
  bufferMinutes?: number;
}): SlotRange[] => {
  const normalizedBusy = busyIntervals
    .map((interval) => toInterval(interval.start, interval.end))
    .filter((interval): interval is { startMs: number; endMs: number } => Boolean(interval));

  if (normalizedBusy.length === 0) {
    return slots;
  }

  const bufferMs = bufferMinutes * 60_000;

  return slots.filter((slot) => {
    const slotInterval = toInterval(slot.start, slot.end);
    if (!slotInterval) {
      return false;
    }

    return normalizedBusy.every((busy) => {
      return !intervalsOverlap(
        slotInterval.startMs,
        slotInterval.endMs,
        busy.startMs - bufferMs,
        busy.endMs + bufferMs,
      );
    });
  });
};

export const hasBusyConflict = ({
  startIso,
  endIso,
  busyIntervals,
  bufferMinutes = BOOKING_BUFFER_MINUTES,
}: {
  startIso: string;
  endIso: string;
  busyIntervals: BusyInterval[];
  bufferMinutes?: number;
}): boolean => {
  const slotInterval = toInterval(startIso, endIso);
  if (!slotInterval) {
    return true;
  }

  const bufferMs = bufferMinutes * 60_000;

  return busyIntervals.some((busy) => {
    const busyInterval = toInterval(busy.start, busy.end);
    if (!busyInterval) {
      return false;
    }

    return intervalsOverlap(
      slotInterval.startMs,
      slotInterval.endMs,
      busyInterval.startMs - bufferMs,
      busyInterval.endMs + bufferMs,
    );
  });
};

export const isBookingWindowValid = ({
  startIso,
  endIso,
  timeZone,
  now = new Date(),
  slotMinutes = BOOKING_SLOT_MINUTES,
  minNoticeHours = BOOKING_MIN_NOTICE_HOURS,
  workStartHour = BOOKING_WORK_START_HOUR,
  workEndHour = BOOKING_WORK_END_HOUR,
}: {
  startIso: string;
  endIso: string;
  timeZone: string;
  now?: Date;
  slotMinutes?: number;
  minNoticeHours?: number;
  workStartHour?: number;
  workEndHour?: number;
}): boolean => {
  const start = parseISO(startIso);
  const end = parseISO(endIso);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return false;
  }

  if (end <= start) {
    return false;
  }

  const expectedDurationMs = slotMinutes * 60_000;
  if (end.getTime() - start.getTime() !== expectedDurationMs) {
    return false;
  }

  const minNoticeCutoff = now.getTime() + minNoticeHours * 60 * 60_000;
  if (start.getTime() < minNoticeCutoff) {
    return false;
  }

  const startParts = getPartsInTimeZone(start, timeZone);
  const endParts = getPartsInTimeZone(end, timeZone);

  if (
    startParts.year !== endParts.year ||
    startParts.month !== endParts.month ||
    startParts.day !== endParts.day
  ) {
    return false;
  }

  const startMinuteOfDay = startParts.hour * 60 + startParts.minute;
  const endMinuteOfDay = endParts.hour * 60 + endParts.minute;
  const workdayStartMinute = workStartHour * 60;
  const workdayEndMinute = workEndHour * 60;

  if (startMinuteOfDay % slotMinutes !== 0 || endMinuteOfDay % slotMinutes !== 0) {
    return false;
  }

  if (startMinuteOfDay < workdayStartMinute || endMinuteOfDay > workdayEndMinute) {
    return false;
  }

  return true;
};
