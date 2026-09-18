"use server";

import { createCategory, deleteCategory, listCategories } from "@/lib/categories/operations";
import { createEvent, listEvents, softDeleteEvent, updateEvent } from "@/lib/events/operations";
import { createClient } from "@/lib/supabase/server";
import type { Category, EventRow } from "@/types/database";

async function userTimezone(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return "UTC";
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .maybeSingle();
  return profile?.timezone || "UTC";
}

async function colorForCategory(categoryId: string | undefined): Promise<string | null> {
  if (!categoryId || categoryId.trim().length === 0) {
    return null;
  }
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("color").eq("id", categoryId).maybeSingle();
  return data?.color ?? null;
}

export async function fetchEventsAction(): Promise<{ data: EventRow[] } | { error: string }> {
  const supabase = await createClient();
  const result = await listEvents(supabase);
  if (!result.ok) {
    return { error: result.error };
  }
  return { data: result.data };
}

export async function createEventAction(input: unknown): Promise<{ data: EventRow } | { error: string }> {
  const parsed = input as { categoryId?: string };
  const supabase = await createClient();
  const result = await createEvent(
    supabase,
    input,
    await userTimezone(),
    await colorForCategory(parsed.categoryId),
  );
  if (!result.ok) {
    return { error: result.error };
  }
  return { data: result.data };
}

export async function updateEventAction(
  id: string,
  input: unknown,
): Promise<{ data: EventRow } | { error: string }> {
  const parsed = input as { categoryId?: string };
  const supabase = await createClient();
  const result = await updateEvent(
    supabase,
    id,
    input,
    await userTimezone(),
    await colorForCategory(parsed.categoryId),
  );
  if (!result.ok) {
    return { error: result.error };
  }
  return { data: result.data };
}

export async function deleteEventAction(id: string): Promise<{ data: EventRow } | { error: string }> {
  const supabase = await createClient();
  const result = await softDeleteEvent(supabase, id);
  if (!result.ok) {
    return { error: result.error };
  }
  return { data: result.data };
}

export async function fetchCategoriesAction(): Promise<{ data: Category[] } | { error: string }> {
  const supabase = await createClient();
  const result = await listCategories(supabase);
  if (!result.ok) {
    return { error: result.error };
  }
  return { data: result.data };
}

export async function createCategoryAction(
  input: unknown,
): Promise<{ data: Category } | { error: string }> {
  const supabase = await createClient();
  const result = await createCategory(supabase, input);
  if (!result.ok) {
    return { error: result.error };
  }
  return { data: result.data };
}

export async function deleteCategoryAction(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const result = await deleteCategory(supabase, id);
  if (!result.ok) {
    return { error: result.error };
  }
  return {};
}
