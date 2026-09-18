import { z } from "zod";

export const eventFormSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(200, "Title is too long"),
    description: z.string().trim().max(4000).optional().or(z.literal("")),
    location: z.string().trim().max(200).optional().or(z.literal("")),
    allDay: z.boolean(),
    startDate: z.string().min(1, "Start date is required"),
    startTime: z.string().optional().or(z.literal("")),
    endDate: z.string().min(1, "End date is required"),
    endTime: z.string().optional().or(z.literal("")),
    categoryId: z.string().optional().or(z.literal("")),
  })
  .superRefine((value, ctx) => {
    if (!value.allDay && !value.startTime) {
      ctx.addIssue({ code: "custom", path: ["startTime"], message: "Start time is required" });
    }
    if (!value.allDay && !value.endTime) {
      ctx.addIssue({ code: "custom", path: ["endTime"], message: "End time is required" });
    }
    const start = value.allDay
      ? value.startDate
      : `${value.startDate}T${value.startTime || "00:00"}`;
    const end = value.allDay ? value.endDate : `${value.endDate}T${value.endTime || "00:00"}`;
    if (end < start) {
      ctx.addIssue({ code: "custom", path: ["endDate"], message: "End must be after start" });
    }
  });

export const eventIdSchema = z.object({
  id: z.string().uuid("Invalid event id"),
});

export type EventFormInput = z.infer<typeof eventFormSchema>;
