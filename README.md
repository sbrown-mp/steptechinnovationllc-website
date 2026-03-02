This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Booking Environment Variables

Add these to `.env.local` for the custom booking system:

```bash
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GOOGLE_CALENDAR_ID=primary
# Fallback only; booking UI defaults to user's device timezone and allows timezone selection
BOOKING_TIMEZONE=America/New_York
XANO_BOOKING_ENDPOINT=https://your-xano-instance.xano.io/api:your-token/steptech_calendar_bookings

# Daily.co video meetings
DAILY_API_KEY=
DAILY_DOMAIN=your-team.daily.co
# Optional override if needed
DAILY_API_BASE=https://api.daily.co/v1
# Optional: room expiration offset from booking end time
DAILY_ROOM_TTL_SECONDS=86400
# Optional: private recommended
DAILY_ROOM_PRIVACY=private
```

Notes:
- Booking creation now generates Daily host + participant meeting links server-side.
- Only the participant link is returned to the client UI.
- The participant link is added to Google Calendar event details and sent to the attendee via Google invite updates.
- Xano payload includes `daily_room_name`, `daily_participant_url`, and `daily_host_url`.
- If Xano rejects those Daily fields, the booking route retries by storing the participant link in `notes`.

## Booking Manual Verification Checklist

- Submit a booking and confirm a Google Calendar event is created.
- Confirm a Daily room is created and both host/participant links exist server-side.
- Confirm the Google Calendar event description contains `Video meeting: <participant-link>`.
- Confirm attendee invite email includes the participant link from event description.
- Confirm Xano record contains `daily_room_name`, `daily_participant_url`, and `daily_host_url`.
- If Xano schema rejects Daily fields, confirm fallback stores participant link in `notes`.
- Confirm no secrets are committed (`.env.local` stays untracked, `.env.example` contains placeholders only).

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
