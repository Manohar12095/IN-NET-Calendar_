"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { UrgencySelector } from "@/components/tasks/urgency-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { taskFormSchema, type TaskFormInput } from "@/lib/schemas/task";
import { utcToDueFields } from "@/lib/tasks/datetime";
import type { Task } from "@/types/database";

type TaskFormProps = {
  task?: Task | null;
  timezone: string;
  submitting: boolean;
  onSubmit: (values: TaskFormInput) => Promise<void> | void;
  onCancel: () => void;
};

export function TaskForm({ task, timezone, submitting, onSubmit, onCancel }: TaskFormProps) {
  const due = utcToDueFields(task?.due_at ?? null, task?.due_time_set ?? false, timezone);
  const form = useForm<TaskFormInput>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      dueDate: due.dueDate,
      dueTime: due.dueTime,
      urgency: (task?.urgency as TaskFormInput["urgency"]) ?? "medium",
    },
  });

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit((values) => onSubmit(values))} noValidate>
      <div className="grid gap-2">
        <Label htmlFor="task-title">Title</Label>
        <Input id="task-title" autoFocus {...form.register("title")} />
        {form.formState.errors.title ? (
          <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="task-description">Description</Label>
        <textarea
          id="task-description"
          rows={3}
          className="min-h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          {...form.register("description")}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="task-due-date">Due date</Label>
          <Input id="task-due-date" type="date" {...form.register("dueDate")} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="task-due-time">Due time</Label>
          <Input id="task-due-time" type="time" {...form.register("dueTime")} />
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Urgency</Label>
        <Controller
          control={form.control}
          name="urgency"
          render={({ field }) => <UrgencySelector value={field.value} onChange={field.onChange} />}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? <Loader2Icon className="animate-spin" /> : null}
          {task ? "Save changes" : "Create task"}
        </Button>
      </div>
    </form>
  );
}
