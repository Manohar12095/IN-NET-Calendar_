# IN NET Calendar

AI-connected personal planning platform. **powered by IN NET CREATIONS**.

This repo currently implements **Phase 1 — Foundation** from `in-net-calendar-mega-prompt.md`.

## Stack

Next.js 15 (App Router, TypeScript strict), Tailwind CSS, shadcn/ui, Supabase Auth + Postgres.

The app lives in this folder (`innet-calendar`).

## What Phase 1 includes

- Human signup / login / logout / Google OAuth / forgot-reset password / email verification
- Agent login **UI shell** (`/login?tab=agent`, `/login/agent/create`, `/login/agent/access-link`) — no real agent auth yet
- First-login profile (name + timezone)
- App shell, theme toggle persisted to `settings`
- Empty dashboard (greeting, live clock, counters at zero, empty lists, mini calendar)
- Full Part 5 SQL migration with RLS

## Setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and paste:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. In the Supabase SQL editor, run [`supabase/migrations/20240917120000_init.sql`](supabase/migrations/20240917120000_init.sql).
4. Auth settings:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`
   - Enable Email provider (confirmations on)
   - Optional: enable Google OAuth and add the same callback URL
5. Run the app:

**Easy way (Windows):** double-click [`start-innet-calendar.bat`](../start-innet-calendar.bat) in the parent folder.

**Manual:**

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Manual checks for Phase 1

- Sign up, open the verify email link, land on onboarding, then dashboard
- Refresh the dashboard and stay signed in
- Sign out and sign back in
- Forgot password → reset password
- Switch Human / Agent tabs; agent create and access-link routes load and do nothing real
- Theme toggle updates immediately and still applies after refresh (once Supabase is connected)

## Credentials still needed from Manohar

- Supabase URL + anon key (required for auth to work)
- Google OAuth client ID/secret in the Supabase dashboard (optional)
- Later phases: Anthropic, Resend, Upstash, VAPID, Sentry

## Deferred

Phases 2–10: tasks, calendar/events, recurrence, reminders, search, AI chat, public API, MCP, PWA/analytics/robot mascot.
