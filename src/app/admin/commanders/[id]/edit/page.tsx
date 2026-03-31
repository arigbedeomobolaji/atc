/* eslint-disable @typescript-eslint/no-explicit-any */

// /Users/mac/omobolaji/atc/src/app/admin/commanders/[id]/edit/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function EditCommander() {
  const { id } = useParams();
  const router = useRouter();

  const [units, setUnits] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    rank: "",
    unitId: "",
    appointment: "",
    startDate: "",
    endDate: "",
    bio: "",
    portrait: "",
  });

  // 🔥 Load commander + units
  useEffect(() => {
    async function load() {
      try {
        const [cmdRes, unitRes] = await Promise.all([
          fetch(`/api/commanders/${id}`),
          fetch("/api/units"),
        ]);

        const cmd = await cmdRes.json();
        const unitsData = await unitRes.json();

        setUnits(unitsData);

        setForm({
          name: cmd.name || "",
          rank: cmd.rank || "",
          unitId: cmd.unitId || "",
          appointment: cmd.appointment || "",
          startDate: cmd.startDate?.split("T")[0] || "",
          endDate: cmd.endDate?.split("T")[0] || "",
          bio: cmd.bio || "",
          portrait: cmd.portrait || "",
        });

        setPreview(cmd.portrait || null);
      } catch (err) {
        console.error(err);
        alert("Failed to load commander");
      } finally {
        setLoading(false);
      }
    }

    if (id) load();
  }, [id]);

  // 🔥 Preview new image
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setSaving(true);

    let imageUrl = form.portrait;

    try {
      // 🔥 If new image selected → upload
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

      // 🔥 Update commander
      const res = await fetch(`/api/commanders/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          portrait: imageUrl,
        }),
      });

      if (res.ok) {
        alert("Updated successfully ✅");
        router.push("/admin/commanders");
      } else {
        alert("Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Edit Commander</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input
                className="w-full mt-1 p-3 border rounded-lg"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Rank */}
            <div>
              <label className="text-sm text-gray-600">Rank</label>
              <input
                className="w-full mt-1 p-3 border rounded-lg"
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
                value={form.appointment}
                onChange={(e) =>
                  setForm({ ...form, appointment: e.target.value })
                }
              />
            </div>

            {/* Start */}
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

            {/* End */}
            <div>
              <label className="text-sm text-gray-600">End Date</label>
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
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>

          {/* IMAGE */}
          <div>
            <label className="text-sm text-gray-600">Commander Portrait</label>

            <div className="flex items-center gap-4 mt-2">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              {preview && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                  <Image
                    src={preview}
                    alt="portrait"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <p className="text-xs text-gray-400 mt-1">
              Uploading a new image will replace the current portrait
            </p>
          </div>

          {/* BUTTON */}
          <button
            disabled={saving}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold"
          >
            {saving ? "Updating..." : "Update Commander"}
          </button>
        </form>
      </div>
    </div>
  );
}
