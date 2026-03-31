/* eslint-disable @typescript-eslint/no-explicit-any */

// /Users/mac/omobolaji/atc/src/app/admin/commanders/create/page.tsx

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function CreateCommander() {
  const [units, setUnits] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    rank: "",
    unitId: "",
    appointment: "",
    startDate: "",
    endDate: "",
    bio: "",
  });

  useEffect(() => {
    fetch("/api/units")
      .then((res) => res.json())
      .then(setUnits);
  }, []);

  // 🔥 Image preview
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    let imageUrl = "";

    try {
      // Upload image
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("category", "LEADERSHIP");
        fd.append("scope", "UNIT");
        fd.append("unitId", form.unitId);

        const upload = await fetch("/api/gallery/upload", {
          method: "POST",
          body: fd,
        });

        const upJson = await upload.json();
        imageUrl = upJson.data.imageUrl;
      }

      // Create commander
      const res = await fetch("/api/commanders", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          portrait: imageUrl,
        }),
      });

      const json = await res.json();

      if (res.ok) {
        alert("Commander created ✅");
        setForm({
          name: "",
          rank: "",
          unitId: "",
          appointment: "",
          startDate: "",
          endDate: "",
          bio: "",
        });
        setFile(null);
        setPreview(null);
      } else {
        alert(json.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Add Commander</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                className="w-full mt-1 p-3 border rounded-lg"
                placeholder="Enter full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Rank */}
            <div>
              <label className="text-sm text-gray-600">Rank</label>
              <input
                className="w-full mt-1 p-3 border rounded-lg"
                placeholder="e.g Air Vice Marshal"
                value={form.rank}
                onChange={(e) => setForm({ ...form, rank: e.target.value })}
              />
            </div>

            {/* Unit */}
            <div>
              <label className="text-sm text-gray-600">Unit</label>
              <select
                className="w-full mt-1 p-3 border rounded-lg"
                value={form.unitId}
                onChange={(e) => setForm({ ...form, unitId: e.target.value })}
              >
                <option value="">Select Unit</option>
                {units.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.unit}
                  </option>
                ))}
              </select>
            </div>

            {/* Appointment */}
            <div>
              <label className="text-sm text-gray-600">Appointment</label>
              <input
                className="w-full mt-1 p-3 border rounded-lg"
                placeholder="Commander / Commandant"
                value={form.appointment}
                onChange={(e) =>
                  setForm({ ...form, appointment: e.target.value })
                }
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="text-sm text-gray-600">Start Date</label>
              <input
                type="date"
                className="w-full mt-1 p-3 border rounded-lg"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
              />
            </div>

            {/* End Date */}
            <div>
              <label className="text-sm text-gray-600">
                End Date (optional)
              </label>
              <input
                type="date"
                className="w-full mt-1 p-3 border rounded-lg"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
          </div>

          {/* BIO */}
          <div>
            <label className="text-sm text-gray-600">Biography</label>
            <textarea
              className="w-full mt-1 p-3 border rounded-lg h-28"
              placeholder="Brief bio..."
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="text-sm text-gray-600">Commander Portrait</label>

            <div className="mt-2 flex items-center gap-4">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block"
              />

              {preview && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                  <Image
                    src={preview}
                    alt="preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded-lg font-semibold"
          >
            {loading ? "Creating..." : "Create Commander"}
          </button>
        </form>
      </div>
    </div>
  );
}
