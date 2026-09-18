import { createClient } from "@/lib/supabase/server";
import type { Profile, Settings } from "@/types/database";

export type AccountContext = {
  userId: string;
  email: string | undefined;
  profile: Profile;
  settings: Settings;
};

export async function getAccountContext(): Promise<AccountContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [{ data: profile }, { data: settings }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("settings").select("*").eq("user_id", user.id).maybeSingle(),
  ]);

  if (!profile || !settings) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email,
    profile,
    settings,
  };
}

export function needsOnboarding(profile: Profile): boolean {
  return !profile.name || profile.name.trim().length === 0;
}
