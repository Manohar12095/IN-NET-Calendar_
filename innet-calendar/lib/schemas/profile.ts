import { z } from "zod";

export const profileOnboardingSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80, "Name is too long"),
  timezone: z.string().min(1, "Timezone is required"),
});

export type ProfileOnboardingInput = z.infer<typeof profileOnboardingSchema>;
