"use client";

import { format, isSameMonth, isToday } from "date-fns";
import { CalendarEventChip } from "@/components/calendar/calendar-event-chip";
import { eventsOnDay, monthCells, parseCursor, weekStartsOnFromSetting } from "@/lib/events/calendar-range";
import { cn } from "@/lib/utils";
import { useCalendarUiStore } from "@/stores/calendar-ui-store";
import type { Category, EventRow } from "@/types/database";

type CalendarMonthProps = {
  events: EventRow[];
  categories: Category[];
  timezone: string;
  timeFormat: string;
  weekStart: string;
  categoryFilter: string;
};

export function CalendarMonth({
  events,
  categories,
  timezone,
  timeFormat,
  weekStart,
  categoryFilter,
}: CalendarMonthProps) {
  const cursorDate = useCalendarUiStore((state) => state.cursorDate);
  const openCreate = useCalendarUiStore((state) => state.openCreate);
  const weekStartsOn = weekStartsOnFromSetting(weekStart);
  const days = monthCells(cursorDate, weekStartsOn);
  const cursor = parseCursor(cursorDate);
  const labels = weekStartsOn === 0 ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="grid grid-cols-7 border-b bg-muted/40 text-center text-xs font-medium text-muted-foreground">
        {labels.map((label) => (
          <div key={label} className="px-2 py-2">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const iso = format(day, "yyyy-MM-dd");
          const dayEvents = eventsOnDay(events, day, categoryFilter);
          const visible = dayEvents.slice(0, 3);
          const extra = dayEvents.length - visible.length;
          return (
            <button
              key={iso}
              type="button"
              onClick={() => openCreate(iso)}
              className={cn(
                "min-h-28 border-t border-r p-1 text-left align-top last:border-r-0",
                !isSameMonth(day, cursor) && "bg-muted/20 text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "mb-1 inline-flex size-6 items-center justify-center rounded-full text-xs",
                  isToday(day) && "bg-primary text-primary-foreground",
                )}
              >
                {format(day, "d")}
              </span>
              <div className="grid gap-0.5">
                {visible.map((event) => (
                  <CalendarEventChip
                    key={event.id}
                    event={event}
                    categories={categories}
                    timezone={timezone}
                    timeFormat={timeFormat}
                    compact
                  />
                ))}
                {extra > 0 ? (
                  <span className="px-1 text-[10px] text-muted-foreground">+{extra} more</span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
