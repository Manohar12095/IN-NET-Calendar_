import type { ReactNode } from "react";
import { SupabaseConfigBanner } from "@/components/auth/supabase-config-banner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <Card className="w-full max-w-md border-border/60 bg-background/85 shadow-xl backdrop-blur-md">
      <CardHeader>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          IN NET Calendar
        </p>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <SupabaseConfigBanner />
        {children}
      </CardContent>
    </Card>
  );
}
