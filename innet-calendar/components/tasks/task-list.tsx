"use client";

import { TaskRow } from "@/components/tasks/task-row";
import { Skeleton } from "@/components/ui/skeleton";
import { compareByUrgencyThenDue } from "@/lib/tasks/urgency";
import type { Task } from "@/types/database";

type TaskListProps = {
  tasks: Task[];
  timezone: string;
  timeFormat: string;
  loading?: boolean;
  emptyTitle: string;
  emptyBody: string;
  onComplete: (task: Task, completed: boolean) => void;
  onDelete?: (task: Task) => void;
  onRestore?: (task: Task) => void;
};

export function TaskList({
  tasks,
  timezone,
  timeFormat,
  loading = false,
  emptyTitle,
  emptyBody,
  onComplete,
  onDelete,
  onRestore,
}: TaskListProps) {
  if (loading) {
    return (
      <div className="grid gap-2">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <p className="font-medium">{emptyTitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">{emptyBody}</p>
      </div>
    );
  }

  const sorted = [...tasks].sort(compareByUrgencyThenDue);

  return (
    <div className="grid gap-2">
      {sorted.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          timezone={timezone}
          timeFormat={timeFormat}
          onComplete={onComplete}
          onDelete={onDelete}
          onRestore={onRestore}
        />
      ))}
    </div>
  );
}
