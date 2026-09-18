"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormError } from "@/components/auth/form-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { isSupabaseConfigured, SUPABASE_CONFIG_MESSAGE } from "@/lib/env";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth";
import { createClient } from "@/lib/supabase/client";

export function HumanLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/dashboard";
  const [formError, setFormError] = useState<string | null>(null);
  const [oauthPending, setOauthPending] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginInput): Promise<void> {
    setFormError(null);
    if (!isSupabaseConfigured()) {
      setFormError(SUPABASE_CONFIG_MESSAGE);
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setFormError(error.message);
      return;
    }

    toast.success("Welcome back");
    router.replace(nextPath);
    router.refresh();
  }

  async function signInWithGoogle(): Promise<void> {
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
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
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
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
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
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password">Password</Label>
          <Link className="text-xs text-muted-foreground hover:text-foreground" href="/forgot-password">
            Forgot password?
          </Link>
        </div>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          {...form.register("password")}
        />
        {form.formState.errors.password ? (
          <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
        ) : null}
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <Loader2Icon className="animate-spin" /> : null}
        Sign in
      </Button>
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>
      <Button type="button" variant="outline" className="w-full" onClick={signInWithGoogle} disabled={oauthPending}>
        {oauthPending ? <Loader2Icon className="animate-spin" /> : null}
        Continue with Google
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        No account?{" "}
        <Link className="font-medium text-foreground underline-offset-4 hover:underline" href="/signup">
          Create one
        </Link>
      </p>
    </form>
  );
}
