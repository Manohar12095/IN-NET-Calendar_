import type { SupabaseClient } from "@supabase/supabase-js";
import { dueFieldsToUtc } from "@/lib/tasks/datetime";
import {
  createTaskSchema,
  taskIdSchema,
  updateTaskSchema,
  type CreateTaskInput,
  type UpdateTaskInput,
} from "@/lib/schemas/task";
import type { Database, Task } from "@/types/database";

type DbClient = SupabaseClient<Database>;

export type TaskResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function requireUserId(supabase: DbClient): Promise<TaskResult<string>> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "You must be signed in." };
  }
  return { ok: true, data: user.id };
}

export async function listTasks(
  supabase: DbClient,
  options: { trash?: boolean } = {},
): Promise<TaskResult<Task[]>> {
  const user = await requireUserId(supabase);
  if (!user.ok) {
    return user;
  }

  let query = supabase.from("tasks").select("*").eq("user_id", user.data).order("created_at", {
    ascending: false,
  });
  query = options.trash ? query.not("deleted_at", "is", null) : query.is("deleted_at", null);

  const { data, error } = await query;
  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, data: data ?? [] };
}

export async function createTask(
  supabase: DbClient,
  input: unknown,
  timezone: string,
): Promise<TaskResult<Task>> {
  const user = await requireUserId(supabase);
  if (!user.ok) {
    return user;
  }

  const parsed = createTaskSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid task" };
  }

  const due = dueFieldsToUtc(parsed.data.dueDate, parsed.data.dueTime, timezone);
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: user.data,
      title: parsed.data.title,
      description: parsed.data.description?.trim() ? parsed.data.description : null,
      due_at: due.due_at,
      due_time_set: due.due_time_set,
      urgency: parsed.data.urgency,
      urgency_is_manual: true,
      status: "todo",
    })
    .select("*")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not create task" };
  }
  return { ok: true, data };
}

export async function updateTask(
  supabase: DbClient,
  id: string,
  input: unknown,
  timezone: string,
): Promise<TaskResult<Task>> {
  const user = await requireUserId(supabase);
  if (!user.ok) {
    return user;
  }
  const idParsed = taskIdSchema.safeParse({ id });
  if (!idParsed.success) {
    return { ok: false, error: idParsed.error.issues[0]?.message ?? "Invalid task id" };
  }
  const parsed = updateTaskSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid task" };
  }

  const payload: Database["public"]["Tables"]["tasks"]["Update"] = {};
  if (parsed.data.title !== undefined) payload.title = parsed.data.title;
  if (parsed.data.description !== undefined) {
    payload.description = parsed.data.description.trim() ? parsed.data.description : null;
  }
  if (parsed.data.urgency !== undefined) {
    payload.urgency = parsed.data.urgency;
    payload.urgency_is_manual = true;
  }
  if (parsed.data.dueDate !== undefined || parsed.data.dueTime !== undefined) {
    const due = dueFieldsToUtc(parsed.data.dueDate, parsed.data.dueTime, timezone);
    payload.due_at = due.due_at;
    payload.due_time_set = due.due_time_set;
  }

  const { data, error } = await supabase
    .from("tasks")
    .update(payload)
    .eq("id", idParsed.data.id)
    .eq("user_id", user.data)
    .is("deleted_at", null)
    .select("*")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not update task" };
  }
  return { ok: true, data };
}

export async function completeTask(
  supabase: DbClient,
  id: string,
  completed: boolean,
): Promise<TaskResult<Task>> {
  const user = await requireUserId(supabase);
  if (!user.ok) {
    return user;
  }
  const idParsed = taskIdSchema.safeParse({ id });
  if (!idParsed.success) {
    return { ok: false, error: idParsed.error.issues[0]?.message ?? "Invalid task id" };
  }

  const { data, error } = await supabase
    .from("tasks")
    .update({
      status: completed ? "completed" : "todo",
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq("id", idParsed.data.id)
    .eq("user_id", user.data)
    .is("deleted_at", null)
    .select("*")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not update task" };
  }
  return { ok: true, data };
}

export async function softDeleteTask(supabase: DbClient, id: string): Promise<TaskResult<Task>> {
  const user = await requireUserId(supabase);
  if (!user.ok) {
    return user;
  }
  const idParsed = taskIdSchema.safeParse({ id });
  if (!idParsed.success) {
    return { ok: false, error: idParsed.error.issues[0]?.message ?? "Invalid task id" };
  }

  const { data, error } = await supabase
    .from("tasks")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", idParsed.data.id)
    .eq("user_id", user.data)
    .is("deleted_at", null)
    .select("*")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not delete task" };
  }
  return { ok: true, data };
}

export async function restoreTask(supabase: DbClient, id: string): Promise<TaskResult<Task>> {
  const user = await requireUserId(supabase);
  if (!user.ok) {
    return user;
  }
  const idParsed = taskIdSchema.safeParse({ id });
  if (!idParsed.success) {
    return { ok: false, error: idParsed.error.issues[0]?.message ?? "Invalid task id" };
  }

  const { data, error } = await supabase
    .from("tasks")
    .update({ deleted_at: null })
    .eq("id", idParsed.data.id)
    .eq("user_id", user.data)
    .not("deleted_at", "is", null)
    .select("*")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not restore task" };
  }
  return { ok: true, data };
}

export type { CreateTaskInput, UpdateTaskInput };
