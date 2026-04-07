"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function UploadImages() {
  const { unitId, eventId } = useParams();

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState("");

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();

    if (files.length === 0) return;

    setLoading(true);

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file); // 🔥 plural
    });

    formData.append("caption", caption);
    formData.append("category", "EVENT");
    formData.append("scope", "UNIT");
    formData.append("unitId", unitId as string);
    formData.append("eventId", eventId as string);

    await fetch("/api/gallery/upload", {
      method: "POST",
      body: formData,
    });

    setLoading(false);
    alert("Uploaded successfully ✅");
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Upload Images</h2>

      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Gallery Caption
          </label>
          <input
            type="text"
            placeholder="e.g Passing Out Parade 2026"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? "Uploading..." : "Upload Images"}
        </button>
      </form>
    </div>
  );
}
