import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { getAccountContext, needsOnboarding } from "@/lib/account";

export default async function AppShellLayout({ children }: { children: ReactNode }) {
  const account = await getAccountContext();
  if (!account) {
    redirect("/login");
  }
  if (needsOnboarding(account.profile)) {
    redirect("/onboarding");
  }

  const displayName = account.profile.name ?? "There";

  return (
    <div className="flex min-h-svh bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar
          displayName={displayName}
          email={account.email}
          avatarUrl={account.profile.avatar_url}
          theme={account.settings.theme}
        />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
