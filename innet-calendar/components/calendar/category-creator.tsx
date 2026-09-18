"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateCategory } from "@/hooks/use-events";
import { CATEGORY_COLORS } from "@/lib/schemas/category";

export function CategoryCreator() {
  const createCategory = useCreateCategory();
  const [name, setName] = useState("");
  const [color, setColor] = useState<string>(CATEGORY_COLORS[5]);

  async function onAdd(): Promise<void> {
    if (!name.trim()) {
      return;
    }
    await createCategory.mutateAsync({ name: name.trim(), color });
    setName("");
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="New category"
        className="w-40"
      />
      <div className="flex gap-1">
        {CATEGORY_COLORS.map((item) => (
          <button
            key={item}
            type="button"
            aria-label={`Color ${item}`}
            onClick={() => setColor(item)}
            className="size-5 rounded-full border"
            style={{
              backgroundColor: item,
              outline: color === item ? "2px solid currentColor" : undefined,
            }}
          />
        ))}
      </div>
      <Button type="button" size="sm" variant="outline" onClick={() => void onAdd()} disabled={createCategory.isPending}>
        Add category
      </Button>
    </div>
  );
}
