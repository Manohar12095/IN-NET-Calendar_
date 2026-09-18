"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { rangeLabel, shiftCursor, weekStartsOnFromSetting } from "@/lib/events/calendar-range";
import { todayIso, useCalendarUiStore, type CalendarView } from "@/stores/calendar-ui-store";

const VIEWS: { id: CalendarView; label: string }[] = [
  { id: "month", label: "Month" },
  { id: "week", label: "Week" },
  { id: "day", label: "Day" },
  { id: "agenda", label: "Agenda" },
];

type CalendarToolbarProps = {
  weekStart: string;
};

export function CalendarToolbar({ weekStart }: CalendarToolbarProps) {
  const view = useCalendarUiStore((state) => state.view);
  const cursorDate = useCalendarUiStore((state) => state.cursorDate);
  const setView = useCalendarUiStore((state) => state.setView);
  const setCursorDate = useCalendarUiStore((state) => state.setCursorDate);
  const openCreate = useCalendarUiStore((state) => state.openCreate);
  const weekStartsOn = weekStartsOnFromSetting(weekStart);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="icon-sm" onClick={() => setCursorDate(shiftCursor(view, cursorDate, -1))} aria-label="Previous">
          <ChevronLeftIcon />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setCursorDate(todayIso())}>
          Today
        </Button>
        <Button type="button" variant="outline" size="icon-sm" onClick={() => setCursorDate(shiftCursor(view, cursorDate, 1))} aria-label="Next">
          <ChevronRightIcon />
        </Button>
        <h2 className="text-lg font-semibold tracking-tight">{rangeLabel(view, cursorDate, weekStartsOn)}</h2>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border p-0.5">
          {VIEWS.map((item) => (
            <Button
              key={item.id}
              type="button"
              size="sm"
              variant={view === item.id ? "default" : "ghost"}
              onClick={() => setView(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
        <Button type="button" onClick={() => openCreate(cursorDate)}>
          Add event
        </Button>
      </div>
    </div>
  );
}
