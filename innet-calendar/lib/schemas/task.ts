import { z } from "zod";

export const taskUrgencySchema = z.enum(["emergency", "high", "medium", "low"]);
export const taskStatusSchema = z.enum(["todo", "completed"]);

export const taskFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().trim().max(4000, "Description is too long").optional().or(z.literal("")),
  dueDate: z.string().optional().or(z.literal("")),
  dueTime: z.string().optional().or(z.literal("")),
  urgency: taskUrgencySchema,
});

export const createTaskSchema = taskFormSchema;
export const updateTaskSchema = taskFormSchema.partial().extend({
  title: z.string().trim().min(1, "Title is required").max(200, "Title is too long").optional(),
});

export const taskIdSchema = z.object({
  id: z.string().uuid("Invalid task id"),
});

export type TaskUrgency = z.infer<typeof taskUrgencySchema>;
export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type TaskFormInput = z.infer<typeof taskFormSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
