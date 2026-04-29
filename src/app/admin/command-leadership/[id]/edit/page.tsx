"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import Image from "next/image";

export default function EditLeaderPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState<any>({
    name: "",
    rank: "",
    appointment: "",
    appointmentAbbreviation: "",
    bio: "",
    awards: "",
    image: "",
  });

  // 🔥 Load existing leader
  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/command-leadership/${id}`);

      if (!res.ok) {
        console.error("Failed to fetch:", res.status);
        return;
      }

      const text = await res.text();

      if (!text) {
        console.error("Empty response from API");
        return;
      }

      const data = JSON.parse(text);

      setForm({
        name: data.name || "",
        rank: data.rank || "",
        appointment: data.appointment || "",
        appointmentAbbreviation: data.appointmentAbbreviation || "",
        bio: data.bio || "",
        awards: data.awards || "",
        image: data.image || "",
      });
      setLoading(false);
    }

    if (id) load();
  }, [id]);

  // 🔥 Submit update
  async function handleSubmit(e: any) {
    e.preventDefault();

    // 1. Update text fields
    const res = await fetch(`/api/command-leadership/${id}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Update failed");
      return;
    }

    // 2. Upload new image (if selected)
    if (file) {
      const fd = new FormData();

      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });

      fd.append("file", compressed);

      await fetch(`/api/command-leadership/${id}/upload-image`, {
        method: "POST",
        body: fd,
      });
    }

    alert("Leader updated ✅");
    router.push("/admin/command-leadership");
  }

  // 🔥 Delete current image
  async function handleDeleteImage() {
    const ok = confirm("Remove current image?");
    if (!ok) return;

    await fetch(`/api/command-leadership/${id}/delete-image`, {
      method: "DELETE",
    });

    setForm((prev: any) => ({ ...prev, image: "" }));
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white border rounded-xl p-6 shadow space-y-6">
        <h1 className="text-xl font-bold">Edit Leader</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full Name"
            className="w-full border p-3 rounded"
          />

          {/* Rank */}
          <input
            value={form.rank}
            onChange={(e) => setForm({ ...form, rank: e.target.value })}
            placeholder="Rank"
            className="w-full border p-3 rounded"
          />

          {/* Appointment */}
          <input
            value={form.appointment}
            onChange={(e) => setForm({ ...form, appointment: e.target.value })}
            placeholder="Appointment"
            className="w-full border p-3 rounded"
          />

          {/* Abbreviation */}
          <input
            value={form.appointmentAbbreviation}
            onChange={(e) =>
              setForm({
                ...form,
                appointmentAbbreviation: e.target.value,
              })
            }
            placeholder="Abbreviation (AOC, COS...)"
            className="w-full border p-3 rounded"
          />

          {/* Bio */}
          <textarea
            value={form.bio || ""}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Biography"
            className="w-full border p-3 rounded"
          />

          {/* Awards */}
          <input
            value={form.awards || ""}
            onChange={(e) => setForm({ ...form, awards: e.target.value })}
            placeholder="Awards"
            className="w-full border p-3 rounded"
          />

          {/* IMAGE SECTION */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Portrait</label>

            {form.image ? (
              <div className="flex items-center gap-4">
                <Image
                  src={form.image}
                  alt="Portrait"
                  width={100}
                  height={100}
                  className="rounded object-cover border"
                />

                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No image uploaded</p>
            )}

            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-4">
            <button className="flex-1 bg-black text-white py-3 rounded">
              Update Leader
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-200 py-3 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
