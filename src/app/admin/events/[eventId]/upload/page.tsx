"use client";

// /Users/mac/omobolaji/atc/src/app/admin/events/[eventId]/upload/page.tsx

import { useState } from "react";
import { useParams } from "next/navigation";

export default function UploadEventImages() {
  const { eventId } = useParams();
  const [file, setFile] = useState<File | null>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", "Event Image");
    formData.append("category", "EVENT");
    formData.append("scope", "COMMAND");
    formData.append("eventId", eventId as string);

    const res = await fetch("/api/gallery/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Uploaded ✅");
    } else {
      alert("Upload failed");
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h4 className="text-xl font-bold mb-4">Upload Event Images</h4>

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>
    </div>
  );
}
