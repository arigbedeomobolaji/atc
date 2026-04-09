/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";

type Unit = {
  _id: string;
  unit: string;
};

export default function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scope, setScope] = useState("COMMAND");
  const [unitId, setUnitId] = useState("");
  const [category, setCategory] = useState("CEREMONY");
  const [units, setUnits] = useState([]);

  useEffect(() => {
    fetch("/api/units")
      .then((res) => res.json())
      .then(setUnits);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/events", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        scope,
        unitId: scope === "UNIT" ? unitId : null,
        category,
      }),
    });

    const json = await res.json();

    if (res.ok) {
      alert("Event created ✅");
    } else {
      alert(json.error);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h4 className="text-xl font-semibold mb-6">Create Event</h4>

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
          value={scope}
          onChange={(e) => setScope(e.target.value)}
        >
          <option value="COMMAND">Command</option>
          <option value="UNIT">Unit</option>
        </select>

        {scope === "UNIT" && (
          <select
            className="w-full p-3 border rounded"
            value={unitId}
            onChange={(e) => setUnitId(e.target.value)}
          >
            <option value="">Select Unit</option>
            {units.map((u: any) => (
              <option key={u._id} value={u._id}>
                {u.unit}
              </option>
            ))}
          </select>
        )}

        <select
          className="w-full p-3 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="CEREMONY">Ceremony</option>
          <option value="EXERCISE">Exercise</option>
          <option value="TRAINING">Training</option>
          <option value="EVENT">Event</option>
        </select>

        <button className="bg-blue-600 text-white p-3 rounded w-full">
          Create Event
        </button>
      </form>
    </div>
  );
}
