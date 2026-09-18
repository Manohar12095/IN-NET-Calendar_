import { z } from "zod";

export const settingsThemeSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
});

export const settingsPreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),
  week_start: z.enum(["monday", "sunday"]).optional(),
  time_format: z.enum(["12h", "24h"]).optional(),
  default_view: z.enum(["month", "week", "day", "agenda"]).optional(),
  reduced_motion: z.boolean().optional(),
});

export type SettingsThemeInput = z.infer<typeof settingsThemeSchema>;
export type SettingsPreferencesInput = z.infer<typeof settingsPreferencesSchema>;
