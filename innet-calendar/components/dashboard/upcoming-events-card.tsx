"use client";

import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { addDays } from "date-fns";
import { CalendarEventChip } from "@/components/calendar/calendar-event-chip";
import { EventDialog } from "@/components/calendar/event-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategoriesQuery, useEventsQuery } from "@/hooks/use-events";
import { eventsInRange } from "@/lib/events/calendar-range";
import { useCalendarUiStore } from "@/stores/calendar-ui-store";

type UpcomingEventsCardProps = {
  timezone: string;
  timeFormat: string;
};

export function UpcomingEventsCard({ timezone, timeFormat }: UpcomingEventsCardProps) {
  const openCreate = useCalendarUiStore((state) => state.openCreate);
  const { data: events = [], isLoading } = useEventsQuery();
  const { data: categories = [] } = useCategoriesQuery();
  const now = new Date();
  const upcoming = eventsInRange(events, now, addDays(now, 7), "all").slice(0, 8);

  return (
    <>
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Upcoming events</CardTitle>
          <button type="button" className="text-sm text-primary" onClick={() => openCreate()}>
            Add
          </button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading events…</p>
          ) : upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events in the next 7 days.</p>
          ) : (
            <div className="grid gap-2">
              {upcoming.map((event) => {
                const zoned = toZonedTime(new Date(event.start_at), timezone);
                return (
                  <div key={event.id} className="grid gap-1">
                    <p className="text-xs text-muted-foreground">{format(zoned, "EEE, MMM d")}</p>
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
          )}
        </CardContent>
      </Card>
      <EventDialog timezone={timezone} categories={categories} />
    </>
  );
}
