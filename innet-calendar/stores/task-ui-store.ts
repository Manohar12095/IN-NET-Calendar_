import { create } from "zustand";

type TaskUiState = {
  dialogOpen: boolean;
  editingTaskId: string | null;
  openCreate: () => void;
  openEdit: (taskId: string) => void;
  closeDialog: () => void;
};

export const useTaskUiStore = create<TaskUiState>((set) => ({
  dialogOpen: false,
  editingTaskId: null,
  openCreate: () => set({ dialogOpen: true, editingTaskId: null }),
  openEdit: (taskId) => set({ dialogOpen: true, editingTaskId: taskId }),
  closeDialog: () => set({ dialogOpen: false, editingTaskId: null }),
}));
