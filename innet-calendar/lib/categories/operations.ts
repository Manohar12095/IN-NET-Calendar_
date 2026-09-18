import type { SupabaseClient } from "@supabase/supabase-js";
import { categoryFormSchema, categoryIdSchema } from "@/lib/schemas/category";
import type { Database, Category } from "@/types/database";

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

export async function listCategories(supabase: DbClient): Promise<Result<Category[]>> {
  const user = await requireUserId(supabase);
  if (!user.ok) {
    return user;
  }
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.data)
    .order("name", { ascending: true });
  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, data: data ?? [] };
}

export async function createCategory(supabase: DbClient, input: unknown): Promise<Result<Category>> {
  const user = await requireUserId(supabase);
  if (!user.ok) {
    return user;
  }
  const parsed = categoryFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid category" };
  }
  const { data, error } = await supabase
    .from("categories")
    .insert({ user_id: user.data, name: parsed.data.name, color: parsed.data.color })
    .select("*")
    .single();
  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not create category" };
  }
  return { ok: true, data };
}

export async function deleteCategory(supabase: DbClient, id: string): Promise<Result<{ id: string }>> {
  const user = await requireUserId(supabase);
  if (!user.ok) {
    return user;
  }
  const idParsed = categoryIdSchema.safeParse({ id });
  if (!idParsed.success) {
    return { ok: false, error: "Invalid category id" };
  }
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", idParsed.data.id)
    .eq("user_id", user.data);
  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, data: { id } };
}
