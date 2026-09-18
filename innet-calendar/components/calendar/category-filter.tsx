"use client";

import { CATEGORY_COLORS } from "@/lib/schemas/category";
import { cn } from "@/lib/utils";
import { useCalendarUiStore } from "@/stores/calendar-ui-store";
import type { Category } from "@/types/database";

type CategoryFilterProps = {
  categories: Category[];
};

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const categoryFilter = useCalendarUiStore((state) => state.categoryFilter);
  const setCategoryFilter = useCalendarUiStore((state) => state.setCategoryFilter);

  return (
    <div className="flex flex-wrap gap-2" aria-label="Filter by category">
      <FilterChip
        label="All"
        selected={categoryFilter === "all"}
        onClick={() => setCategoryFilter("all")}
      />
      {categories.map((category) => (
        <FilterChip
          key={category.id}
          label={category.name}
          color={category.color}
          selected={categoryFilter === category.id}
          onClick={() => setCategoryFilter(category.id)}
        />
      ))}
    </div>
  );
}

type FilterChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  color?: string;
};

function FilterChip({ label, selected, onClick, color }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-2.5 py-1 text-xs font-medium",
        selected ? "bg-foreground text-background" : "bg-background text-foreground",
      )}
    >
      {color ? (
        <span className="mr-1.5 inline-block size-2 rounded-full" style={{ backgroundColor: color }} />
      ) : null}
      {label}
    </button>
  );
}

export { CATEGORY_COLORS };
