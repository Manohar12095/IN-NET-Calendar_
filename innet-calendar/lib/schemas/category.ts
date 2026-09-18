import { z } from "zod";

export const CATEGORY_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
] as const;

export const categoryFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(40, "Name is too long"),
  color: z.string().regex(/^#([0-9a-fA-F]{6})$/, "Pick a color"),
});

export const categoryIdSchema = z.object({
  id: z.string().uuid("Invalid category id"),
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
