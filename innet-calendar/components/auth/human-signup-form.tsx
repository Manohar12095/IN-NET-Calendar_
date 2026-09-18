"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormError } from "@/components/auth/form-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signupSchema, type SignupInput } from "@/lib/schemas/auth";
import { isSupabaseConfigured, SUPABASE_CONFIG_MESSAGE } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";

export function HumanSignupForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [oauthPending, setOauthPending] = useState(false);

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: SignupInput): Promise<void> {
    setFormError(null);
    if (!isSupabaseConfigured()) {
      setFormError(SUPABASE_CONFIG_MESSAGE);
      return;
    }
    const supabase = createClient();
    const origin = window.location.origin;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/onboarding`,
        data: { timezone },
      },
    });

    if (error) {
      setFormError(error.message);
      return;
    }

    if (data.session) {
      router.replace("/onboarding");
      router.refresh();
      return;
    }

    router.replace(`/verify-email?email=${encodeURIComponent(values.email)}`);
  }

  async function signUpWithGoogle(): Promise<void> {
    setFormError(null);
    if (!isSupabaseConfigured()) {
      setFormError(SUPABASE_CONFIG_MESSAGE);
      return;
    }
    setOauthPending(true);
    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=/onboarding`,
      },
    });
    if (error) {
      setOauthPending(false);
      setFormError(error.message);
    }
  }

  const pending = form.formState.isSubmitting;

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FormError message={formError} />
      <div className="grid gap-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          {...form.register("password")}
        />
        {form.formState.errors.password ? (
          <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="signup-confirm">Confirm password</Label>
        <Input
          id="signup-confirm"
          type="password"
          autoComplete="new-password"
          {...form.register("confirmPassword")}
        />
        {form.formState.errors.confirmPassword ? (
          <p className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>
        ) : null}
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <Loader2Icon className="animate-spin" /> : null}
        Create account
      </Button>
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>
      <Button type="button" variant="outline" className="w-full" onClick={signUpWithGoogle} disabled={oauthPending}>
        {oauthPending ? <Loader2Icon className="animate-spin" /> : null}
        Continue with Google
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="font-medium text-foreground underline-offset-4 hover:underline" href="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
