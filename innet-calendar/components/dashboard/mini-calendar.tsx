import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MiniCalendarProps = {
  weekStart: string;
};

export function MiniCalendar({ weekStart }: MiniCalendarProps) {
  const today = new Date();
  const weekStartsOn = weekStart === "sunday" ? 0 : 1;
  const start = startOfWeek(startOfMonth(today), { weekStartsOn });
  const end = endOfWeek(endOfMonth(today), { weekStartsOn });
  const days = eachDayOfInterval({ start, end });
  const labels = weekStartsOn === 0 ? ["S", "M", "T", "W", "T", "F", "S"] : ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{format(today, "MMMM yyyy")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
          {labels.map((label, index) => (
            <span key={`${label}-${index}`}>{label}</span>
          ))}
          {days.map((day) => (
            <span
              key={day.toISOString()}
              className={cn(
                "flex size-8 items-center justify-center rounded-full",
                !isSameMonth(day, today) && "text-muted-foreground/40",
                isToday(day) && "bg-primary text-primary-foreground",
              )}
            >
              {format(day, "d")}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
