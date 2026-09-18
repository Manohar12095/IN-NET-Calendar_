import { DashboardTasks } from "@/components/dashboard/dashboard-tasks";
import { UpcomingEventsCard } from "@/components/dashboard/upcoming-events-card";
import { DashboardGreeting } from "@/components/dashboard/greeting";
import { LiveClock } from "@/components/dashboard/live-clock";
import { MiniCalendar } from "@/components/dashboard/mini-calendar";
import { getAccountContext } from "@/lib/account";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const account = await getAccountContext();
  if (!account) {
    redirect("/login");
  }

  const name = account.profile.name ?? "there";

  return (
    <div className="mx-auto grid max-w-6xl gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <DashboardGreeting name={name} />
        <LiveClock timezone={account.profile.timezone} timeFormat={account.settings.time_format} />
      </div>
      <DashboardTasks timezone={account.profile.timezone} timeFormat={account.settings.time_format} />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UpcomingEventsCard timezone={account.profile.timezone} timeFormat={account.settings.time_format} />
        </div>
        <MiniCalendar weekStart={account.settings.week_start} />
      </div>
    </div>
  );
}
