"use client";

import { URGENCY_CLASS, URGENCY_LABEL } from "@/lib/tasks/urgency";
import type { TaskUrgency } from "@/lib/schemas/task";
import { cn } from "@/lib/utils";

const OPTIONS: TaskUrgency[] = ["emergency", "high", "medium", "low"];

type UrgencySelectorProps = {
  value: TaskUrgency;
  onChange: (value: TaskUrgency) => void;
};

export function UrgencySelector({ value, onChange }: UrgencySelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Urgency">
      {OPTIONS.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option)}
            className={cn(
              "rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors",
              URGENCY_CLASS[option],
              selected ? "ring-2 ring-ring" : "opacity-70 hover:opacity-100",
            )}
          >
            {URGENCY_LABEL[option]}
          </button>
        );
      })}
    </div>
  );
}
