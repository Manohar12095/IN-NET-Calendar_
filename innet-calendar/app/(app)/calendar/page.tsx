import { CalendarPageClient } from "@/components/calendar/calendar-page-client";
import { getAccountContext } from "@/lib/account";
import { redirect } from "next/navigation";

export default async function CalendarPage() {
  const account = await getAccountContext();
  if (!account) {
    redirect("/login");
  }

  return (
    <CalendarPageClient
      timezone={account.profile.timezone}
      timeFormat={account.settings.time_format}
      weekStart={account.settings.week_start}
      defaultView={account.settings.default_view}
    />
  );
}
