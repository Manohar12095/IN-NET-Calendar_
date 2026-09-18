import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginTabs } from "@/components/auth/login-tabs";
import { AuthFormSkeleton } from "@/components/skeletons/page-skeletons";

export default function LoginPage() {
  return (
    <AuthCard
      title="Sign in"
      description="Humans use the first tab. Agents use the second — a different front door onto the same permission system."
    >
      <Suspense fallback={<AuthFormSkeleton />}>
        <LoginTabs />
      </Suspense>
    </AuthCard>
  );
}
