import { AuthCard } from "@/components/auth/auth-card";
import { HumanSignupForm } from "@/components/auth/human-signup-form";

export default function SignupPage() {
  return (
    <AuthCard title="Create your account" description="Email verification is required before the dashboard unlocks.">
      <HumanSignupForm />
    </AuthCard>
  );
}
