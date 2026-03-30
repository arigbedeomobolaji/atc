"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditEventPage() {
  const { eventId } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/events/${eventId}`);
      const json = await res.json();

      setTitle(json.event.title);
      setDescription(json.event.description);
    }

    load();
  }, [eventId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`/api/events/${eventId}`, {
      method: "PUT",
      body: JSON.stringify({ title, description }),
    });

    if (res.ok) {
      router.push("/admin/events");
    } else {
      alert("Update failed");
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Event</h2>

      <form onSubmit={handleSave} className="space-y-4">
        <input
          className="w-full p-3 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full p-3 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="bg-blue-600 text-white p-3 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}
