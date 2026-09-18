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
      <p className="text-sm text-muted-foreground">Your planning layer is ready. Tasks and events come in Phase 2–3.</p>
    </div>
  );
}
