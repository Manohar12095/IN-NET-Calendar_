import type { TaskUrgency } from "@/lib/schemas/task";

export const URGENCY_RANK: Record<TaskUrgency, number> = {
  emergency: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export const URGENCY_LABEL: Record<TaskUrgency, string> = {
  emergency: "Emergency",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const URGENCY_CLASS: Record<TaskUrgency, string> = {
  emergency: "border-red-500/30 bg-red-500/15 text-red-700 dark:text-red-300",
  high: "border-orange-500/30 bg-orange-500/15 text-orange-700 dark:text-orange-300",
  medium: "border-amber-500/30 bg-amber-500/15 text-amber-800 dark:text-amber-300",
  low: "border-sky-500/30 bg-sky-500/15 text-sky-700 dark:text-sky-300",
};

export function isTaskUrgency(value: string): value is TaskUrgency {
  return value === "emergency" || value === "high" || value === "medium" || value === "low";
}

export function compareByUrgencyThenDue(
  a: { urgency: string; due_at: string | null },
  b: { urgency: string; due_at: string | null },
): number {
  const rankA = isTaskUrgency(a.urgency) ? URGENCY_RANK[a.urgency] : 99;
  const rankB = isTaskUrgency(b.urgency) ? URGENCY_RANK[b.urgency] : 99;
  if (rankA !== rankB) {
    return rankA - rankB;
  }
  if (!a.due_at && !b.due_at) {
    return 0;
  }
  if (!a.due_at) {
    return 1;
  }
  if (!b.due_at) {
    return -1;
  }
  return a.due_at.localeCompare(b.due_at);
}
