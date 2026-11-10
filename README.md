# Sarah & Samson wedding invitation

The site creates unique guest access passes through Vercel API functions backed by Neon Postgres. Hosts validate passes at `/validate`; the first successful check-in consumes the code, and replays are rejected.

## Set up the backend

1. Deploy this project to Vercel.
2. Create a Neon Postgres database and connect it to the Vercel project. Set `DATABASE_URL` in the Vercel environment variables (the API also accepts `POSTGRES_URL`).
3. Generate a long random check-in key, for example with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`, and set it as `CHECKIN_ADMIN_TOKEN` in Vercel. Do not use a `VITE_` variable or commit this value.
4. Redeploy after setting environment variables.

The API creates the `guest_passes` table automatically the first time a pass is generated or checked in. No Supabase project or email service is needed.

## Local development

The local Vite server runs the same API handlers as Vercel, so no Vercel login is required for local testing.

```sh
npm install
npm run dev
```

Set `DATABASE_URL` (or `POSTGRES_URL`) and `CHECKIN_ADMIN_TOKEN` in Vercel's project environment settings for deployment. For local development, add those same variables to `.env.local` without deleting any existing lines. The old Supabase URL and publishable key are not a database connection and are no longer used. Keep `.env.local` private and untracked.

## Attendee and host flow

- Attendees enter their name, email, and phone to receive a personalized card with a random access code.
- The code is stored in the database; it cannot be validated by merely copying or inventing a code.
- A host opens `/validate`, enters the check-in key and guest code, and the server atomically marks the pass as used. Repeated scans are rejected.

Pass codes prevent an issued pass from being copied and accepted twice. Since this flow intentionally lets anyone submit details and receive a pass, it does not verify that a person's identity was invited; preventing that requires an invite list or host approval before issuing codes.

## Checks

```sh
npm run lint
npm run build
```
