/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function EventPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/events/${eventId}`);
      const json = await res.json();
      setEvent(json.event);
      setImages(json.images || []);
    }

    load();
  }, [eventId]);

  async function handleDelete(imageId: string) {
    const confirmDelete = confirm("Delete this image?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/gallery/${imageId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setImages((prev) => prev.filter((img) => img._id !== imageId));
    } else {
      alert("Delete failed");
    }
  }

  if (!event) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Cover */}
      {event.coverImage && (
        <Image
          src={event.coverImage}
          alt={event.title}
          width={1200}
          height={500}
          className="rounded-lg object-cover"
        />
      )}

      <h1 className="text-2xl font-bold">{event.title}</h1>
      <p className="text-gray-600">{event.description}</p>

      {/* Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img) => (
          <div key={img._id} className="relative">
            <Image
              src={img.imageUrl}
              alt={img.caption}
              width={300}
              height={200}
              className="rounded object-cover"
            />

            {/* 🔥 DELETE BUTTON */}
            <button
              onClick={() => handleDelete(img._id)}
              className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
