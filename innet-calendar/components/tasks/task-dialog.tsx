"use client";

import { TaskForm } from "@/components/tasks/task-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateTask, useTasksQuery, useUpdateTask } from "@/hooks/use-tasks";
import type { TaskFormInput } from "@/lib/schemas/task";
import { useTaskUiStore } from "@/stores/task-ui-store";

type TaskDialogProps = {
  timezone: string;
};

export function TaskDialog({ timezone }: TaskDialogProps) {
  const dialogOpen = useTaskUiStore((state) => state.dialogOpen);
  const editingTaskId = useTaskUiStore((state) => state.editingTaskId);
  const closeDialog = useTaskUiStore((state) => state.closeDialog);
  const { data: tasks = [] } = useTasksQuery(false);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const editingTask = tasks.find((task) => task.id === editingTaskId) ?? null;

  async function handleSubmit(values: TaskFormInput): Promise<void> {
    if (editingTask) {
      await updateTask.mutateAsync({ id: editingTask.id, input: values });
    } else {
      await createTask.mutateAsync(values);
    }
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
      <DialogContent className="sm:max-w-lg" key={editingTaskId ?? "create"}>
        <DialogHeader>
          <DialogTitle>{editingTask ? "Edit task" : "New task"}</DialogTitle>
          <DialogDescription>
            Dates are stored in UTC and shown in your timezone ({timezone}).
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          task={editingTask}
          timezone={timezone}
          submitting={createTask.isPending || updateTask.isPending}
          onSubmit={handleSubmit}
          onCancel={closeDialog}
        />
      </DialogContent>
    </Dialog>
  );
}
