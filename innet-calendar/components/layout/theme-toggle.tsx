"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateTheme } from "@/lib/actions/account";

type ThemeToggleProps = {
  currentTheme: string;
};

const THEMES = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
] as const;

export function ThemeToggle({ currentTheme }: ThemeToggleProps) {
  const { setTheme, theme } = useTheme();
  const [pending, startTransition] = useTransition();
  const active = theme ?? currentTheme;

  function choose(next: "light" | "dark" | "system"): void {
    setTheme(next);
    startTransition(async () => {
      const result = await updateTheme(next);
      if ("error" in result) {
        toast.error(result.error);
      }
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" aria-label="Toggle theme" disabled={pending} />}
      >
        <SunIcon className="dark:hidden" />
        <MoonIcon className="hidden dark:block" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {THEMES.map((item) => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem key={item.value} onClick={() => choose(item.value)}>
              <Icon />
              {item.label}
              {active === item.value ? (
                <span className="ml-auto text-xs text-muted-foreground">On</span>
              ) : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
