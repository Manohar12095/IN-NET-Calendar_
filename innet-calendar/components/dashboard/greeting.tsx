type DashboardGreetingProps = {
  name: string;
};

function greetingForHour(hour: number): string {
  if (hour < 12) {
    return "Good morning";
  }
  if (hour < 18) {
    return "Good afternoon";
  }
  return "Good evening";
}

export function DashboardGreeting({ name }: DashboardGreetingProps) {
  const hour = new Date().getHours();
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        {greetingForHour(hour)}, {name}
      </h1>
      <p className="text-sm text-muted-foreground">
        Today’s tasks and the next 7 days of events share the same live data as Tasks and Calendar.
      </p>
    </div>
  );
}
