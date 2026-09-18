"use client";

import { format, isToday } from "date-fns";
import { CalendarEventChip } from "@/components/calendar/calendar-event-chip";
import { eventsOnDay, weekDays, weekStartsOnFromSetting } from "@/lib/events/calendar-range";
import { cn } from "@/lib/utils";
import { useCalendarUiStore } from "@/stores/calendar-ui-store";
import type { Category, EventRow } from "@/types/database";

type CalendarWeekProps = {
  events: EventRow[];
  categories: Category[];
  timezone: string;
  timeFormat: string;
  weekStart: string;
  categoryFilter: string;
};

export function CalendarWeek({
  events,
  categories,
  timezone,
  timeFormat,
  weekStart,
  categoryFilter,
}: CalendarWeekProps) {
  const cursorDate = useCalendarUiStore((state) => state.cursorDate);
  const openCreate = useCalendarUiStore((state) => state.openCreate);
  const days = weekDays(cursorDate, weekStartsOnFromSetting(weekStart));

  return (
    <div className="grid gap-2 md:grid-cols-7">
      {days.map((day) => {
        const iso = format(day, "yyyy-MM-dd");
        const dayEvents = eventsOnDay(events, day, categoryFilter);
        return (
          <button
            key={iso}
            type="button"
            onClick={() => openCreate(iso)}
            className={cn(
              "min-h-48 rounded-xl border p-2 text-left",
              isToday(day) && "ring-2 ring-primary/40",
            )}
          >
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              {format(day, "EEE d")}
            </p>
            <div className="grid gap-1">
              {dayEvents.map((event) => (
                <CalendarEventChip
                  key={event.id}
                  event={event}
                  categories={categories}
                  timezone={timezone}
                  timeFormat={timeFormat}
                />
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
