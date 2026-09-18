import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthCard title="Reset password" description="We’ll email a link that lets you choose a new password.">
      <ForgotPasswordForm />
    </AuthCard>
  );
}
