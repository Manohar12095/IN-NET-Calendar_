import { AuthCard } from "@/components/auth/auth-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AgentCreatePage() {
  return (
    <AuthCard
      title="Create agent account"
      description="Self-registered agents exist independently of any human until someone links them."
    >
      <Alert>
        <AlertTitle>Not active yet</AlertTitle>
        <AlertDescription>
          Phase 8 will persist <code className="text-xs">agent_accounts</code> and mint an API key
          with zero permissions. This form is the route shell only.
        </AlertDescription>
      </Alert>
      <form className="mt-4 grid gap-3">
        <div className="grid gap-2">
          <Label htmlFor="agent-name">Display name</Label>
          <Input id="agent-name" disabled placeholder="Campus bot" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="agent-description">Description</Label>
          <Input id="agent-description" disabled placeholder="Helps students plan study blocks" />
        </div>
        <Button type="button" disabled>
          Create agent (Phase 8)
        </Button>
      </form>
      <ButtonLink href="/login?tab=agent" variant="ghost" className="mt-3 w-full">
        Back to agent login
      </ButtonLink>
    </AuthCard>
  );
}
