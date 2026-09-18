"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { profileOnboardingSchema } from "@/lib/schemas/profile";
import { settingsPreferencesSchema } from "@/lib/schemas/settings";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export async function completeOnboarding(
  input: unknown,
): Promise<{ error: string } | undefined> {
  const parsed = profileOnboardingSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid profile" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      name: parsed.data.name,
      timezone: parsed.data.timezone,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateTheme(
  theme: "light" | "dark" | "system",
): Promise<{ error: string } | { ok: true }> {
  return updatePreferences({ theme });
}

export async function updatePreferences(
  input: unknown,
): Promise<{ error: string } | { ok: true }> {
  const parsed = settingsPreferencesSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid settings" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const payload: Database["public"]["Tables"]["settings"]["Update"] = {};
  if (parsed.data.theme !== undefined) payload.theme = parsed.data.theme;
  if (parsed.data.week_start !== undefined) payload.week_start = parsed.data.week_start;
  if (parsed.data.time_format !== undefined) payload.time_format = parsed.data.time_format;
  if (parsed.data.default_view !== undefined) payload.default_view = parsed.data.default_view;
  if (parsed.data.reduced_motion !== undefined) payload.reduced_motion = parsed.data.reduced_motion;

  if (Object.keys(payload).length === 0) {
    return { ok: true };
  }

  const { error } = await supabase.from("settings").update(payload).eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
