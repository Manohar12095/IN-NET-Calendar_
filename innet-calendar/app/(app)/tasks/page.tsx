import { TasksPageClient } from "@/components/tasks/tasks-page-client";
import { getAccountContext } from "@/lib/account";
import { redirect } from "next/navigation";

export default async function TasksPage() {
  const account = await getAccountContext();
  if (!account) {
    redirect("/login");
  }

  return (
    <TasksPageClient timezone={account.profile.timezone} timeFormat={account.settings.time_format} />
  );
}
