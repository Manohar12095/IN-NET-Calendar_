-- IN NET Calendar — Part 5 schema
-- UUID PKs, timestamptz, RLS, indexes, updated_at triggers.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  avatar_url text,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now()
);

create table public.settings (
  user_id uuid primary key references public.profiles (id) on delete cascade,
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
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  color text not null,
  icon text,
  created_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  start_at timestamptz not null,
  end_at timestamptz,
  all_day boolean not null default false,
  location text,
  category_id uuid references public.categories (id) on delete set null,
  color text,
  notes text,
  rrule text,
  rrule_exceptions timestamptz[],
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  due_at timestamptz,
  due_time_set boolean not null default false,
  status text not null default 'todo',
  urgency text not null default 'medium',
  urgency_is_manual boolean not null default false,
  importance boolean not null default false,
  category_id uuid references public.categories (id) on delete set null,
  estimated_minutes int,
  parent_task_id uuid references public.tasks (id) on delete cascade,
  carried_count int not null default 0,
  rrule text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  task_id uuid references public.tasks (id) on delete cascade,
  event_id uuid references public.events (id) on delete cascade,
  remind_at timestamptz not null,
  offset_minutes int,
  channel text not null default 'push',
  status text not null default 'pending',
  snoozed_until timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  task_id uuid references public.tasks (id) on delete cascade,
  event_id uuid references public.events (id) on delete cascade,
  storage_path text not null,
  filename text not null,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

create table public.agent_accounts (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  description text,
  self_registered boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.agent_access_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  token_hash text not null,
  permissions jsonb not null default '{"read":true,"create":false,"update":false,"complete":false,"delete":false}',
  label text,
  expires_at timestamptz not null,
  redeemed_at timestamptz,
  redeemed_by_agent_id uuid references public.agent_accounts (id) on delete set null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete cascade,
  agent_account_id uuid references public.agent_accounts (id) on delete set null,
  name text not null,
  key_hash text not null,
  key_prefix text not null,
  created_via text not null default 'manual',
  permissions jsonb not null default '{"read":true,"create":false,"update":false,"complete":false,"delete":false}',
  expires_at timestamptz,
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.api_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  api_key_id uuid references public.api_keys (id) on delete set null,
  method text not null,
  path text not null,
  status_code int not null,
  ip text,
  created_at timestamptz not null default now()
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  actor text not null,
  api_key_id uuid references public.api_keys (id) on delete set null,
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  before jsonb,
  after jsonb,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text,
  type text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text,
  created_at timestamptz not null default now()
);

create table public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null,
  content text,
  tool_calls jsonb,
  created_at timestamptz not null default now()
);

create trigger events_set_updated_at
  before update on public.events
  for each row execute procedure public.set_updated_at();

create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute procedure public.set_updated_at();

create index tasks_user_id_due_at_idx on public.tasks (user_id, due_at);
create index tasks_user_id_status_idx on public.tasks (user_id, status);
create index events_user_id_start_at_idx on public.events (user_id, start_at);
create index reminders_remind_at_status_idx on public.reminders (remind_at, status);
create index audit_log_user_id_created_at_idx on public.audit_log (user_id, created_at);

alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.categories enable row level security;
alter table public.events enable row level security;
alter table public.tasks enable row level security;
alter table public.reminders enable row level security;
alter table public.attachments enable row level security;
alter table public.agent_accounts enable row level security;
alter table public.agent_access_links enable row level security;
alter table public.api_keys enable row level security;
alter table public.api_requests enable row level security;
alter table public.audit_log enable row level security;
alter table public.notifications enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;

create policy "profiles_own" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "settings_own" on public.settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "categories_own" on public.categories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "events_own" on public.events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "tasks_own" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "reminders_own" on public.reminders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "attachments_own" on public.attachments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "agent_access_links_own" on public.agent_access_links
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Unlinked keys (user_id is null) never match auth.uid() = user_id.
create policy "api_keys_own" on public.api_keys
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "api_requests_own" on public.api_requests
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "audit_log_own" on public.audit_log
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "notifications_own" on public.notifications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "ai_conversations_own" on public.ai_conversations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "ai_messages_own" on public.ai_messages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- agent_accounts has no user_id: service-role only (no authenticated policies).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, avatar_url, timezone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name'),
    new.raw_user_meta_data ->> 'avatar_url',
    coalesce(new.raw_user_meta_data ->> 'timezone', 'UTC')
  );
  insert into public.settings (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

revoke all on table public.agent_accounts from anon, authenticated;
grant all on table public.agent_accounts to service_role;
