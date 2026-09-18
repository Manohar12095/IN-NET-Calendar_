"use client";

import { PlusIcon } from "lucide-react";
import { DashboardCounters } from "@/components/dashboard/counters";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { TaskList } from "@/components/tasks/task-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompleteTask, useDeleteTask, useTasksQuery } from "@/hooks/use-tasks";
import { countTasks, todayTasks } from "@/lib/tasks/selectors";
import { useTaskUiStore } from "@/stores/task-ui-store";
import type { Task } from "@/types/database";

type DashboardTasksProps = {
  timezone: string;
  timeFormat: string;
};

export function DashboardTasks({ timezone, timeFormat }: DashboardTasksProps) {
  const openCreate = useTaskUiStore((state) => state.openCreate);
  const { data: tasks = [], isLoading } = useTasksQuery(false);
  const completeTask = useCompleteTask();
  const deleteTask = useDeleteTask();
  const counters = countTasks(tasks, timezone);
  const today = todayTasks(tasks, timezone);

  function onComplete(task: Task, completed: boolean): void {
    completeTask.mutate({ id: task.id, completed });
  }

  return (
    <>
      <DashboardCounters {...counters} />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Today’s tasks</CardTitle>
          <Button type="button" size="sm" onClick={openCreate}>
            <PlusIcon />
            Add
          </Button>
        </CardHeader>
        <CardContent>
          <TaskList
            tasks={today}
            timezone={timezone}
            timeFormat={timeFormat}
            loading={isLoading}
            emptyTitle="Nothing due today"
            emptyBody="Create a task due today. Overdue items also appear here, sorted by urgency."
            onComplete={onComplete}
            onDelete={(task) => deleteTask.mutate(task.id)}
          />
        </CardContent>
      </Card>
      <TaskDialog timezone={timezone} />
    </>
  );
}
