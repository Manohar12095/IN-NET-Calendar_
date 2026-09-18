"use client";

import { format } from "date-fns";
import { CalendarEventChip } from "@/components/calendar/calendar-event-chip";
import { eventsOnDay, parseCursor } from "@/lib/events/calendar-range";
import { useCalendarUiStore } from "@/stores/calendar-ui-store";
import type { Category, EventRow } from "@/types/database";

type CalendarDayProps = {
  events: EventRow[];
  categories: Category[];
  timezone: string;
  timeFormat: string;
  categoryFilter: string;
};

export function CalendarDay({
  events,
  categories,
  timezone,
  timeFormat,
  categoryFilter,
}: CalendarDayProps) {
  const cursorDate = useCalendarUiStore((state) => state.cursorDate);
  const openCreate = useCalendarUiStore((state) => state.openCreate);
  const day = parseCursor(cursorDate);
  const dayEvents = eventsOnDay(events, day, categoryFilter);

  return (
    <div className="rounded-xl border p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium">{format(day, "EEEE, MMMM d")}</h3>
        <button type="button" className="text-sm text-primary" onClick={() => openCreate(cursorDate)}>
          Click to create
        </button>
      </div>
      {dayEvents.length === 0 ? (
        <p className="text-sm text-muted-foreground">No events this day.</p>
      ) : (
        <div className="grid max-w-xl gap-2">
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
      )}
    </div>
  );
}
