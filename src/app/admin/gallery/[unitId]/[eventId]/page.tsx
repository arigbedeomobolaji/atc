/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EventGalleryPage() {
  const { eventId } = useParams();

  const [images, setImages] = useState<any[]>([]);
  const [galleryId, setGalleryId] = useState("");
  const [loading, setLoading] = useState(true);

  const [caption, setCaption] = useState("");
  const [editing, setEditing] = useState(false);
  const [newCaption, setNewCaption] = useState("");

  // =========================
  // 🔥 LOAD IMAGES
  // =========================
  async function loadImages() {
    try {
      const res = await fetch(`/api/events/${eventId}/gallery`);
      const data = await res.json();

      if (data && data.images) {
        setImages(data.images);
        setGalleryId(data._id);
        setGalleryId(data._id);
        setCaption(data.caption || "");
        setNewCaption(data.caption || "");
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!eventId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/events/${eventId}/gallery`);
        const data = await res.json();

        if (data && data.images) {
          setImages(data.images);
          setGalleryId(data._id);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [eventId]);

  // =========================
  // 🔥 DELETE IMAGE
  // =========================
  async function handleDelete(publicId: string) {
    const confirmDelete = confirm("Delete this image?");
    if (!confirmDelete) return;

    const res = await fetch("/api/gallery/delete-image", {
      method: "POST",
      body: JSON.stringify({
        galleryId,
        publicId,
      }),
    });

    if (res.ok) {
      loadImages(); // 🔥 refresh UI
    } else {
      alert("Delete failed");
    }
  }

  async function handleUpdateCaption() {
    const res = await fetch("/api/gallery/update-caption", {
      method: "PATCH",
      body: JSON.stringify({
        galleryId,
        caption: newCaption,
      }),
    });

    if (res.ok) {
      setCaption(newCaption);
      setEditing(false);
    } else {
      alert("Failed to update caption");
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h4 className="text-xl font-bold mb-6">Event Gallery</h4>
      <div className="mb-6">
        {!editing ? (
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">{caption || "No caption"}</h4>
            <button
              onClick={() => setEditing(true)}
              className="text-sm bg-gray-200 px-3 py-1 rounded"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <button
              onClick={handleUpdateCaption}
              className="bg-blue-600 text-white px-3 rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setNewCaption(caption);
              }}
              className="bg-gray-300 px-3 rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      {/* ========================= */}
      {/* 🔥 IMAGE GRID */}
      {/* ========================= */}
      {images.length === 0 ? (
        <p>No images yet</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img: any) => (
            <div key={img.publicId} className="relative">
              <img src={img.url} className="w-full h-40 object-cover rounded" />

              {/* 🔥 DELETE BUTTON */}
              <button
                onClick={() => handleDelete(img.publicId)}
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
