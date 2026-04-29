/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";

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

function SortableItem({ item, onChange, onDelete }: any) {
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
      className="border rounded-lg p-4 bg-white shadow flex gap-4 items-center"
    >
      {/* Drag Handle */}
      <div {...attributes} {...listeners} className="cursor-grab text-gray-400">
        ☰
      </div>

      {/* Image */}
      {item.image && (
        <img src={item.image} className="w-16 h-16 object-cover rounded" />
      )}

      {/* Fields */}
      <div className="flex-1 space-y-2">
        <div className="flex-1 space-y-2">
          <input
            value={item.name}
            onChange={(e) => onChange(item._id, "name", e.target.value)}
            placeholder="Full Name"
            className="border p-2 w-full rounded"
          />

          <input
            value={item.rank}
            onChange={(e) => onChange(item._id, "rank", e.target.value)}
            placeholder="Rank (e.g Air Vice Marshal)"
            className="border p-2 w-full rounded"
          />

          <input
            value={item.appointment}
            onChange={(e) => onChange(item._id, "appointment", e.target.value)}
            placeholder="Appointment (e.g Air Officer Commanding)"
            className="border p-2 w-full rounded"
          />

          <input
            value={item.appointmentAbbreviation}
            onChange={(e) =>
              onChange(item._id, "appointmentAbbreviation", e.target.value)
            }
            placeholder="Abbreviation (AOC, COS...)"
            className="border p-2 w-full rounded"
          />

          <textarea
            value={item.bio || ""}
            onChange={(e) => onChange(item._id, "bio", e.target.value)}
            placeholder="Biography"
            className="border p-2 w-full rounded"
          />

          <input
            value={item.awards || ""}
            onChange={(e) => onChange(item._id, "awards", e.target.value)}
            placeholder="Awards (comma separated)"
            className="border p-2 w-full rounded"
          />
        </div>

        <input
          type="file"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const fd = new FormData();
            fd.append("file", file);

            await fetch(`/api/command-leadership/${item._id}/upload-image`, {
              method: "POST",
              body: fd,
            });

            window.location.reload(); // quick refresh
          }}
        />
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(item._id)}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        X
      </button>
    </div>
  );
}

export default function CommandLeadershipEditor() {
  const [items, setItems] = useState<any[]>([]);

  const sensors = useSensors(useSensor(PointerSensor));

  // 🔥 Load data
  useEffect(() => {
    fetch("/api/command-leadership")
      .then((res) => res.json())
      .then(setItems);
  }, []);

  // 🔥 Drag End
  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i._id === active.id);
      const newIndex = items.findIndex((i) => i._id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex).map(
        (item, index) => ({
          ...item,
          order: index,
        })
      );

      setItems(newItems);

      // 🔥 Save order to backend
      fetch("/api/command-leadership/reorder", {
        method: "POST",
        body: JSON.stringify(newItems),
      });
    }
  }

  // 🔥 Update field
  function updateItem(id: string, key: string, value: string) {
    setItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, [key]: value } : item))
    );
  }

  // 🔥 Delete
  async function deleteItem(id: string) {
    await fetch(`/api/command-leadership/${id}`, {
      method: "DELETE",
    });

    setItems((prev) => prev.filter((i) => i._id !== id));
  }

  // 🔥 Add new
  async function addItem() {
    const res = await fetch("/api/command-leadership", {
      method: "POST",
      body: JSON.stringify({
        name: "",
        title: "",
        order: items.length,
      }),
    });

    const data = await res.json();

    setItems([...items, { _id: data.id, name: "", title: "" }]);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">HQ ATC Leadership</h2>

      <button onClick={addItem} className="bg-gray-200 px-3 py-2 rounded">
        + Add Appointment
      </button>

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
              <SortableItem
                key={item._id}
                item={item}
                onChange={updateItem}
                onDelete={deleteItem}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
