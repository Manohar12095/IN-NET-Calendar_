"use client";

import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { CalendarEventChip } from "@/components/calendar/calendar-event-chip";
import { eventsInRange, visibleRange, weekStartsOnFromSetting } from "@/lib/events/calendar-range";
import { useCalendarUiStore } from "@/stores/calendar-ui-store";
import type { Category, EventRow } from "@/types/database";

type CalendarAgendaProps = {
  events: EventRow[];
  categories: Category[];
  timezone: string;
  timeFormat: string;
  weekStart: string;
  categoryFilter: string;
};

export function CalendarAgenda({
  events,
  categories,
  timezone,
  timeFormat,
  weekStart,
  categoryFilter,
}: CalendarAgendaProps) {
  const cursorDate = useCalendarUiStore((state) => state.cursorDate);
  const range = visibleRange("agenda", cursorDate, weekStartsOnFromSetting(weekStart));
  const items = eventsInRange(events, range.start, range.end, categoryFilter).sort((a, b) =>
    a.start_at.localeCompare(b.start_at),
  );

  if (items.length === 0) {
    return (
      <div className="rounded-xl border p-6 text-sm text-muted-foreground">
        No events in this two-week agenda. Create one from any view — they all share the same list.
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {items.map((event) => {
        const zoned = toZonedTime(new Date(event.start_at), timezone);
        return (
          <div key={event.id} className="grid gap-1 rounded-xl border p-3 sm:grid-cols-[140px_1fr] sm:items-center">
            <p className="text-sm text-muted-foreground">{format(zoned, "EEE, MMM d")}</p>
            <CalendarEventChip
              event={event}
              categories={categories}
              timezone={timezone}
              timeFormat={timeFormat}
            />
          </div>
        );
      })}
    </div>
  );
}
