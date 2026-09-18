# IN NET Calendar — Complete Mega Build Prompt

**Paste this entire document into Cursor Composer or Claude Code as the first message in a fresh repository.** It speaks directly to the coding assistant. Do not ask it to build everything in one pass — work phase by phase (Part 6), confirming each phase's "Definition of done" actually runs before starting the next. This single document replaces needing to re-explain the project in every session; paste it once, then reference "Phase N" in follow-up messages.

---

# PART 0 — Identity, Vision, Brand

You are building **IN NET Calendar**, an AI-connected personal planning platform.

- **Creator:** Manohar
- **Brand line:** powered by IN NET CREATIONS
- **Contact:** innetcreations@gmail.com

**One-sentence pitch:** A customizable, AI-connected personal planning platform where users manage calendars, events, tasks, deadlines, priorities, urgency, and reminders, while authorized AI assistants — the user's own chatbot and, if they choose, other external agents — can securely read, create, update, complete, and manage that planning data through a controlled, permissioned API.

**The idea that must shape every technical decision:** most apps treat their database as a private implementation detail. This app treats it as a **shared planning layer** — a human uses it through the UI, and AI agents use it through the exact same underlying operations via API keys or an agent login. Nothing about the data model, the permission system, or the endpoint design should assume "only the frontend will ever call this."

**Differentiator, stated plainly:**
- Traditional calendar: Human → Calendar.
- Traditional AI assistant: Human → AI.
- This product: Human ↔ AI ↔ Shared Planning System.

---

## 0.1 Brand Assets — Spline 3D Scenes

Load via the `<spline-viewer>` web component, not a raw `<iframe>`, so loading, error states, and `prefers-reduced-motion` can be controlled in code:

```html
<script type="module" src="https://cdn.spline.design/@splinetool/viewer@2.0.53/build/spline-viewer.js"></script>
```

**Login screen background:**
- `<spline-viewer url="https://prod.spline.design/vW6HMk6aCDcbffeC/scene.splinecode"></spline-viewer>`
- Iframe fallback reference only: `https://my.spline.design/creditdebitcard3ddesignwithanimationforweb-FtcmJYjNCzslgGJ3nnqBGzjR/`
- Note: this scene is a credit/debit-card 3D animation. It's what was supplied — use it, but call this out once it's rendered, since a payment-card scene is an unusual backdrop for a calendar login and may want swapping later.

**Dashboard greeting robot:**
- `<spline-viewer url="https://prod.spline.design/UBdbp2TcxT13JhTe/scene.splinecode"></spline-viewer>`
- Iframe fallback reference only: `https://my.spline.design/genkubgreetingrobot-EZJjUufw78poGQbf3NquKiUT/`

**Rule for both, no exceptions:** lazy-load after first paint, feature-detect `prefers-reduced-motion` and small/mobile viewports and skip entirely in those cases, and never let a failed or slow Spline load block or visually break the login form or dashboard content underneath it.

---

# PART 1 — Tech Stack

Use exactly this stack. If something below is deprecated by the time you're building, say so before substituting — don't silently swap it.

