import { AuthCard } from "@/components/auth/auth-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AgentAccessLinkPage() {
  return (
    <AuthCard
      title="Redeem access link"
      description="Paste a token a human generated in Settings. It binds this agent to that account’s permissions."
    >
      <Alert>
        <AlertTitle>Not active yet</AlertTitle>
        <AlertDescription>
          Phase 8 validates the token, creates or reuses an agent identity, and mints{" "}
          <code className="text-xs">api_keys</code> with{" "}
          <code className="text-xs">created_via = agent_access_link</code>.
        </AlertDescription>
      </Alert>
      <form className="mt-4 grid gap-3">
        <div className="grid gap-2">
          <Label htmlFor="access-token">Access link or token</Label>
          <Input id="access-token" disabled placeholder="innet_link_…" />
        </div>
        <Button type="button" disabled>
          Redeem (Phase 8)
        </Button>
      </form>
      <ButtonLink href="/login?tab=agent" variant="ghost" className="mt-3 w-full">
        Back to agent login
      </ButtonLink>
    </AuthCard>
  );
}
