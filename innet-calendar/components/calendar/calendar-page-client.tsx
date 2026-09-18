"use client";

import { useEffect } from "react";
import { CalendarAgenda } from "@/components/calendar/calendar-agenda";
import { CalendarDay } from "@/components/calendar/calendar-day";
import { CalendarMonth } from "@/components/calendar/calendar-month";
import { CalendarToolbar } from "@/components/calendar/calendar-toolbar";
import { CalendarWeek } from "@/components/calendar/calendar-week";
import { CategoryCreator } from "@/components/calendar/category-creator";
import { CategoryFilter } from "@/components/calendar/category-filter";
import { EventDialog } from "@/components/calendar/event-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategoriesQuery, useEventsQuery } from "@/hooks/use-events";
import { useCalendarUiStore, type CalendarView } from "@/stores/calendar-ui-store";

type CalendarPageClientProps = {
  timezone: string;
  timeFormat: string;
  weekStart: string;
  defaultView: string;
};

export function CalendarPageClient({
  timezone,
  timeFormat,
  weekStart,
  defaultView,
}: CalendarPageClientProps) {
  const view = useCalendarUiStore((state) => state.view);
  const categoryFilter = useCalendarUiStore((state) => state.categoryFilter);
  const setView = useCalendarUiStore((state) => state.setView);
  const { data: events = [], isLoading } = useEventsQuery();
  const { data: categories = [] } = useCategoriesQuery();

  useEffect(() => {
    if (isCalendarView(defaultView)) {
      setView(defaultView);
    }
  }, [defaultView, setView]);

  return (
    <div className="mx-auto grid max-w-6xl gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
        <p className="text-sm text-muted-foreground">
          Click a day to create. All four views stay in sync because they share one events query.
        </p>
      </div>
      <CalendarToolbar weekStart={weekStart} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CategoryFilter categories={categories} />
        <CategoryCreator />
      </div>
      {isLoading ? (
        <Skeleton className="h-[28rem] w-full" />
      ) : view === "week" ? (
        <CalendarWeek
          events={events}
          categories={categories}
          timezone={timezone}
          timeFormat={timeFormat}
          weekStart={weekStart}
          categoryFilter={categoryFilter}
        />
      ) : view === "day" ? (
        <CalendarDay
          events={events}
          categories={categories}
          timezone={timezone}
          timeFormat={timeFormat}
          categoryFilter={categoryFilter}
        />
      ) : view === "agenda" ? (
        <CalendarAgenda
          events={events}
          categories={categories}
          timezone={timezone}
          timeFormat={timeFormat}
          weekStart={weekStart}
          categoryFilter={categoryFilter}
        />
      ) : (
        <CalendarMonth
          events={events}
          categories={categories}
          timezone={timezone}
          timeFormat={timeFormat}
          weekStart={weekStart}
          categoryFilter={categoryFilter}
        />
      )}
      <EventDialog timezone={timezone} categories={categories} />
    </div>
  );
}

function isCalendarView(value: string): value is CalendarView {
  return value === "month" || value === "week" || value === "day" || value === "agenda";
}
