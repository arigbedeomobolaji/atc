import { useEffect, useState } from "react";
import {
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { toast } from "sonner";

interface SortableItem {
  _id: string;
  order?: number;
}

interface Options {
  fetchUrl: string;
  reorderUrl: string;
  deleteUrl: (id: string) => string;
  deleteConfirmMessage?: string;
}

export function useSortableList<T extends SortableItem>({
  fetchUrl,
  reorderUrl,
  deleteUrl,
  deleteConfirmMessage = "Delete this item?",
}: Options) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetch(fetchUrl)
      .then((r) => r.json())
      .then((data) => {
        const normalised = (Array.isArray(data) ? data : []).map(
          (item: T, i: number) => ({ ...item, order: item.order ?? i })
        );
        setItems(normalised);
      })
      .catch(() => toast.error("Failed to load items"))
      .finally(() => setLoading(false));
  }, [fetchUrl]);

  function handleDragStart(event: { active: { id: string | number } }) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIdx = prev.findIndex((i) => i._id === active.id);
      const newIdx = prev.findIndex((i) => i._id === over.id);
      const reordered = arrayMove(prev, oldIdx, newIdx).map((item, idx) => ({
        ...item,
        order: idx,
      }));

      fetch(reorderUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reordered.map(({ _id, order }) => ({ _id, order }))),
      })
        .then((r) => { if (!r.ok) throw new Error(); })
        .catch(() => toast.error("Failed to save order"));

      return reordered;
    });
  }

  async function handleDelete(id: string) {
    if (!confirm(deleteConfirmMessage)) return;
    const res = await fetch(deleteUrl(id), { method: "DELETE" });
    if (!res.ok) { toast.error("Failed to delete"); return; }
    setItems((prev) => prev.filter((i) => i._id !== id));
    toast.success("Deleted");
  }

  const activeItem = activeId ? items.find((i) => i._id === activeId) ?? null : null;

  return { items, loading, sensors, activeId, activeItem, handleDragStart, handleDragEnd, handleDelete };
}
