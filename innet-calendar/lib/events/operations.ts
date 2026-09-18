import type { SupabaseClient } from "@supabase/supabase-js";
import { eventFormToUtc } from "@/lib/events/datetime";
import { eventFormSchema, eventIdSchema } from "@/lib/schemas/event";
import type { Database, EventRow } from "@/types/database";

type DbClient = SupabaseClient<Database>;
type Result<T> = { ok: true; data: T } | { ok: false; error: string };

async function requireUserId(supabase: DbClient): Promise<Result<string>> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "You must be signed in." };
  }
  return { ok: true, data: user.id };
}

export async function listEvents(supabase: DbClient): Promise<Result<EventRow[]>> {
  const user = await requireUserId(supabase);
  if (!user.ok) {
    return user;
  }
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", user.data)
    .is("deleted_at", null)
    .order("start_at", { ascending: true });
  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, data: data ?? [] };
}

export async function createEvent(
  supabase: DbClient,
  input: unknown,
  timezone: string,
  categoryColor: string | null,
): Promise<Result<EventRow>> {
  const user = await requireUserId(supabase);
  if (!user.ok) {
    return user;
  }
  const parsed = eventFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid event" };
  }
  const times = eventFormToUtc(parsed.data, timezone);
  const { data, error } = await supabase
    .from("events")
    .insert({
      user_id: user.data,
      title: parsed.data.title,
      description: parsed.data.description?.trim() ? parsed.data.description : null,
      location: parsed.data.location?.trim() ? parsed.data.location : null,
      start_at: times.start_at,
      end_at: times.end_at,
      all_day: times.all_day,
      category_id: parsed.data.categoryId ? parsed.data.categoryId : null,
      color: categoryColor,
      timezone,
    })
    .select("*")
    .single();
  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not create event" };
  }
  return { ok: true, data };
}

export async function updateEvent(
  supabase: DbClient,
  id: string,
  input: unknown,
  timezone: string,
  categoryColor: string | null,
): Promise<Result<EventRow>> {
  const user = await requireUserId(supabase);
  if (!user.ok) {
    return user;
  }
  const idParsed = eventIdSchema.safeParse({ id });
  if (!idParsed.success) {
    return { ok: false, error: "Invalid event id" };
  }
  const parsed = eventFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid event" };
  }
  const times = eventFormToUtc(parsed.data, timezone);
  const { data, error } = await supabase
    .from("events")
    .update({
      title: parsed.data.title,
      description: parsed.data.description?.trim() ? parsed.data.description : null,
      location: parsed.data.location?.trim() ? parsed.data.location : null,
      start_at: times.start_at,
      end_at: times.end_at,
      all_day: times.all_day,
      category_id: parsed.data.categoryId ? parsed.data.categoryId : null,
      color: categoryColor,
    })
    .eq("id", idParsed.data.id)
    .eq("user_id", user.data)
    .is("deleted_at", null)
    .select("*")
    .single();
  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not update event" };
  }
  return { ok: true, data };
}

export async function softDeleteEvent(supabase: DbClient, id: string): Promise<Result<EventRow>> {
  const user = await requireUserId(supabase);
  if (!user.ok) {
    return user;
  }
  const idParsed = eventIdSchema.safeParse({ id });
  if (!idParsed.success) {
    return { ok: false, error: "Invalid event id" };
  }
  const { data, error } = await supabase
    .from("events")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", idParsed.data.id)
    .eq("user_id", user.data)
    .is("deleted_at", null)
    .select("*")
    .single();
  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not delete event" };
  }
  return { ok: true, data };
}
