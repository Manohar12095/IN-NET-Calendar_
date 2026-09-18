import { fromZonedTime, toZonedTime } from "date-fns-tz";
import type { EventFormInput } from "@/lib/schemas/event";

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function zonedParts(iso: string, timezone: string): { date: string; time: string } {
  const zoned = toZonedTime(new Date(iso), timezone);
  return {
    date: `${zoned.getFullYear()}-${pad(zoned.getMonth() + 1)}-${pad(zoned.getDate())}`,
    time: `${pad(zoned.getHours())}:${pad(zoned.getMinutes())}`,
  };
}

export function localToUtcIso(date: string, time: string, timezone: string): string {
  return fromZonedTime(`${date}T${time}:00`, timezone).toISOString();
}

export function eventFormToUtc(
  input: EventFormInput,
  timezone: string,
): { start_at: string; end_at: string; all_day: boolean } {
  if (input.allDay) {
    return {
      start_at: localToUtcIso(input.startDate, "00:00", timezone),
      end_at: localToUtcIso(input.endDate, "23:59", timezone),
      all_day: true,
    };
  }
  return {
    start_at: localToUtcIso(input.startDate, input.startTime || "09:00", timezone),
    end_at: localToUtcIso(input.endDate, input.endTime || "10:00", timezone),
    all_day: false,
  };
}

export function eventToFormFields(
  event: {
    start_at: string;
    end_at: string | null;
    all_day: boolean;
    title: string;
    description: string | null;
    location: string | null;
    category_id: string | null;
  },
  timezone: string,
): EventFormInput {
  const start = zonedParts(event.start_at, timezone);
  const end = zonedParts(event.end_at ?? event.start_at, timezone);
  return {
    title: event.title,
    description: event.description ?? "",
    location: event.location ?? "",
    allDay: event.all_day,
    startDate: start.date,
    startTime: event.all_day ? "" : start.time,
    endDate: end.date,
    endTime: event.all_day ? "" : end.time,
    categoryId: event.category_id ?? "",
  };
}

export function eventOverlapsRange(
  event: { start_at: string; end_at: string | null },
  rangeStart: Date,
  rangeEnd: Date,
): boolean {
  const start = new Date(event.start_at).getTime();
  const end = new Date(event.end_at ?? event.start_at).getTime();
  return start <= rangeEnd.getTime() && end >= rangeStart.getTime();
}
