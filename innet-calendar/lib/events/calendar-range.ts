import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { eventOverlapsRange } from "@/lib/events/datetime";
import type { CalendarView } from "@/stores/calendar-ui-store";
import type { Category, EventRow } from "@/types/database";

export function weekStartsOnFromSetting(weekStart: string): 0 | 1 {
  return weekStart === "sunday" ? 0 : 1;
}

export function parseCursor(cursorDate: string): Date {
  return parseISO(`${cursorDate}T12:00:00`);
}

export function visibleRange(
  view: CalendarView,
  cursorDate: string,
  weekStartsOn: 0 | 1,
): { start: Date; end: Date } {
  const cursor = parseCursor(cursorDate);
  if (view === "month") {
    return {
      start: startOfWeek(startOfMonth(cursor), { weekStartsOn }),
      end: endOfWeek(endOfMonth(cursor), { weekStartsOn }),
    };
  }
  if (view === "week") {
    return {
      start: startOfWeek(cursor, { weekStartsOn }),
      end: endOfWeek(cursor, { weekStartsOn }),
    };
  }
  if (view === "day") {
    return { start: startOfDay(cursor), end: endOfDay(cursor) };
  }
  return { start: startOfDay(cursor), end: endOfDay(addDays(cursor, 13)) };
}

export function shiftCursor(view: CalendarView, cursorDate: string, direction: -1 | 1): string {
  const cursor = parseCursor(cursorDate);
  const next =
    view === "month"
      ? addMonths(cursor, direction)
      : view === "week"
        ? addWeeks(cursor, direction)
        : addDays(cursor, direction);
  return format(next, "yyyy-MM-dd");
}

export function rangeLabel(view: CalendarView, cursorDate: string, weekStartsOn: 0 | 1): string {
  const cursor = parseCursor(cursorDate);
  if (view === "month") {
    return format(cursor, "MMMM yyyy");
  }
  if (view === "week") {
    const start = startOfWeek(cursor, { weekStartsOn });
    const end = endOfWeek(cursor, { weekStartsOn });
    return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
  }
  if (view === "agenda") {
    return `${format(cursor, "MMM d")} – ${format(addDays(cursor, 13), "MMM d, yyyy")}`;
  }
  return format(cursor, "EEEE, MMMM d, yyyy");
}

export function eventsInRange(
  events: EventRow[],
  start: Date,
  end: Date,
  categoryFilter: string,
): EventRow[] {
  return events.filter((event) => {
    if (categoryFilter !== "all" && event.category_id !== categoryFilter) {
      return false;
    }
    return eventOverlapsRange(event, start, end);
  });
}

export function eventsOnDay(events: EventRow[], day: Date, categoryFilter: string): EventRow[] {
  return eventsInRange(events, startOfDay(day), endOfDay(day), categoryFilter);
}

export function eventColor(event: EventRow, categories: Category[]): string {
  if (event.color) {
    return event.color;
  }
  const category = categories.find((item) => item.id === event.category_id);
  return category?.color ?? "#6366f1";
}

export function monthCells(cursorDate: string, weekStartsOn: 0 | 1): Date[] {
  const cursor = parseCursor(cursorDate);
  return eachDayOfInterval({
    start: startOfWeek(startOfMonth(cursor), { weekStartsOn }),
    end: endOfWeek(endOfMonth(cursor), { weekStartsOn }),
  });
}

export function weekDays(cursorDate: string, weekStartsOn: 0 | 1): Date[] {
  const cursor = parseCursor(cursorDate);
  return eachDayOfInterval({
    start: startOfWeek(cursor, { weekStartsOn }),
    end: endOfWeek(cursor, { weekStartsOn }),
  });
}
