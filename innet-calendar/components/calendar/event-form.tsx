"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { eventToFormFields } from "@/lib/events/datetime";
import { eventFormSchema, type EventFormInput } from "@/lib/schemas/event";
import type { Category, EventRow } from "@/types/database";

type EventFormProps = {
  event?: EventRow | null;
  draftDate?: string | null;
  timezone: string;
  categories: Category[];
  submitting: boolean;
  onSubmit: (values: EventFormInput) => Promise<void> | void;
  onCancel: () => void;
  onDelete?: () => void;
};

export function EventForm({
  event,
  draftDate,
  timezone,
  categories,
  submitting,
  onSubmit,
  onCancel,
  onDelete,
}: EventFormProps) {
  const defaults = event
    ? eventToFormFields(event, timezone)
    : {
        title: "",
        description: "",
        location: "",
        allDay: false,
        startDate: draftDate ?? "",
        startTime: "09:00",
        endDate: draftDate ?? "",
        endTime: "10:00",
        categoryId: "",
      };

  const form = useForm<EventFormInput>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: defaults,
  });

  const allDay = form.watch("allDay");

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit((values) => onSubmit(values))} noValidate>
      <div className="grid gap-2">
        <Label htmlFor="event-title">Title</Label>
        <Input id="event-title" autoFocus {...form.register("title")} />
        {form.formState.errors.title ? (
          <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="event-location">Location</Label>
        <Input id="event-location" {...form.register("location")} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="event-description">Description</Label>
        <textarea
          id="event-description"
          rows={3}
          className="min-h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          {...form.register("description")}
        />
      </div>
      <div className="flex items-center justify-between rounded-lg border px-3 py-2">
        <Label htmlFor="event-all-day">All day</Label>
        <Controller
          control={form.control}
          name="allDay"
          render={({ field }) => (
            <Switch id="event-all-day" checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="event-start-date">Start date</Label>
          <Input id="event-start-date" type="date" {...form.register("startDate")} />
        </div>
        {!allDay ? (
          <div className="grid gap-2">
            <Label htmlFor="event-start-time">Start time</Label>
            <Input id="event-start-time" type="time" {...form.register("startTime")} />
          </div>
        ) : (
          <div />
        )}
        <div className="grid gap-2">
          <Label htmlFor="event-end-date">End date</Label>
          <Input id="event-end-date" type="date" {...form.register("endDate")} />
          {form.formState.errors.endDate ? (
            <p className="text-xs text-destructive">{form.formState.errors.endDate.message}</p>
          ) : null}
        </div>
        {!allDay ? (
          <div className="grid gap-2">
            <Label htmlFor="event-end-time">End time</Label>
            <Input id="event-end-time" type="time" {...form.register("endTime")} />
          </div>
        ) : null}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="event-category">Category</Label>
        <select
          id="event-category"
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm dark:bg-input/30"
          {...form.register("categoryId")}
        >
          <option value="">None</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center justify-between gap-2">
        {onDelete ? (
          <Button type="button" variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? <Loader2Icon className="animate-spin" /> : null}
            {event ? "Save" : "Create event"}
          </Button>
        </div>
      </div>
    </form>
  );
}
