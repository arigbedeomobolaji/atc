"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Event = {
  _id: string;
  title: string;
  category: string;
};

export default function UnitGalleryPage() {
  const { unitId } = useParams();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch(`/api/events?unitId=${unitId}`)
      .then((res) => res.json())
      .then(setEvents);
  }, [unitId]);

  console.log({ events, unitId });

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h4 className="text-2xl font-bold">Unit Gallery</h4>

        <Link
          href={`/admin/gallery/${unitId}/create-event`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Create Event
        </Link>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event._id}
            className="p-4 bg-white rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <h4 className="font-semibold">{event.title}</h4>
              <p className="text-sm text-gray-500">{event.category}</p>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/admin/gallery/${unitId}/${event._id}/upload`}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Upload
              </Link>

              <Link
                href={`/admin/gallery/${unitId}/${event._id}`}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Manage
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
