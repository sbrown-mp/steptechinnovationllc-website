import { google, type calendar_v3 } from "googleapis";

const requiredEnv = (name: string): string => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const getCalendarClient = () => {
  const clientId = requiredEnv("GOOGLE_CLIENT_ID");
  const clientSecret = requiredEnv("GOOGLE_CLIENT_SECRET");
  const refreshToken = requiredEnv("GOOGLE_REFRESH_TOKEN");

  const auth = new google.auth.OAuth2(clientId, clientSecret);
  auth.setCredentials({ refresh_token: refreshToken });

  return google.calendar({
    version: "v3",
    auth,
  });
};

export const getAuthClient = () => {
  const clientId = requiredEnv("GOOGLE_CLIENT_ID");
  const clientSecret = requiredEnv("GOOGLE_CLIENT_SECRET");
  const refreshToken = requiredEnv("GOOGLE_REFRESH_TOKEN");

  const auth = new google.auth.OAuth2(clientId, clientSecret);
  auth.setCredentials({ refresh_token: refreshToken });

  return auth;
};

export const getBusyTimes = async (
  startISO: string,
  endISO: string,
  timeZoneOverride?: string,
): Promise<Array<{ start: string; end: string }>> => {
  const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim() || "primary";
  const timeZone = timeZoneOverride || process.env.BOOKING_TIMEZONE?.trim() || "America/New_York";
  const calendar = getCalendarClient();

  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: startISO,
      timeMax: endISO,
      timeZone,
      items: [{ id: calendarId }],
    },
  });

  const calendars = response.data.calendars ?? {};
  const calendarBusy =
    calendars[calendarId]?.busy ??
    Object.values(calendars)
      .flatMap((entry) => entry?.busy ?? [])
      .filter(Boolean);

  return (calendarBusy ?? [])
    .map((slot) => {
      if (!slot.start || !slot.end) {
        return null;
      }
      return {
        start: slot.start,
        end: slot.end,
      };
    })
    .filter((slot): slot is { start: string; end: string } => Boolean(slot));
};

export interface CreateCalendarEventInput {
  summary: string;
  description: string;
  startISO: string;
  endISO: string;
  attendeeEmail: string;
  timeZone: string;
}

export const createEvent = async (
  input: CreateCalendarEventInput,
): Promise<calendar_v3.Schema$Event> => {
  const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim() || "primary";
  const calendar = getCalendarClient();

  const response = await calendar.events.insert({
    calendarId,
    sendUpdates: "all",
    requestBody: {
      summary: input.summary,
      description: input.description,
      start: {
        dateTime: input.startISO,
        timeZone: input.timeZone,
      },
      end: {
        dateTime: input.endISO,
        timeZone: input.timeZone,
      },
      attendees: [{ email: input.attendeeEmail }],
    },
  });

  return response.data;
};

export interface UpdateCalendarEventDescriptionInput {
  eventId: string;
  description: string;
}

export const updateEventDescription = async (input: UpdateCalendarEventDescriptionInput): Promise<void> => {
  const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim() || "primary";
  const calendar = getCalendarClient();

  await calendar.events.patch({
    calendarId,
    eventId: input.eventId,
    sendUpdates: "all",
    requestBody: {
      description: input.description,
    },
  });
};
