"use client";

import { ErrorFallback } from "@/components/errors/error-fallback";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorFallback error={error} reset={reset} title="IN NET Calendar hit an error" />
      </body>
    </html>
  );
}
