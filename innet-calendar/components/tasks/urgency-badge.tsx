"use client";

import { Badge } from "@/components/ui/badge";
import { URGENCY_CLASS, URGENCY_LABEL, isTaskUrgency } from "@/lib/tasks/urgency";
import { cn } from "@/lib/utils";

type UrgencyBadgeProps = {
  urgency: string;
  className?: string;
};

export function UrgencyBadge({ urgency, className }: UrgencyBadgeProps) {
  const key = isTaskUrgency(urgency) ? urgency : "medium";
  return (
    <Badge variant="outline" className={cn(URGENCY_CLASS[key], className)}>
      {URGENCY_LABEL[key]}
    </Badge>
  );
}
