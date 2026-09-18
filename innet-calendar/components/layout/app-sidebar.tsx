import { AppNav } from "@/components/layout/app-nav";

export function AppSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r bg-sidebar p-4 md:flex md:flex-col">
      <div className="mb-6">
        <p className="text-sm font-semibold tracking-tight">IN NET Calendar</p>
        <p className="text-xs text-muted-foreground">powered by IN NET CREATIONS</p>
      </div>
      <AppNav />
    </aside>
  );
}
