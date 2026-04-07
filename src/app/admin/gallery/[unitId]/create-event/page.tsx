"use client";

// /Users/mac/omobolaji/atc/src/app/admin/gallery/[unitId]/create-event/page.tsx

import { useState } from "react";
import { useParams } from "next/navigation";

export default function CreateEventPage() {
  const { unitId } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("CEREMONY");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/events", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        scope: "UNIT",
        unitId,
        category,
      }),
    });

    if (res.ok) {
      alert("Event created ✅");
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Event</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-3 border rounded"
          placeholder="Event title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full p-3 border rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="w-full p-3 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="CEREMONY">Ceremony</option>
          <option value="TRAINING">Training</option>
          <option value="EXERCISE">Exercise</option>
          <option value="EVENT">Event</option>
        </select>

        <button className="bg-blue-600 text-white p-3 rounded w-full">
          Create Event
        </button>
      </form>
    </div>
  );
}
