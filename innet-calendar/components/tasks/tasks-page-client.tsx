"use client";

import { PlusIcon } from "lucide-react";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { TaskList } from "@/components/tasks/task-list";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCompleteTask,
  useDeleteTask,
  useRestoreTask,
  useTasksQuery,
} from "@/hooks/use-tasks";
import { todayTasks } from "@/lib/tasks/selectors";
import { useTaskUiStore } from "@/stores/task-ui-store";
import type { Task } from "@/types/database";

type TasksPageClientProps = {
  timezone: string;
  timeFormat: string;
};

export function TasksPageClient({ timezone, timeFormat }: TasksPageClientProps) {
  const openCreate = useTaskUiStore((state) => state.openCreate);
  const { data: tasks = [], isLoading } = useTasksQuery(false);
  const { data: trash = [], isLoading: trashLoading } = useTasksQuery(true);
  const completeTask = useCompleteTask();
  const deleteTask = useDeleteTask();
  const restoreTask = useRestoreTask();

  function onComplete(task: Task, completed: boolean): void {
    completeTask.mutate({ id: task.id, completed });
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Create, complete, edit, and trash tasks. Urgency is user-chosen in this phase.
          </p>
        </div>
        <Button type="button" onClick={openCreate}>
          <PlusIcon />
          Add task
        </Button>
      </div>
      <Tabs defaultValue="today">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="trash">Trash</TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="mt-4">
          <TaskList
            tasks={todayTasks(tasks, timezone)}
            timezone={timezone}
            timeFormat={timeFormat}
            loading={isLoading}
            emptyTitle="Nothing on today"
            emptyBody="Add a task due today, or an overdue item will appear here until you complete it."
            onComplete={onComplete}
            onDelete={(task) => deleteTask.mutate(task.id)}
          />
        </TabsContent>
        <TabsContent value="all" className="mt-4">
          <TaskList
            tasks={tasks}
            timezone={timezone}
            timeFormat={timeFormat}
            loading={isLoading}
            emptyTitle="No tasks yet"
            emptyBody="Create your first task. It is stored in Supabase with your user id."
            onComplete={onComplete}
            onDelete={(task) => deleteTask.mutate(task.id)}
          />
        </TabsContent>
        <TabsContent value="trash" className="mt-4">
          <TaskList
            tasks={trash}
            timezone={timezone}
            timeFormat={timeFormat}
            loading={trashLoading}
            emptyTitle="Trash is empty"
            emptyBody="Soft-deleted tasks land here so you can restore them."
            onComplete={onComplete}
            onRestore={(task) => restoreTask.mutate(task.id)}
          />
        </TabsContent>
      </Tabs>
      <TaskDialog timezone={timezone} />
    </div>
  );
}
