"use client";

import { EventForm } from "@/components/calendar/event-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateEvent, useDeleteEvent, useEventsQuery, useUpdateEvent } from "@/hooks/use-events";
import type { EventFormInput } from "@/lib/schemas/event";
import { useCalendarUiStore } from "@/stores/calendar-ui-store";
import type { Category } from "@/types/database";

type EventDialogProps = {
  timezone: string;
  categories: Category[];
};

export function EventDialog({ timezone, categories }: EventDialogProps) {
  const dialogOpen = useCalendarUiStore((state) => state.dialogOpen);
  const editingEventId = useCalendarUiStore((state) => state.editingEventId);
  const draftDate = useCalendarUiStore((state) => state.draftDate);
  const closeDialog = useCalendarUiStore((state) => state.closeDialog);
  const { data: events = [] } = useEventsQuery();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const editing = events.find((event) => event.id === editingEventId) ?? null;

  async function onSubmit(values: EventFormInput): Promise<void> {
    if (editing) {
      await updateEvent.mutateAsync({ id: editing.id, input: values });
    } else {
      await createEvent.mutateAsync(values);
    }
    closeDialog();
  }

  async function onDelete(): Promise<void> {
    if (!editing) {
      return;
    }
    await deleteEvent.mutateAsync(editing.id);
    closeDialog();
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeDialog();
        }
      }}
    >
      <DialogContent className="sm:max-w-lg" key={editingEventId ?? draftDate ?? "create"}>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit event" : "New event"}</DialogTitle>
          <DialogDescription>
            Month, week, day, and agenda all read this same events list.
          </DialogDescription>
        </DialogHeader>
        <EventForm
          event={editing}
          draftDate={draftDate}
          timezone={timezone}
          categories={categories}
          submitting={createEvent.isPending || updateEvent.isPending}
          onSubmit={onSubmit}
          onCancel={closeDialog}
          onDelete={editing ? () => void onDelete() : undefined}
        />
      </DialogContent>
    </Dialog>
  );
}