| Layer | Choice | Why it was picked |
|---|---|---|
| Framework | **Next.js 15**, App Router, TypeScript strict | UI and the `/api/v1/` backend live in one project, sharing types |
| Styling | **Tailwind CSS** + **shadcn/ui** | Radix-based, copy-in components, fully editable — not a black-box UI kit |
| Icons | **lucide-react** | Matches shadcn defaults |
| Animation | **Framer Motion** | Page transitions, list reordering, bubble pop-ins |
| 3D | **@splinetool/react-spline** (or the web component per 0.1) | The two provided brand scenes |
| Charts | **Recharts** | Analytics module |
| Server state | **TanStack Query** | Caching, optimistic updates, background refetch |
| Client UI state | **Zustand** | Open modals, active calendar view, omnibox state |
| Forms | **React Hook Form** + **Zod** | One Zod schema per entity, imported by both the form and the API route — never define the shape twice |
| Dates | **date-fns** + **date-fns-tz** | Store UTC, render local, immutable date math |
| Recurrence | **rrule** (RFC 5545) | Never hand-roll recurring date logic — this is where home-grown implementations break |
| Local NLP parsing | **chrono-node** | Parses "tomorrow 7pm", "next Friday" without an LLM call |
| Calendar export | **ics** | `.ics` generation for export and the subscribe feed |
| DB / Auth / Storage / Realtime | **Supabase** (Postgres + Row Level Security + Edge Functions + pg_cron) | RLS enforces per-user isolation at the database layer, not just in app code |
| Scheduled jobs | **Supabase pg_cron** → **Edge Functions** | Reminder dispatch, nightly carry-forward |
| Push notifications | **web-push** (VAPID) + **Serwist** service worker | Reminders that reach the user without the tab open |
| Email | **Resend** + **React Email** | Reminder fallback, digest emails |
| AI | **Anthropic Claude API** via **Vercel AI SDK** | Best tool-use reliability; Haiku-class for cheap parsing, Sonnet-class for the conversational planner |
| MCP server | **@modelcontextprotocol/sdk** | Lets Claude or any MCP-compatible agent connect directly, not just via raw REST |
| Rate limiting | **@upstash/ratelimit** + Upstash Redis | Per-key and per-user throttling |
| API key hashing | **argon2** | Keys are shown once, never stored in plaintext |
| Testing | **Vitest** (unit) + **Playwright** (E2E) | Urgency calculation and recurrence expansion are mandatory unit-test targets |
| Error tracking | **Sentry** | |
| Hosting | **Vercel** (app) / **Supabase** (data) / **Upstash** (Redis) / **Resend** (email) | All have workable free tiers for solo development |

---

# PART 2 — Login Model: Human vs. Agent

The login screen has **two tabs**, laid over the Spline background: **Human Login** and **Agent Login**. Never merge them into one form.

**Human Login** — email/password or Google OAuth via Supabase Auth, landing on the dashboard. This is the account that owns data (`auth.uid()`).

**Agent Login** — lets a bot, chatbot, or automation authenticate as an agent rather than as the human. Two entry methods:

