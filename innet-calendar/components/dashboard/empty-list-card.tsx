import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EmptyListCardProps = {
  title: string;
  body: string;
};

export function EmptyListCard({ title, body }: EmptyListCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{body}</p>
      </CardContent>
    </Card>
  );
}
