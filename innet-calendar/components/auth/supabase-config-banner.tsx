import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isSupabaseConfigured, SUPABASE_CONFIG_MESSAGE } from "@/lib/env";

export function SupabaseConfigBanner() {
  if (isSupabaseConfigured()) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircleIcon />
      <AlertTitle>Connect Supabase to enable sign-in</AlertTitle>
      <AlertDescription>{SUPABASE_CONFIG_MESSAGE}</AlertDescription>
    </Alert>
  );
}
