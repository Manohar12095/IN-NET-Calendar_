"use client";

import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { AppNav } from "@/components/layout/app-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type AppTopbarProps = {
  displayName: string;
  email: string | undefined;
  avatarUrl: string | null;
  theme: string;
};

export function AppTopbar({ displayName, email, avatarUrl, theme }: AppTopbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-14 items-center gap-3 border-b bg-background/80 px-3 backdrop-blur md:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation" />
          }
        >
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader>
            <SheetTitle>IN NET Calendar</SheetTitle>
          </SheetHeader>
          <div className="px-3 pb-4">
            <AppNav onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium md:hidden">IN NET Calendar</p>
      </div>
      <ThemeToggle currentTheme={theme} />
      <UserMenu displayName={displayName} email={email} avatarUrl={avatarUrl} />
    </header>
  );
}
