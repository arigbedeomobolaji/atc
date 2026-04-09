/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// src/app/admin/gallery/upload/page.tsx

import { useEffect, useState } from "react";

type Unit = {
  _id: string;
  unit: string;
};

export default function UploadGalleryPage() {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("EVENT");
  const [scope, setScope] = useState("COMMAND");
  const [unitId, setUnitId] = useState("");
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");

  // Fetch units
  useEffect(() => {
    fetch("/api/units")
      .then((res) => res.json())
      .then((data) => setUnits(data));
  }, []);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setEvents(data);
      });
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      alert("Please select an image");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);
    formData.append("category", category);
    formData.append("scope", scope);

    if (scope === "UNIT") {
      formData.append("unitId", unitId);
    }

    if (eventId) {
      formData.append("eventId", eventId);
    }

    const res = await fetch("/api/gallery/upload", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    setLoading(false);

    if (res.ok) {
      alert("Upload successful ✅");
      setFile(null);
      setCaption("");
    } else {
      alert(json.error || "Upload failed");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h4 className="text-xl font-semibold mb-6">Upload Gallery Image</h4>

      <form onSubmit={handleUpload} className="space-y-4">
        <select
          className="w-full p-3 border rounded"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
        >
          <option value="">Select Event (optional)</option>
          {events.map((e: any) => (
            <option key={e._id} value={e._id}>
              {e.title}
            </option>
          ))}
        </select>
        {/* File */}
        {/* File Picker */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Upload Image
          </label>
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-400">
                {file
                  ? `Selected: ${file.name}`
                  : "PNG, JPG or JPEG (MAX. 800x400px)"}
              </p>
            </div>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden" // Hides the ugly default input
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        {/* Caption */}
        <input
          className="w-full p-3 border rounded"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* Scope */}
        <select
          className="w-full p-3 border rounded"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
        >
          <option value="COMMAND">Command</option>
          <option value="UNIT">Unit</option>
        </select>

        {/* Unit Select */}
        {scope === "UNIT" && (
          <select
            className="w-full p-3 border rounded"
            value={unitId}
            onChange={(e) => setUnitId(e.target.value)}
          >
            <option value="">Select Unit</option>
            {units.map((u) => (
              <option key={u._id} value={u._id}>
                {u.unit}
              </option>
            ))}
          </select>
        )}

        {/* Category */}
        <select
          className="w-full p-3 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="EVENT">Event</option>
          <option value="LEADERSHIP">Leadership</option>
          <option value="TRAINING">Training</option>
        </select>

        <button className="bg-blue-600 text-white p-3 rounded w-full">
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
