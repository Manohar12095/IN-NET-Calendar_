"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createCategoryAction,
  createEventAction,
  deleteCategoryAction,
  deleteEventAction,
  fetchCategoriesAction,
  fetchEventsAction,
  updateEventAction,
} from "@/lib/actions/events";
import type { CategoryFormInput } from "@/lib/schemas/category";
import type { EventFormInput } from "@/lib/schemas/event";
import type { Category, EventRow } from "@/types/database";

export const EVENTS_QUERY_KEY = ["events"] as const;
export const CATEGORIES_QUERY_KEY = ["categories"] as const;

export function useEventsQuery() {
  return useQuery({
    queryKey: EVENTS_QUERY_KEY,
    queryFn: async (): Promise<EventRow[]> => {
      const result = await fetchEventsAction();
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: async (): Promise<Category[]> => {
      const result = await fetchCategoriesAction();
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: EventFormInput) => {
      const result = await createEventAction(input);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (event) => {
      queryClient.setQueryData<EventRow[]>(EVENTS_QUERY_KEY, (current) => [...(current ?? []), event]);
      toast.success("Event created");
    },
    onError: (error: Error) => toast.error(error.message),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: EventFormInput }) => {
      const result = await updateEventAction(id, input);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (event) => {
      queryClient.setQueryData<EventRow[]>(EVENTS_QUERY_KEY, (current) =>
        (current ?? []).map((item) => (item.id === event.id ? event : item)),
      );
      toast.success("Event updated");
    },
    onError: (error: Error) => toast.error(error.message),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteEventAction(id);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: EVENTS_QUERY_KEY });
      const previous = queryClient.getQueryData<EventRow[]>(EVENTS_QUERY_KEY);
      queryClient.setQueryData<EventRow[]>(EVENTS_QUERY_KEY, (current) =>
        (current ?? []).filter((event) => event.id !== id),
      );
      return { previous };
    },
    onError: (error: Error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(EVENTS_QUERY_KEY, context.previous);
      }
      toast.error(error.message);
    },
    onSuccess: () => toast.success("Event deleted"),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CategoryFormInput) => {
      const result = await createCategoryAction(input);
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (category) => {
      queryClient.setQueryData<Category[]>(CATEGORIES_QUERY_KEY, (current) => [
        ...(current ?? []),
        category,
      ]);
      toast.success("Category added");
    },
    onError: (error: Error) => toast.error(error.message),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteCategoryAction(id);
      if (result.error) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
