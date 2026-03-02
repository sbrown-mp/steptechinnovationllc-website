import "server-only";

interface CreateDailyRoomInput {
  bookingStartISO: string;
  bookingEndISO: string;
  bookingId: string;
  clientEmail: string;
}

interface DailyRoomApiResponse {
  name?: string;
  url?: string;
  room?: {
    name?: string;
    url?: string;
  };
}

interface DailyMeetingTokenResponse {
  token?: string;
}

const DEFAULT_DAILY_API_BASE = "https://api.daily.co/v1";
const DEFAULT_ROOM_PRIVACY = "private";
const DEFAULT_ROOM_TTL_SECONDS = 60 * 60 * 24;

const requiredEnv = (name: string): string => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, "");

const getDailyApiBase = (): string => {
  const configured = process.env.DAILY_API_BASE?.trim();
  if (configured) {
    return trimTrailingSlash(configured);
  }
  return DEFAULT_DAILY_API_BASE;
};

const getDailyDomain = (): string => {
  const value = process.env.DAILY_DOMAIN?.trim() ?? "";
  return trimTrailingSlash(value.replace(/^https?:\/\//i, ""));
};

const toPositiveInteger = (value: string | undefined, fallback: number): number => {
  if (!value?.trim()) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const toUnixSeconds = (iso: string): number => {
  const value = new Date(iso).getTime();
  if (Number.isNaN(value)) {
    throw new Error("Invalid ISO timestamp.");
  }
  return Math.floor(value / 1000);
};

const sanitizeSegment = (value: string): string => value.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase();

const buildRoomName = (bookingStartISO: string, bookingId: string): string => {
  const dateSegment = new Date(bookingStartISO).toISOString().slice(0, 10).replace(/-/g, "");
  const bookingSegment = sanitizeSegment(bookingId).slice(0, 18) || "booking";
  const randomSegment = sanitizeSegment(crypto.randomUUID()).slice(0, 8);
  return `audit-${dateSegment}-${bookingSegment}-${randomSegment}`;
};

const appendTokenParam = (url: string, token: string): string => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}t=${encodeURIComponent(token)}`;
};

const extractRoomValues = (response: DailyRoomApiResponse, fallbackRoomName: string): { roomName: string; roomUrl: string } => {
  const roomName = response.name?.trim() || response.room?.name?.trim() || fallbackRoomName;
  const responseUrl = response.url?.trim() || response.room?.url?.trim();
  if (responseUrl) {
    return { roomName, roomUrl: responseUrl };
  }

  const domain = getDailyDomain();
  if (!domain) {
    throw new Error("Daily room URL unavailable. Set DAILY_DOMAIN so links can be generated.");
  }

  return {
    roomName,
    roomUrl: `https://${domain}/${roomName}`,
  };
};

const dailyPost = async <T>(path: string, body: Record<string, unknown>): Promise<T> => {
  const apiKey = requiredEnv("DAILY_API_KEY");
  const response = await fetch(`${getDailyApiBase()}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Daily API request failed with status ${response.status}.`);
  }

  return (await response.json()) as T;
};

export const createDailyRoom = async ({
  bookingStartISO,
  bookingEndISO,
  bookingId,
  clientEmail,
}: CreateDailyRoomInput): Promise<{ roomName: string; hostUrl: string; participantUrl: string }> => {
  const roomPrivacy = process.env.DAILY_ROOM_PRIVACY?.trim() || DEFAULT_ROOM_PRIVACY;
  const ttlSeconds = toPositiveInteger(process.env.DAILY_ROOM_TTL_SECONDS, DEFAULT_ROOM_TTL_SECONDS);
  const roomName = buildRoomName(bookingStartISO, bookingId);
  const bookingStartUnix = toUnixSeconds(bookingStartISO);
  const bookingEndUnix = toUnixSeconds(bookingEndISO);
  const expirationUnix = bookingEndUnix + ttlSeconds;

  const roomResponse = await dailyPost<DailyRoomApiResponse>("/rooms", {
    name: roomName,
    privacy: roomPrivacy,
    properties: {
      exp: expirationUnix,
    },
  });

  const { roomName: resolvedRoomName, roomUrl } = extractRoomValues(roomResponse, roomName);
  const tokenStartUnix = Math.max(Math.floor(Date.now() / 1000) - 60, bookingStartUnix - 15 * 60);

  const hostTokenResponse = await dailyPost<DailyMeetingTokenResponse>("/meeting-tokens", {
    properties: {
      room_name: resolvedRoomName,
      is_owner: true,
      user_name: "Steptech Host",
      nbf: tokenStartUnix,
      exp: expirationUnix,
    },
  });

  const participantTokenResponse = await dailyPost<DailyMeetingTokenResponse>("/meeting-tokens", {
    properties: {
      room_name: resolvedRoomName,
      is_owner: false,
      user_name: clientEmail,
      nbf: tokenStartUnix,
      exp: expirationUnix,
    },
  });

  const hostToken = hostTokenResponse.token?.trim();
  const participantToken = participantTokenResponse.token?.trim();
  if (!hostToken || !participantToken) {
    throw new Error("Daily meeting token generation failed.");
  }

  return {
    roomName: resolvedRoomName,
    hostUrl: appendTokenParam(roomUrl, hostToken),
    participantUrl: appendTokenParam(roomUrl, participantToken),
  };
};
