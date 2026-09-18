"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FormError } from "@/components/auth/form-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { completeOnboarding } from "@/lib/actions/account";
import { profileOnboardingSchema, type ProfileOnboardingInput } from "@/lib/schemas/profile";

type OnboardingFormProps = {
  defaultName: string;
  defaultTimezone: string;
};

export function OnboardingForm({ defaultName, defaultTimezone }: OnboardingFormProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const timezones = useMemo(() => {
    if (typeof Intl !== "undefined" && "supportedValuesOf" in Intl) {
      return Intl.supportedValuesOf("timeZone");
    }
    return [defaultTimezone, "UTC"];
  }, [defaultTimezone]);

  const form = useForm<ProfileOnboardingInput>({
    resolver: zodResolver(profileOnboardingSchema),
    defaultValues: {
      name: defaultName,
      timezone: defaultTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  async function onSubmit(values: ProfileOnboardingInput): Promise<void> {
    setFormError(null);
    const result = await completeOnboarding(values);
    if (result?.error) {
      setFormError(result.error);
    }
  }

  const pending = form.formState.isSubmitting;

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FormError message={formError} />
      <div className="grid gap-2">
        <Label htmlFor="profile-name">Name</Label>
        <Input id="profile-name" autoComplete="name" {...form.register("name")} />
        {form.formState.errors.name ? (
          <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="profile-timezone">Timezone</Label>
        <select
          id="profile-timezone"
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm dark:bg-input/30"
          {...form.register("timezone")}
        >
          {timezones.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
        {form.formState.errors.timezone ? (
          <p className="text-xs text-destructive">{form.formState.errors.timezone.message}</p>
        ) : null}
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? <Loader2Icon className="animate-spin" /> : null}
        Continue to dashboard
      </Button>
    </form>
  );
}
