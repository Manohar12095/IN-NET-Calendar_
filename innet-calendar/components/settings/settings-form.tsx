"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, type SelectHTMLAttributes } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormError } from "@/components/auth/form-error";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updatePreferences } from "@/lib/actions/account";
import {
  settingsPreferencesSchema,
  type SettingsPreferencesInput,
} from "@/lib/schemas/settings";

type SettingsFormProps = {
  defaults: Required<
    Pick<
      SettingsPreferencesInput,
      "theme" | "week_start" | "time_format" | "default_view" | "reduced_motion"
    >
  >;
};

export function SettingsForm({ defaults }: SettingsFormProps) {
  const { setTheme } = useTheme();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<SettingsPreferencesInput>({
    resolver: zodResolver(settingsPreferencesSchema),
    defaultValues: defaults,
  });

  async function onSubmit(values: SettingsPreferencesInput): Promise<void> {
    setFormError(null);
    if (values.theme) {
      setTheme(values.theme);
    }
    const result = await updatePreferences(values);
    if ("error" in result) {
      setFormError(result.error);
      return;
    }
    toast.success("Settings saved");
  }

  const pending = form.formState.isSubmitting;

  return (
    <form className="grid max-w-lg gap-5" onSubmit={form.handleSubmit(onSubmit)}>
      <FormError message={formError} />
      <FieldSelect
        id="theme"
        label="Theme"
        {...form.register("theme")}
        options={[
          { value: "system", label: "System" },
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
        ]}
      />
      <FieldSelect
        id="week_start"
        label="Week starts on"
        {...form.register("week_start")}
        options={[
          { value: "monday", label: "Monday" },
          { value: "sunday", label: "Sunday" },
        ]}
      />
      <FieldSelect
        id="time_format"
        label="Time format"
        {...form.register("time_format")}
        options={[
          { value: "24h", label: "24-hour" },
          { value: "12h", label: "12-hour" },
        ]}
      />
      <FieldSelect
        id="default_view"
        label="Default calendar view"
        {...form.register("default_view")}
        options={[
          { value: "month", label: "Month" },
          { value: "week", label: "Week" },
          { value: "day", label: "Day" },
          { value: "agenda", label: "Agenda" },
        ]}
      />
      <div className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2">
        <div>
          <Label htmlFor="reduced_motion">Reduced motion</Label>
          <p className="text-xs text-muted-foreground">Skip 3D scenes and extra animation.</p>
        </div>
        <Controller
          control={form.control}
          name="reduced_motion"
          render={({ field }) => (
            <Switch
              id="reduced_motion"
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>
      <Button type="submit" className="w-fit" disabled={pending}>
        {pending ? <Loader2Icon className="animate-spin" /> : null}
        Save settings
      </Button>
    </form>
  );
}

type FieldSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: { value: string; label: string }[];
};

function FieldSelect({ id, label, options, ...props }: FieldSelectProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm dark:bg-input/30"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
