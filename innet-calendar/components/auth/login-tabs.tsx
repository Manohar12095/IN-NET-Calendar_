"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AgentLoginShell } from "@/components/auth/agent-login-shell";
import { HumanLoginForm } from "@/components/auth/human-login-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LoginTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"human" | "agent">(
    searchParams.get("tab") === "agent" ? "agent" : "human",
  );

  function onTabChange(value: string | number | null): void {
    const next = value === "agent" ? "agent" : "human";
    setTab(next);
    const params = new URLSearchParams(searchParams.toString());
    if (next === "agent") {
      params.set("tab", "agent");
    } else {
      params.delete("tab");
    }
    const query = params.toString();
    router.replace(query ? `/login?${query}` : "/login", { scroll: false });
  }

  return (
    <Tabs value={tab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="human">Human login</TabsTrigger>
        <TabsTrigger value="agent">Agent login</TabsTrigger>
      </TabsList>
      <TabsContent value="human" className="mt-4">
        <HumanLoginForm />
      </TabsContent>
      <TabsContent value="agent" className="mt-4">
        <AgentLoginShell />
      </TabsContent>
    </Tabs>
  );
}
