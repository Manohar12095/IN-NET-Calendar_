import { AuthCard } from "@/components/auth/auth-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button-link";

type VerifyEmailPageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { email } = await searchParams;

  return (
    <AuthCard title="Verify your email" description="Confirm the address so this account can own planning data.">
      <Alert>
        <AlertTitle>Check your inbox</AlertTitle>
        <AlertDescription>
          {email
            ? `We sent a verification link to ${email}.`
            : "We sent a verification link to your email."}{" "}
          Open it on this device to finish signup.
        </AlertDescription>
      </Alert>
      <ButtonLink href="/login" variant="outline" className="mt-4 w-full">
        Back to sign in
      </ButtonLink>
    </AuthCard>
  );
}
