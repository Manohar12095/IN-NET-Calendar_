import { zonedDayBounds } from "@/lib/tasks/datetime";
import { isTaskUrgency } from "@/lib/tasks/urgency";
import type { Task } from "@/types/database";

export type TaskCounters = {
  remaining: number;
  completed: number;
  overdue: number;
  highUrgency: number;
};

export function isCompleted(task: Task): boolean {
  return task.status === "completed";
}

export function isOverdue(task: Task, timezone: string, now: Date = new Date()): boolean {
  if (!task.due_at || isCompleted(task) || task.deleted_at) {
    return false;
  }
  const { startUtc } = zonedDayBounds(timezone, now);
  return new Date(task.due_at).getTime() < startUtc.getTime();
}

export function isDueToday(task: Task, timezone: string, now: Date = new Date()): boolean {
  if (!task.due_at || task.deleted_at) {
    return false;
  }
  const due = new Date(task.due_at).getTime();
  const { startUtc, endUtc } = zonedDayBounds(timezone, now);
  return due >= startUtc.getTime() && due <= endUtc.getTime();
}

export function todayTasks(tasks: Task[], timezone: string): Task[] {
  return tasks.filter((task) => !task.deleted_at && (isDueToday(task, timezone) || isOverdue(task, timezone)));
}

export function countTasks(tasks: Task[], timezone: string): TaskCounters {
  const active = tasks.filter((task) => !task.deleted_at);
  const remaining = active.filter((task) => !isCompleted(task) && (isDueToday(task, timezone) || isOverdue(task, timezone)));
  const completedToday = active.filter((task) => isCompleted(task) && isDueToday(task, timezone));
  const overdue = active.filter((task) => isOverdue(task, timezone));
  const highUrgency = remaining.filter(
    (task) => isTaskUrgency(task.urgency) && (task.urgency === "emergency" || task.urgency === "high"),
  );
  return {
    remaining: remaining.length,
    completed: completedToday.length,
    overdue: overdue.length,
    highUrgency: highUrgency.length,
  };
}
