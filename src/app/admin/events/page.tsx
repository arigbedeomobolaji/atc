/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Event = {
  _id: string;
  title: string;
  category: string;
  scope: string;
  createdAt: string;
};

export default function EventsAdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadEvents() {
    const res = await fetch("/api/events");
    const data = await res.json();
    setEvents(data);
    setLoading(false);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleDelete(id: string) {
    const confirmDelete = confirm("Delete this event?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/events/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } else {
      alert("Delete failed");
    }
  }

  if (loading) return <div className="p-6">Loading events...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-bold">Events</h1>

        <Link
          href="/admin/events/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create Event
        </Link>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event._id}
            className="p-4 bg-white rounded shadow flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{event.title}</h2>
              <p className="text-sm text-gray-500">
                {event.category} • {event.scope}
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/events/${event._id}`}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                View
              </Link>

              <Link
                href={`/admin/events/${event._id}/edit`}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </Link>

              <Link
                href={`/admin/events/${event._id}/upload`}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Upload
              </Link>

              <button
                onClick={() => handleDelete(event._id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