1. **Self-registered agent.** The agent creates its own identity (a name + description, stored in `agent_accounts`) independent of any human at signup time. It authenticates successfully but starts with **zero linked user and zero permissions** — every data call is refused until a human finds it in Settings → Agent Access and explicitly links + grants it permissions. Use case: a general-purpose bot that expects many different users to authorize it later.
2. **Access-link agent.** A human generates a scoped, expiring **agent access link** from Settings (a token meant to be pasted into an agent's config, not typed by a human into a browser). The agent redeems it via the Agent Login screen's "I have an access link" option, which immediately mints credentials bound to that human with exactly the permissions chosen at link creation. Use case: "give my own chatbot access to my calendar" — the common path.

Both paths produce a row that behaves like an API key (Part 5's `api_keys` table) — agent login is a friendlier front door onto the same permission system used by the public API, never a separate security model.

---

# PART 3 — Non-Negotiable Architectural Rules

Apply these to every feature without being reminded:

1. **Every table has a `user_id` column and an RLS policy of `auth.uid() = user_id`.** The database enforces isolation, not just application code.
2. **All timestamps stored in UTC.** Convert to the user's stored timezone only at render time.
3. **Recurring events/tasks stored as an RRULE string**, expanded on read within the visible date range only — never pre-materialized.
4. **Nothing hard-deletes.** `tasks`, `events`, `reminders` use `deleted_at`. Build a 30-day trash with restore.
5. **Every AI- or API-originated write is recorded in `audit_log`** (actor, before, after) before the write is considered complete.
6. **Any AI `update`/`delete` action requires a preview + explicit confirmation**, unless the user has toggled auto-apply for that permission. Even confirmed AI creates should be undoable.
7. **The public API and the AI chat call the exact same operation layer** (`lib/planning-operations.ts`). No duplicated "AI version" vs. "API version" of the same logic.
8. **Local parsing before any LLM call.** chrono-node/regex handle dates and simple syntax; the LLM is reserved for genuinely ambiguous language and generating the conversational reply.
9. **Zod validates every API boundary**, including requests from your own frontend.
10. **3D never blocks interaction.** Skip on `prefers-reduced-motion` and mobile; the app must be fully usable if Spline fails to load at all.
11. **An unlinked agent identity gets zero data access, enforced in middleware — not just hidden in the UI.** A self-registered agent with no linked user must get a 403 on every data endpoint, exactly like a revoked API key would.

---

# PART 4 — Complete Feature List

Every feature, tagged by version, so you always know what's in scope for the current phase and what's deliberately deferred.

### Authentication & Accounts
V1: email/password + Google OAuth signup/login/logout, email verification, forgot/reset password, profile (name/avatar/timezone), change password.
V2: session management (active devices, sign out all), delete account + full wipe.
V4: two-factor auth (TOTP).

### Agent Identity (Part 2)
V1: login screen shell with both tabs routed.
V4: self-registered agents, access-link generation/redemption, Settings → Agent Access linking UI.

### Data Isolation & Security
V1: `user_id` + RLS on every table, server-side auth check on every route.
V2: soft delete + 30-day trash, audit log of all writes.
V4: per-key/per-user rate limiting, API request log in Settings.

### Dashboard
V1: greeting + live clock, today's tasks sorted by urgency, upcoming events (7 days), counters (remaining/completed/overdue/high-urgency), mini calendar.
V2: today's schedule timeline, carried-forward section.
V3: drag-to-reorder widgets, toggle visible widgets, AI daily plan card, **greeting robot mascot with speech-bubble quick actions**.
V4: productivity snapshot card, streak indicator.

### Calendar
V1: month/week/day/agenda views, history navigation, jump-to-today, click-to-create.
V2: category color coding + filter, drag-to-move, resize-to-change-duration, conflict detection.
V3: free-slot finder.
V4: year/heatmap overview, multiple calendars with show/hide.

### Events
V1: title/description/date/start/end, all-day toggle, location.
V2: category + color, notes, recurrence, edit-occurrence-vs-series, per-event reminders.
V4: attachments, per-event timezone, link event to related tasks.

### Tasks
V1: title/description/due date+time, status, mark-complete, four-level urgency, manual override, created/completed dates.
V2: category/tags, notes, recurrence.
V3: subtasks/checklist, estimated effort minutes, lifecycle history (created→scheduled→overdue→carried→completed).
V4: dependencies, attachments.

### Urgency Engine
V1: static four-level urgency (Emergency/High/Medium/Low), user-chosen.
V2: dynamic escalation from time-remaining + importance flag + overdue + postponement count; user override sticks permanently.
V3: "why is this Emergency?" explanation tooltip.
V4: configurable escalation thresholds.

### Carry-Forward
V2: incomplete tasks roll to next day automatically, re-sorted by urgency, visible "carried 3×" marker.
V3: end-of-day review screen (complete/reschedule/drop), bulk "move all overdue to tomorrow."

### Reminders & Notifications
V1: default preset (1 day before + on the day), web push, email fallback.
V2: custom offsets, multiple per item, in-app notification center, snooze options.
V3: quiet hours, context-aware wording, daily digest.
V5: mobile push via FCM.

### Recurrence
V2: daily/weekly/monthly/yearly/custom, end conditions, timezone/DST-safe expansion.
V3: per-occurrence exceptions.

### AI Chat Assistant
V3: in-app chat, natural-language read/create/update/complete/delete, preview+confirm on writes, undo, persisted history, AI daily planner with stated reasoning.
V4: context awareness linking tasks to related events.
V5: voice input, attachment-as-context.

### Local NLP / Quick-Add
V2: `Cmd/Ctrl+K` omnibox, chrono-node parsing, inline syntax (`!emergency`, `#category`, `@5pm`), live preview before create.
V3: fallback to LLM only when local parsing fails.

### Public API
V4: `/api/v1/` REST endpoints, API key generation/naming/revocation, per-key permission toggles, rate limiting, idempotency keys, request log, OpenAPI docs.
V5: outbound webhooks (`task.overdue`, `reminder.due`, `task.created`).

### MCP Server
V4: remote MCP server wrapping the same operations, one-click-connectable from Claude/agent frameworks.

### Search & Organization
V2: global search grouped by type, filters (date/category/status/urgency), smart lists (Overdue/Today/This Week/No Deadline/Completed).
V3: saved custom filters, full-text search on notes.

### History & Analytics
V1: browse any past month.
V2: completed task archive.
V4: weekly summary, completion trend chart, most productive day/time, category breakdown.

### Customization
V1: light/dark/system theme, week-start day, 12/24h clock, default view, timezone, reduced-motion mode.
V2: accent color, category colors.
V3: urgency colors, dashboard widget layout, density setting.

### Interop & Data Ownership
V2: export all data as JSON.
V3: `.ics` export, read-only subscribe URL, `.ics` import, AI timetable import (image/PDF → recurring events).
V5: two-way Google Calendar sync.

### Platform & UX
V1: fully responsive, loading skeletons, error boundaries.
V2: PWA (installable, offline reads), optimistic UI, command palette, keyboard shortcuts, full keyboard nav + screen reader labels, demo mode.
V3: onboarding tour.
V4: offline write queue that syncs on reconnect.

---

# PART 5 — Database Schema

Generate as a Supabase migration under `supabase/migrations/`. UUID primary keys via `gen_random_uuid()`, `timestamptz` everywhere, `updated_at` triggers on `tasks` and `events`.

```sql
profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  avatar_url text,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now()
)

settings (
  user_id uuid primary key references profiles(id) on delete cascade,
  theme text not null default 'system',
  week_start text not null default 'monday',
  time_format text not null default '24h',
  default_view text not null default 'month',
  accent_color text not null default '#6366f1',
  quiet_hours_start time,
  quiet_hours_end time,
  dashboard_widgets jsonb not null default '["today_tasks","upcoming","calendar_mini"]',
  ai_auto_apply jsonb not null default '{}',
  reduced_motion boolean not null default false
)

categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  color text not null,
  icon text,
  created_at timestamptz not null default now()
)

events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  start_at timestamptz not null,
  end_at timestamptz,
  all_day boolean not null default false,
  location text,
  category_id uuid references categories(id) on delete set null,
  color text,
  notes text,
  rrule text,
  rrule_exceptions timestamptz[],
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
)

tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  due_at timestamptz,
  due_time_set boolean not null default false,
  status text not null default 'todo',
  urgency text not null default 'medium',
  urgency_is_manual boolean not null default false,
  importance boolean not null default false,
  category_id uuid references categories(id) on delete set null,
  estimated_minutes int,
  parent_task_id uuid references tasks(id) on delete cascade,
  carried_count int not null default 0,
  rrule text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
)

reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  task_id uuid references tasks(id) on delete cascade,
  event_id uuid references events(id) on delete cascade,
  remind_at timestamptz not null,
  offset_minutes int,
  channel text not null default 'push',
  status text not null default 'pending',
  snoozed_until timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now()
)

attachments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  task_id uuid references tasks(id) on delete cascade,
  event_id uuid references events(id) on delete cascade,
  storage_path text not null,
  filename text not null,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now()
)

agent_accounts (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  description text,
  self_registered boolean not null default true,
  created_at timestamptz not null default now()
)

agent_access_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  token_hash text not null,
  permissions jsonb not null default '{"read":true,"create":false,"update":false,"complete":false,"delete":false}',
  label text,
  expires_at timestamptz not null,
  redeemed_at timestamptz,
  redeemed_by_agent_id uuid references agent_accounts(id) on delete set null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
)

api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  agent_account_id uuid references agent_accounts(id) on delete set null,
  name text not null,
  key_hash text not null,
  key_prefix text not null,
  created_via text not null default 'manual',
  permissions jsonb not null default '{"read":true,"create":false,"update":false,"complete":false,"delete":false}',
  expires_at timestamptz,
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
)

api_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  api_key_id uuid references api_keys(id) on delete set null,
  method text not null,
  path text not null,
  status_code int not null,
  ip text,
  created_at timestamptz not null default now()
)

audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  actor text not null,
  api_key_id uuid references api_keys(id) on delete set null,
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  before jsonb,
  after jsonb,
  created_at timestamptz not null default now()
)

notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  body text,
  type text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
)

ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text,
  created_at timestamptz not null default now()
)

ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references ai_conversations(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role text not null,
  content text,
  tool_calls jsonb,
  created_at timestamptz not null default now()
)
```

**Migration requirements:**
- RLS on every table, `auth.uid() = user_id` policy for select/insert/update/delete. `agent_accounts` has no `user_id` — restrict to service-role access only. `api_keys` rows with a null `user_id` (unlinked self-registered agent) must fail every permission check by default (Part 3, rule 11).
- Indexes: `tasks(user_id, due_at)`, `tasks(user_id, status)`, `events(user_id, start_at)`, `reminders(remind_at, status)`, `audit_log(user_id, created_at)`.
- Shared `updated_at` trigger function for `tasks` and `events`.

---

# PART 6 — Phased Build Plan

Work through these one at a time, in separate sessions. Don't move to the next phase until the current one's "Definition of done" is genuinely true, not just "looks right in the UI."

### Phase 1 — Foundation
Scaffold Next.js 15 (App Router, TS strict). Install Tailwind + shadcn/ui. Connect Supabase, set up `.env.local` + `.env.example`, run the full Part 5 migration (including `agent_accounts`/`agent_access_links`, even though they're inert until Phase 8). Build the login screen with the Part 0.1 Spline background and two tabs: Human Login (real, full Supabase Auth flow: signup, login, logout, forgot/reset password, email verification) and Agent Login (routed UI shell only — "Create Agent Account" / "I have an access link" — real logic comes in Phase 8). Build first-login profile capture (name, timezone). Build the app shell: sidebar, top bar, responsive layout, theme toggle wired to `settings`. Build loading skeletons and error boundaries as shared components now.

**Done when:** a human can sign up, verify, log in, see an empty dashboard, log out, and the session survives a refresh. Agent Login tab exists and routes correctly without doing anything real yet.

### Phase 2 — Tasks Core
Full `tasks` CRUD: create, edit, list, complete, soft-delete, restore. Four-level urgency selector with distinct colors. Today view: tasks due today sorted by urgency, counters for remaining/completed/overdue. TanStack Query for all fetching with optimistic updates on complete/edit. Zod schema in `lib/schemas/task.ts` shared by the form.

**Done when:** the full task lifecycle works with optimistic UI, and a refresh shows the real persisted state.

### Phase 3 — Calendar & Events
Full `events` CRUD. Month/week/day/agenda views reading the same data source. History navigation, jump-to-today, click-to-create. Category assignment with color coding and filter.

**Done when:** all four views render real events and stay in sync with each other immediately after any create/edit.

### Phase 4 — Recurrence & Dynamic Urgency
`rrule` integration for tasks and events: daily/weekly/monthly/yearly/custom, end conditions, per-occurrence exceptions, expanded only within the visible range. Dynamic urgency as a pure function with full Vitest coverage — time-remaining, importance, overdue, postponement-count in; urgency level out; never overrides `urgency_is_manual`. Nightly carry-forward as a Supabase Edge Function via pg_cron, timezone-aware per user.

**Done when:** "every Monday 7pm" survives a DST boundary correctly, and an incomplete task correctly appears carried forward next morning with an incremented counter.

### Phase 5 — Reminders & Notifications
Reminder UI: multiple per item, "1 day before + on the day" default, custom offsets, snooze. Edge Function on a 1-minute pg_cron dispatching due reminders. Web push via `web-push` + VAPID + Serwist service worker. Email fallback via Resend + React Email. In-app notification center with unread badge.

**Done when:** a reminder set 2 minutes out actually produces a real push notification with the tab closed, and a row lands in `notifications`.

### Phase 6 — Search, Smart Lists, Quick-Add
Global search across tasks/events, grouped results. Smart lists (Overdue/Today/This Week/No Deadline/Completed) as saved queries, not hardcoded filters. `Cmd/Ctrl+K` omnibox using chrono-node + inline syntax (`!emergency`, `#category`, `@5pm`) with a live create-preview.

**Done when:** "math assignment friday 5pm !emergency #college" previews correctly parsed before creation.

### Phase 7 — AI Chat Assistant
Vercel AI SDK + Anthropic provider. Build `lib/planning-operations.ts` exposing `getTasks / createTask / updateTask / completeTask / deleteTask / getEvents / createEvent / updateEvent / deleteEvent / getReminders / createReminder / updateReminder / deleteReminder / getCalendar / search / findFreeSlots / getDailySummary` — every function takes `user_id` and validates identically regardless of caller. Wire as Claude tool calls. Streaming chat UI. `update*`/`delete*` calls render a confirm card unless `ai_auto_apply` is on for that permission. Every AI write logs to `audit_log` with `actor = 'ai_chat'`, and confirmed actions get an undo button that reverses using the logged `before` value. Persist history in `ai_conversations`/`ai_messages`.

**Done when:** "mark my math assignment done" shows a confirm card, executes on confirm, is logged, and can be undone; "what do I have today?" answers from real data.

### Phase 8 — Public API, API Keys & Agent Login
`/api/v1/tasks`, `/api/v1/events`, `/api/v1/reminders`, `/api/v1/calendar` route handlers calling the Phase 7 operation layer — no duplicated logic. API key generation (`crypto.randomBytes(32)`, `innet_sk_...` format, argon2-hashed, shown once). Settings UI for creating/naming/revoking keys with independent read/create/update/complete/delete toggles. Middleware authenticating by key hash, checking permissions, attaching `user_id`, rejecting otherwise. Per-key rate limiting via `@upstash/ratelimit`. Request logging to `api_requests`, surfaced in Settings. Idempotency-Key header support on creates. OpenAPI spec + docs page.

Then make Agent Login real (Part 2): build Settings → Agent Access for generating access links (creates `agent_access_links`, default single-use); build the "I have an access link" redemption flow that validates the token, creates/reuses an `agent_accounts` row, mints an `api_keys` row (`created_via = 'agent_access_link'`) with the link's permissions, marks it redeemed; build the "Create Agent Account" self-registration flow plus the human-side linking UI that grants a found agent account real permissions.

**Done when:** a scoped read-only key can fetch tasks but gets a 403 on delete, visible in the request log within seconds. Generating and redeeming an access link works end to end, immediately usable against `/api/v1/tasks`. An unlinked self-registered agent gets a 403 on every data endpoint.

### Phase 9 — MCP Server
Wrap `lib/planning-operations.ts` as MCP tools via `@modelcontextprotocol/sdk`, deployed as a remote HTTP MCP server, authenticated like the REST API. Clear, model-friendly tool descriptions and schemas.

**Done when:** the MCP server connects from Claude's remote connector settings elsewhere and can list/create a task in this account.

### Phase 10 — Interop, Customization, Analytics, Robot Mascot, Polish
`.ics` export + read-only subscribe URL + import. Timetable import (image/PDF → Claude vision → structured recurring events for confirmation). Full Settings page (theme, week start, time format, timezone, accent color, category colors, widget toggles, quiet hours, AI auto-apply). Analytics view (created/completed/carried-over, completion rate, trend chart, most productive day, category breakdown), computed server-side from real history.

Build the **dashboard greeting robot** (Part 0.1 scene): fixed corner mascot, lazy-loaded, skipped on reduced-motion/mobile. On load and periodically when idle it opens an HTML/CSS speech bubble (not part of the Spline scene) with a short, time-of-day- and state-aware greeting (mention overdue count if any) and 2–4 quick-action chips — "Set a reminder," "Add a task," "What's today?", "Show overdue" — each wired to a real action (open the reminder form, open the omnibox, open AI chat pre-sent with that question). No decorative chip that does nothing. Clicking the robot toggles the bubble.

Full keyboard-nav + screen-reader pass. Sentry setup. Playwright E2E for signup → create task → complete task → AI chat → API key creation.

**Done when:** installable as a PWA, works offline for reads, zero motion on reduced-motion/mobile, passes a basic accessibility audit, and the robot's quick-action chips all perform real actions.

---

# PART 7 — Output Discipline for the Coding Tool

- TypeScript everywhere, explicit types on every function signature, no implicit `any`.
- Every feature ships together with: its Zod schema, its migration (if schema changes), its API route or server action, its UI component, and a one-line note on what to test manually.
- Small, composed components — a calendar cell, a task row, a reminder chip are each their own file, never inlined into a page.
- Never invent a table or column outside Part 5 — extend deliberately and say so out loud when you do.
- Flag ambiguity and propose the tradeoff before writing code instead of silently picking an approach.
- At the end of each phase: state what was built, what was deferred, and what real credential/env var (if any) is needed from Manohar before it will run.

---

*IN NET Calendar — powered by IN NET CREATIONS*
