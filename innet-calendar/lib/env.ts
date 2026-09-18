export const SUPABASE_CONFIG_MESSAGE =
  "Supabase is not configured yet. Open innet-calendar/.env.local and set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from your project, then restart the app.";

export function getPublicAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  if (!url || !anonKey) {
    return false;
  }

  const placeholderUrl =
    url.includes("your-project") ||
    url.includes("placeholder") ||
    url === "https://your-project.supabase.co";
  const placeholderKey =
    anonKey === "your-anon-key" || anonKey.includes("placeholder") || anonKey.split(".").length < 3;

  if (placeholderUrl || placeholderKey) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname.endsWith("supabase.co");
  } catch {
    return false;
  }
}

export function getSupabaseServiceRoleKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export function getSupabasePublicEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env.local.",
    );
  }

  return { url, anonKey };
}
