"use client";

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

  // Fetch units
  useEffect(() => {
    fetch("/api/units")
      .then((res) => res.json())
      .then((data) => setUnits(data));
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
      <h2 className="text-xl font-semibold mb-6">Upload Gallery Image</h2>

      <form onSubmit={handleUpload} className="space-y-4">
        {/* File */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

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
