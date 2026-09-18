import { DashboardCounters } from "@/components/dashboard/counters";
import { EmptyListCard } from "@/components/dashboard/empty-list-card";
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
      <DashboardCounters remaining={0} completed={0} overdue={0} highUrgency={0} />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="grid gap-4 lg:col-span-2">
          <EmptyListCard
            title="Today’s tasks"
            body="Nothing due today. Task CRUD ships in Phase 2 — this list will sort by urgency."
          />
          <EmptyListCard
            title="Upcoming events"
            body="No events in the next 7 days. Calendar views in Phase 3 will fill this from the same events table."
          />
        </div>
        <MiniCalendar weekStart={account.settings.week_start} />
      </div>
    </div>
  );
}
