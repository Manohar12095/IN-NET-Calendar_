import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthShell } from "@/components/auth/auth-shell";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { getAccountContext, needsOnboarding } from "@/lib/account";
import { createClient } from "@/lib/supabase/server";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let account = await getAccountContext();
  if (!account) {
    await supabase.from("profiles").upsert({
      id: user.id,
      timezone: "UTC",
    });
    await supabase.from("settings").upsert({ user_id: user.id });
    account = await getAccountContext();
  }

  if (account && !needsOnboarding(account.profile)) {
    redirect("/dashboard");
  }

  const defaultTimezone =
    account?.profile.timezone && account.profile.timezone !== "UTC"
      ? account.profile.timezone
      : Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <AuthShell>
      <AuthCard
        title="Set up your profile"
        description="Name and timezone are stored on your profile. Timestamps stay UTC; this zone is only used when rendering."
      >
        <OnboardingForm
          defaultName={account?.profile.name ?? ""}
          defaultTimezone={defaultTimezone}
        />
      </AuthCard>
    </AuthShell>
  );
}
