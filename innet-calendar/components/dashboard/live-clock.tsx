"use client";

import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useEffect, useState } from "react";

type LiveClockProps = {
  timezone: string;
  timeFormat: string;
};

export function LiveClock({ timezone, timeFormat }: LiveClockProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const zoned = toZonedTime(now, timezone);
  const pattern = timeFormat === "12h" ? "EEEE, MMM d · h:mm:ss a" : "EEEE, MMM d · HH:mm:ss";

  return (
    <p className="font-mono text-sm text-muted-foreground" suppressHydrationWarning>
      {format(zoned, pattern)}
    </p>
  );
}
