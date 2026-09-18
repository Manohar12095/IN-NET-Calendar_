import { SettingsForm } from "@/components/settings/settings-form";
import { getAccountContext } from "@/lib/account";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const account = await getAccountContext();
  if (!account) {
    redirect("/login");
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Theme is stored on your `settings` row and applied on every load. Accent colors and agent
          access arrive in later phases.
        </p>
      </div>
      <SettingsForm
        defaults={{
          theme: asTheme(account.settings.theme),
          week_start: account.settings.week_start === "sunday" ? "sunday" : "monday",
          time_format: account.settings.time_format === "12h" ? "12h" : "24h",
          default_view: asView(account.settings.default_view),
          reduced_motion: account.settings.reduced_motion,
        }}
      />
    </div>
  );
}

function asTheme(value: string): "light" | "dark" | "system" {
  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }
  return "system";
}

function asView(value: string): "month" | "week" | "day" | "agenda" {
  if (value === "month" || value === "week" || value === "day" || value === "agenda") {
    return value;
  }
  return "month";
}
