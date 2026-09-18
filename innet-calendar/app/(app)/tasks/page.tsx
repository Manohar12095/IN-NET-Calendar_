export default function TasksPlaceholderPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Phase 2 adds full task CRUD, four-level urgency, optimistic updates, and the shared Zod
        schema in `lib/schemas/task.ts`.
      </p>
    </div>
  );
}
