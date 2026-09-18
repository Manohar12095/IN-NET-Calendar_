import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardCountersProps = {
  remaining: number;
  completed: number;
  overdue: number;
  highUrgency: number;
};

const COUNTERS: { key: keyof DashboardCountersProps; label: string }[] = [
  { key: "remaining", label: "Remaining" },
  { key: "completed", label: "Completed" },
  { key: "overdue", label: "Overdue" },
  { key: "highUrgency", label: "High urgency" },
];

export function DashboardCounters(props: DashboardCountersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {COUNTERS.map((item) => (
        <Card key={item.key} size="sm">
          <CardHeader>
            <CardTitle className="text-muted-foreground">{item.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">{props[item.key]}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
