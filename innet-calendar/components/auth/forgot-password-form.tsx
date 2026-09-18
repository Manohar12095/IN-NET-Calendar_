"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormError } from "@/components/auth/form-error";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/schemas/auth";
import { isSupabaseConfigured, SUPABASE_CONFIG_MESSAGE } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordInput): Promise<void> {
    setFormError(null);
    if (!isSupabaseConfigured()) {
      setFormError(SUPABASE_CONFIG_MESSAGE);
      return;
    }
    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${origin}/auth/callback?next=/reset-password`,
    });
    if (error) {
      setFormError(error.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <Alert>
        <AlertTitle>Check your email</AlertTitle>
        <AlertDescription>
          If an account exists for that address, we sent a reset link. It expires after a short
          time.
        </AlertDescription>
      </Alert>
    );
  }

  const pending = form.formState.isSubmitting;

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FormError message={formError} />
      <div className="grid gap-2">
        <Label htmlFor="forgot-email">Email</Label>
        <Input
          id="forgot-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
        ) : null}
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <Loader2Icon className="animate-spin" /> : null}
        Send reset link
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        <Link className="font-medium text-foreground underline-offset-4 hover:underline" href="/login">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
