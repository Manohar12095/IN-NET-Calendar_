"use client";

import { useEffect, useState, type ReactNode } from "react";

const SPLINE_SCRIPT =
  "https://cdn.spline.design/@splinetool/viewer@2.0.53/build/spline-viewer.js";

type SplineSceneProps = {
  url: string;
  className?: string;
  children?: ReactNode;
};

function shouldSkipSpline(): boolean {
  if (typeof window === "undefined") {
    return true;
  }
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const smallViewport = window.matchMedia("(max-width: 767px)").matches;
  return reducedMotion || smallViewport;
}

export function SplineScene({ url, className, children }: SplineSceneProps) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const afterPaint = window.requestAnimationFrame(() => {
      if (shouldSkipSpline()) {
        return;
      }

      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${SPLINE_SCRIPT}"]`,
      );

      const onReady = () => {
        if (!cancelled) {
          setReady(true);
        }
      };

      if (customElements.get("spline-viewer")) {
        onReady();
        return;
      }

      const script = existing ?? document.createElement("script");
      script.type = "module";
      script.src = SPLINE_SCRIPT;
      script.addEventListener("error", () => {
        if (!cancelled) {
          setFailed(true);
        }
      });
      void customElements
        .whenDefined("spline-viewer")
        .then(onReady)
        .catch(() => {
          if (!cancelled) {
            setFailed(true);
          }
        });
      if (!existing) {
        document.head.appendChild(script);
      }
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(afterPaint);
    };
  }, []);

  if (!ready || failed) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className} aria-hidden="true">
      <spline-viewer
        url={url}
        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
      />
      {children}
    </div>
  );
}
