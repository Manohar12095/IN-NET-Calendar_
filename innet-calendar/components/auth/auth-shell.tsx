import type { ReactNode } from "react";
import { SplineScene } from "@/components/spline/spline-scene";

const LOGIN_SPLINE_URL = "https://prod.spline.design/vW6HMk6aCDcbffeC/scene.splinecode";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="relative min-h-svh overflow-hidden bg-background">
      {/* Credit/debit-card Spline scene — unusual for a calendar login; swap later if desired. */}
      <SplineScene
        url={LOGIN_SPLINE_URL}
        className="pointer-events-none absolute inset-0 hidden md:block motion-reduce:hidden"
      />
      <div className="pointer-events-none absolute inset-0 bg-background/55 md:bg-background/35" />
      <div className="pointer-events-none absolute bottom-0 left-0 z-[5] h-16 w-16 bg-background md:bg-background/90" />
      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center px-4 py-10">
        {children}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          powered by IN NET CREATIONS
        </p>
      </div>
    </div>
  );
}
