import { endOfDay, startOfDay } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export function zonedDayBounds(
  timezone: string,
  reference: Date = new Date(),
): { startUtc: Date; endUtc: Date } {
  const zoned = toZonedTime(reference, timezone);
  return {
    startUtc: fromZonedTime(startOfDay(zoned), timezone),
    endUtc: fromZonedTime(endOfDay(zoned), timezone),
  };
}

export function dueFieldsToUtc(
  dueDate: string | undefined,
  dueTime: string | undefined,
  timezone: string,
): { due_at: string | null; due_time_set: boolean } {
  const date = dueDate?.trim() ?? "";
  const time = dueTime?.trim() ?? "";
  if (!date) {
    return { due_at: null, due_time_set: false };
  }
  const dueTimeSet = time.length > 0;
  const localStamp = `${date}T${dueTimeSet ? time : "00:00"}:00`;
  return {
    due_at: fromZonedTime(localStamp, timezone).toISOString(),
    due_time_set: dueTimeSet,
  };
}

export function utcToDueFields(
  dueAt: string | null,
  dueTimeSet: boolean,
  timezone: string,
): { dueDate: string; dueTime: string } {
  if (!dueAt) {
    return { dueDate: "", dueTime: "" };
  }
  const zoned = toZonedTime(new Date(dueAt), timezone);
  const year = String(zoned.getFullYear());
  const month = String(zoned.getMonth() + 1).padStart(2, "0");
  const day = String(zoned.getDate()).padStart(2, "0");
  const hours = String(zoned.getHours()).padStart(2, "0");
  const minutes = String(zoned.getMinutes()).padStart(2, "0");
  return {
    dueDate: `${year}-${month}-${day}`,
    dueTime: dueTimeSet ? `${hours}:${minutes}` : "",
  };
}
