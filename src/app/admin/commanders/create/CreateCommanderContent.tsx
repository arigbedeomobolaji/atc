"use client";

import { useSearchParams } from "next/navigation";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";

const APPOINTMENTS = ["COMMANDER", "COMMANDANT", "AOC"] as const;

export default function CreateCommanderContent() {
  const params = useSearchParams();
  const [units, setUnits] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const type = params.get("type");
  const isPast = type === "past";

  const [form, setForm] = useState({
    name: "",
    rank: "",
    unitId: "",
    appointment: "",
    startDate: "",
    endDate: "",
    bio: "",
    awards: "",
  });

  useEffect(() => {
    const unitId = params.get("unitId");

    if (unitId) {
      setForm((prev) => ({ ...prev, unitId }));
    }
  }, [params]);

  useEffect(() => {
    fetch("/api/units")
      .then((res) => res.json())
      .then(setUnits);
  }, []);

  //  Image preview
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
    let publicId = "";

    try {
      // Upload image
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

      // Create commander
      const res = await fetch("/api/commanders", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          portrait: imageUrl,
          portraitPublicId: publicId,
          endDate: isPast ? form.endDate : null,
        }),
      });

      const json = await res.json();

      if (res.ok) {
        toast.success("Commander created successfully");
        setForm({
          name: "",
          rank: "",
          unitId: "",
          appointment: "",
          startDate: "",
          endDate: "",
          bio: "",
          awards: "",
        });
        setFile(null);
        setPreview(null);
      } else {
        toast.error(json.error || "Failed to create commander");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-card text-card-foreground rounded-2xl shadow-lg p-8 border border-border">
        <h4 className="text-2xl font-bold mb-6">Add Commander</h4>

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
                <option value="">Select Unit</option>
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
              <select
                id="appointment"
                className="w-full mt-1 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                value={form.appointment}
                onChange={(e) =>
                  setForm({ ...form, appointment: e.target.value })
                }
              >
                <option value="">Select Appointment</option>
                {APPOINTMENTS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
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

            <div className="mt-2 flex items-center gap-4">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              {preview && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
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

          <button
            disabled={loading}
            className="w-full bg-primary text-primary-foreground p-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            {loading ? "Creating..." : "Create Commander"}
          </button>
        </form>
      </div>
    </div>
  );
}
