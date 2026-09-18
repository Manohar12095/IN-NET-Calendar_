"use client";

import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { PencilIcon, RotateCcwIcon, Trash2Icon } from "lucide-react";
import { UrgencyBadge } from "@/components/tasks/urgency-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTaskUiStore } from "@/stores/task-ui-store";
import type { Task } from "@/types/database";

type TaskRowProps = {
  task: Task;
  timezone: string;
  timeFormat: string;
  onComplete: (task: Task, completed: boolean) => void;
  onDelete?: (task: Task) => void;
  onRestore?: (task: Task) => void;
};

export function TaskRow({
  task,
  timezone,
  timeFormat,
  onComplete,
  onDelete,
  onRestore,
}: TaskRowProps) {
  const openEdit = useTaskUiStore((state) => state.openEdit);
  const completed = task.status === "completed";
  const dueLabel = formatDue(task, timezone, timeFormat);

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border bg-card p-3",
        completed && "opacity-70",
      )}
    >
      <button
        type="button"
        aria-label={completed ? "Mark incomplete" : "Mark complete"}
        disabled={Boolean(task.deleted_at)}
        onClick={() => onComplete(task, !completed)}
        className={cn(
          "mt-0.5 size-5 shrink-0 rounded-full border",
          completed ? "border-primary bg-primary" : "border-muted-foreground/40",
        )}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className={cn("font-medium", completed && "line-through")}>{task.title}</p>
          <UrgencyBadge urgency={task.urgency} />
        </div>
        {task.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
        ) : null}
        <p className="mt-1 text-xs text-muted-foreground">{dueLabel}</p>
      </div>
      <div className="flex shrink-0 gap-1">
        {onRestore ? (
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Restore" onClick={() => onRestore(task)}>
            <RotateCcwIcon />
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Edit task"
              onClick={() => openEdit(task.id)}
            >
              <PencilIcon />
            </Button>
            {onDelete ? (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Move to trash"
                onClick={() => onDelete(task)}
              >
                <Trash2Icon />
              </Button>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

function formatDue(task: Task, timezone: string, timeFormat: string): string {
  if (!task.due_at) {
    return "No due date";
  }
  const zoned = toZonedTime(new Date(task.due_at), timezone);
  if (task.due_time_set) {
    const pattern = timeFormat === "12h" ? "MMM d, yyyy · h:mm a" : "MMM d, yyyy · HH:mm";
    return format(zoned, pattern);
  }
  return format(zoned, "MMM d, yyyy");
}
