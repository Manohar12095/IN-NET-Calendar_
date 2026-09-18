"use server";

import {
  completeTask,
  createTask,
  listTasks,
  restoreTask,
  softDeleteTask,
  updateTask,
} from "@/lib/tasks/operations";
import { createClient } from "@/lib/supabase/server";
import type { Task } from "@/types/database";

async function userTimezone(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return "UTC";
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .maybeSingle();
  return profile?.timezone || "UTC";
}

export async function fetchTasksAction(trash = false): Promise<{ data: Task[] } | { error: string }> {
  const supabase = await createClient();
  const result = await listTasks(supabase, { trash });
  if (!result.ok) {
    return { error: result.error };
  }
  return { data: result.data };
}

export async function createTaskAction(input: unknown): Promise<{ data: Task } | { error: string }> {
  const supabase = await createClient();
  const result = await createTask(supabase, input, await userTimezone());
  if (!result.ok) {
    return { error: result.error };
  }
  return { data: result.data };
}

export async function updateTaskAction(
  id: string,
  input: unknown,
): Promise<{ data: Task } | { error: string }> {
  const supabase = await createClient();
  const result = await updateTask(supabase, id, input, await userTimezone());
  if (!result.ok) {
    return { error: result.error };
  }
  return { data: result.data };
}

export async function completeTaskAction(
  id: string,
  completed: boolean,
): Promise<{ data: Task } | { error: string }> {
  const supabase = await createClient();
  const result = await completeTask(supabase, id, completed);
  if (!result.ok) {
    return { error: result.error };
  }
  return { data: result.data };
}

export async function deleteTaskAction(id: string): Promise<{ data: Task } | { error: string }> {
  const supabase = await createClient();
  const result = await softDeleteTask(supabase, id);
  if (!result.ok) {
    return { error: result.error };
  }
  return { data: result.data };
}

export async function restoreTaskAction(id: string): Promise<{ data: Task } | { error: string }> {
  const supabase = await createClient();
  const result = await restoreTask(supabase, id);
  if (!result.ok) {
    return { error: result.error };
  }
  return { data: result.data };
}
