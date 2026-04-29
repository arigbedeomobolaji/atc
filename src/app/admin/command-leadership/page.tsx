/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

function Row({ item, onDelete, onEdit }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 border p-4 rounded-lg bg-white shadow"
    >
      {/* Drag */}
      <div {...attributes} {...listeners} className="cursor-grab">
        ☰
      </div>

      {/* Image */}
      {item.image && (
        <img src={item.image} className="w-14 h-14 rounded object-cover" />
      )}

      {/* Info */}
      <div className="flex-1">
        <p className="font-semibold">
          {item.rank} {item.name}
        </p>
        <p className="text-sm text-gray-500">
          {item.appointment} ({item.appointmentAbbreviation})
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(item._id)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(item._id)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function CommandLeadershipList() {
  const [items, setItems] = useState<any[]>([]);
  const router = useRouter();

  const sensors = useSensors(useSensor(PointerSensor));

  // 🔥 Load
  useEffect(() => {
    fetch("/api/command-leadership")
      .then((res) => res.json())
      .then(setItems);
  }, []);

  // 🔥 Reorder ONLY
  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i._id === active.id);
      const newIndex = items.findIndex((i) => i._id === over.id);

      const reordered = arrayMove(items, oldIndex, newIndex).map(
        (item, index) => ({
          ...item,
          order: index,
        })
      );

      setItems(reordered);

      fetch("/api/command-leadership/reorder", {
        method: "POST",
        body: JSON.stringify(reordered),
      });
    }
  }

  // 🔥 Delete
  async function handleDelete(id: string) {
    const ok = confirm("Delete this officer?");
    if (!ok) return;

    await fetch(`/api/command-leadership/${id}`, {
      method: "DELETE",
    });

    setItems((prev) => prev.filter((i) => i._id !== id));
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">HQ ATC Leadership</h1>

        <button
          onClick={() => router.push("/admin/command-leadership/create")}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Leader
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {items.map((item) => (
              <Row
                key={item._id}
                item={item}
                onDelete={handleDelete}
                onEdit={(id: string) =>
                  router.push(`/admin/command-leadership/${id}/edit`)
                }
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
