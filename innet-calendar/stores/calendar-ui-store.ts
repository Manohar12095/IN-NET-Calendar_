import { format } from "date-fns";
import { create } from "zustand";

export type CalendarView = "month" | "week" | "day" | "agenda";

type CalendarUiState = {
  view: CalendarView;
  cursorDate: string;
  categoryFilter: string;
  dialogOpen: boolean;
  editingEventId: string | null;
  draftDate: string | null;
  setView: (view: CalendarView) => void;
  setCursorDate: (date: string) => void;
  setCategoryFilter: (id: string) => void;
  openCreate: (date?: string) => void;
  openEdit: (eventId: string) => void;
  closeDialog: () => void;
};

export function todayIso(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export const useCalendarUiStore = create<CalendarUiState>((set) => ({
  view: "month",
  cursorDate: todayIso(),
  categoryFilter: "all",
  dialogOpen: false,
  editingEventId: null,
  draftDate: null,
  setView: (view) => set({ view }),
  setCursorDate: (date) => set({ cursorDate: date }),
  setCategoryFilter: (id) => set({ categoryFilter: id }),
  openCreate: (date) =>
    set({
      dialogOpen: true,
      editingEventId: null,
      draftDate: date ?? todayIso(),
    }),
  openEdit: (eventId) => set({ dialogOpen: true, editingEventId: eventId, draftDate: null }),
  closeDialog: () => set({ dialogOpen: false, editingEventId: null, draftDate: null }),
}));
