import { BotIcon, KeyRoundIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AgentLoginShell() {
  return (
    <div className="grid gap-4">
      <Alert>
        <BotIcon />
        <AlertTitle>Agent identity is a later phase</AlertTitle>
        <AlertDescription>
          These screens are wired so agents can reach the right routes. Linking, access links, and
          API keys land in Phase 8. Nothing here grants data access yet.
        </AlertDescription>
      </Alert>
      <Card>
        <CardHeader>
          <CardTitle>Create agent account</CardTitle>
          <CardDescription>
            Self-register a bot identity. It starts with zero linked users and zero permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ButtonLink href="/login/agent/create" className="w-full">
            <BotIcon />
            Create agent account
          </ButtonLink>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>I have an access link</CardTitle>
          <CardDescription>
            Redeem a scoped token a human generated in Settings. Bound to that account on redeem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ButtonLink href="/login/agent/access-link" variant="outline" className="w-full">
            <KeyRoundIcon />
            Redeem access link
          </ButtonLink>
        </CardContent>
      </Card>
    </div>
  );
}
