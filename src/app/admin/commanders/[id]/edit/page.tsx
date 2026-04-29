/* eslint-disable @typescript-eslint/no-explicit-any */

// /Users/mac/omobolaji/atc/src/app/admin/commanders/[id]/edit/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import imageCompression from "browser-image-compression";

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
    awards: "",
    portraitPublicId: "",
  });

  //  Load commander + units
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
          awards: cmd.awards || "",
          portraitPublicId: cmd.portraitPublicId || "",
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

  //  Preview new image
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
    let publicId = form.portraitPublicId;

    try {
      //  If new image selected → upload
      if (file) {
        const fd = new FormData();
        const compressed = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1000,
          useWebWorker: true,
        });

        fd.append("file", compressed);
        fd.append("category", "LEADERSHIP");
        fd.append("scope", "UNIT");
        fd.append("unitId", form.unitId);
        fd.append("type", "PORTRAIT");

        const upload = await fetch("/api/gallery/upload", {
          method: "POST",
          body: fd,
        });

        const upJson = await upload.json();
        imageUrl = upJson.data.imageUrl;
        publicId = upJson.data.publicId;
      }

      //  Update commander
      const res = await fetch(`/api/commanders/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          portrait: imageUrl,
          portraitPublicId: publicId,
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
      <div className="bg-card text-card-foreground rounded-2xl shadow-lg p-8 border border-border">
        <h4 className="text-2xl font-bold mb-6">Edit Commander</h4>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="text-sm text-muted-foreground">
                Full Name
              </label>
              <input
                id="name"
                className="w-full mt-1 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="rank" className="text-sm text-muted-foreground">
                Rank
              </label>
              <input
                id="rank"
                className="w-full mt-1 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                value={form.rank}
                onChange={(e) => setForm({ ...form, rank: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="unit" className="text-sm text-muted-foreground">
                Unit
              </label>
              <select
                id="unit"
                className="w-full mt-1 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
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

            <div>
              <label
                htmlFor="appointment"
                className="text-sm text-muted-foreground"
              >
                Appointment
              </label>
              <input
                id="appointment"
                className="w-full mt-1 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                value={form.appointment}
                onChange={(e) =>
                  setForm({ ...form, appointment: e.target.value })
                }
              />
            </div>

            <div>
              <label htmlFor="awards" className="text-sm text-muted-foreground">
                Awards
              </label>
              <input
                id="awards"
                className="w-full mt-1 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                value={form.awards || ""}
                onChange={(e) => setForm({ ...form, awards: e.target.value })}
              />
            </div>

            <div>
              <label
                htmlFor="startDate"
                className="text-sm text-muted-foreground"
              >
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                className="w-full mt-1 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="text-sm text-muted-foreground"
              >
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                className="w-full mt-1 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label htmlFor="bio" className="text-sm text-muted-foreground">
              Biography
            </label>
            <textarea
              id="bio"
              className="w-full mt-1 p-3 rounded-lg border border-input bg-background h-28 focus:ring-2 focus:ring-primary outline-none"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">
              Commander Portrait
            </label>

            <div className="flex items-center gap-4 mt-2">
              <input
                type="file"
                className="text-sm"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              {preview && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                  <Image
                    src={preview}
                    alt="portrait"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              Uploading a new image will replace the current portrait
            </p>
          </div>

          <button
            disabled={saving}
            className="w-full bg-primary text-primary-foreground p-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            {saving ? "Updating..." : "Update Commander"}
          </button>
        </form>
      </div>
    </div>
  );
}
