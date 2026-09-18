"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  completeTaskAction,
  createTaskAction,
  deleteTaskAction,
  fetchTasksAction,
  restoreTaskAction,
  updateTaskAction,
} from "@/lib/actions/tasks";
import type { TaskFormInput } from "@/lib/schemas/task";
import type { Task } from "@/types/database";

export const TASKS_QUERY_KEY = ["tasks"] as const;
export const TRASH_QUERY_KEY = ["tasks", "trash"] as const;

function readError(result: { error?: string }): string {
  return result.error ?? "Something went wrong";
}

export function useTasksQuery(trash = false) {
  return useQuery({
    queryKey: trash ? TRASH_QUERY_KEY : TASKS_QUERY_KEY,
    queryFn: async (): Promise<Task[]> => {
      const result = await fetchTasksAction(trash);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: TaskFormInput) => {
      const result = await createTaskAction(input);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (task) => {
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (current) => [task, ...(current ?? [])]);
      toast.success("Task created");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: TaskFormInput }) => {
      const result = await updateTaskAction(id, input);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const previous = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY);
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (current) =>
        (current ?? []).map((task) =>
          task.id === id
            ? {
                ...task,
                title: input.title,
                description: input.description?.trim() ? input.description : null,
                urgency: input.urgency,
                urgency_is_manual: true,
              }
            : task,
        ),
      );
      return { previous };
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previous);
      }
      toast.error(error.message);
    },
    onSuccess: (task) => {
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (current) =>
        (current ?? []).map((item) => (item.id === task.id ? task : item)),
      );
      toast.success("Task updated");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const result = await completeTaskAction(id, completed);
      if ("error" in result) {
        throw new Error(readError(result));
      }
      return result.data;
    },
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const previous = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY);
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (current) =>
        (current ?? []).map((task) =>
          task.id === id
            ? {
                ...task,
                status: completed ? "completed" : "todo",
                completed_at: completed ? new Date().toISOString() : null,
              }
            : task,
        ),
      );
      return { previous };
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previous);
      }
      toast.error(error.message);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteTaskAction(id);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const previous = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY);
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (current) =>
        (current ?? []).filter((task) => task.id !== id),
      );
      return { previous };
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previous);
      }
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Moved to trash");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: TRASH_QUERY_KEY });
    },
  });
}

export function useRestoreTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await restoreTaskAction(id);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TRASH_QUERY_KEY });
      const previous = queryClient.getQueryData<Task[]>(TRASH_QUERY_KEY);
      queryClient.setQueryData<Task[]>(TRASH_QUERY_KEY, (current) =>
        (current ?? []).filter((task) => task.id !== id),
      );
      return { previous };
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(TRASH_QUERY_KEY, context.previous);
      }
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Task restored");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: TRASH_QUERY_KEY });
    },
  });
}
