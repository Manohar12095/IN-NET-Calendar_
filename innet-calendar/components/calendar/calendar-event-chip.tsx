"use client";

import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { eventColor } from "@/lib/events/calendar-range";
import { cn } from "@/lib/utils";
import { useCalendarUiStore } from "@/stores/calendar-ui-store";
import type { Category, EventRow } from "@/types/database";

type CalendarEventChipProps = {
  event: EventRow;
  categories: Category[];
  timezone: string;
  timeFormat: string;
  compact?: boolean;
};

export function CalendarEventChip({
  event,
  categories,
  timezone,
  timeFormat,
  compact = false,
}: CalendarEventChipProps) {
  const openEdit = useCalendarUiStore((state) => state.openEdit);
  const color = eventColor(event, categories);
  const zoned = toZonedTime(new Date(event.start_at), timezone);
  const timeLabel = event.all_day
    ? "All day"
    : format(zoned, timeFormat === "12h" ? "h:mm a" : "HH:mm");

  return (
    <button
      type="button"
      onClick={(click) => {
        click.stopPropagation();
        openEdit(event.id);
      }}
      className={cn(
        "flex w-full min-w-0 items-center gap-1 rounded px-1.5 py-0.5 text-left text-[11px] font-medium text-white",
        compact && "truncate",
      )}
      style={{ backgroundColor: color }}
    >
      <span className="truncate">
        {compact ? event.title : `${timeLabel} · ${event.title}`}
      </span>
    </button>
  );
}
