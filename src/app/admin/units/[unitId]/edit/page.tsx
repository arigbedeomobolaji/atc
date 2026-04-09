/* eslint-disable @typescript-eslint/no-explicit-any */

// /Users/mac/omobolaji/atc/src/app/admin/units/[unitId]/edit/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import ArrayInput from "@/components/ArrayInput";
import HistoryEditor from "@/components/HistoryEditor";
import CommandersEditor from "@/components/CommandsEditor";
import CustomSectionsEditor from "@/components/CustomSectionsEditor";

export default function EditUnitPage() {
  const { unitId } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState<any>({
    unit: "",
    slug: "",
    establishedDate: "",
    abbreviation: "",
    location: "",
    role: "",
    description: "",
    mission: "",

    capabilities: [],
    systems: [],
    responsibilities: [],

    history: [],
    commanders: [],

    customSections: [],
  });

  // 🔥 Load unit data
  useEffect(() => {
    async function loadUnit() {
      const res = await fetch(`/api/units/${unitId}`);
      const data = await res.json();
      const date = new Date(data.establishedDate);

      const formattedEstablishedDate = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);

      setForm({
        ...data,
        establishedDate: formattedEstablishedDate,
        responsibilities: data.responsibilities || [],
        capabilities: data.capabilities || [],
        systems: data.systems || [],
        history: data.history || [],
        commanders: data.commanders || [],
        customSections: data.customSections || [],
        links: data.links || [],
        contact: data.contact || {
          address: "",
          phone: "",
          email: "",
        },
      });
      setLoading(false);
    }

    if (unitId) loadUnit();
  }, [unitId]);

  async function handleSubmit(e: any) {
    e.preventDefault();

    // 🔥 1. Update Unit Data
    const res = await fetch(`/api/units/${unitId}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Update failed");
      return;
    }

    // 🔥 2. Upload new logo if selected
    if (file) {
      const fd = new FormData();
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1000,
        useWebWorker: true,
      });

      fd.append("file", compressed);

      await fetch(`/api/units/${unitId}/upload-logo`, {
        method: "POST",
        body: fd,
      });
    }

    alert("Unit updated ✅");
    router.push("/admin/units");
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-card text-card-foreground rounded-2xl shadow-lg p-8 border border-border">
        <h4 className="text-2xl font-bold mb-6 font-heading">Edit Unit</h4>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Unit Name */}
            <div>
              <label
                htmlFor="unit"
                className="block text-sm font-medium text-muted-foreground"
              >
                Unit Name
              </label>
              <input
                id="unit"
                className="w-full mt-1 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
              />
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-muted-foreground"
              >
                Slug
              </label>
              <input
                id="slug"
                className="w-full mt-1 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </div>

            {/* established Date */}
            <div>
              <label htmlFor="slug" className="text-sm text-muted-foreground">
                established Date
              </label>
              <input
                id="establishedDate"
                value={form.establishedDate}
                className="w-full mt-1 p-3 border border-border rounded-lg"
                onChange={(e) =>
                  setForm({ ...form, establishedDate: e.target.value })
                }
              />
            </div>

            {/* Abbreviation */}
            <div>
              <label
                htmlFor="abbreviation"
                className="block text-sm font-medium text-muted-foreground"
              >
                Abbreviation
              </label>
              <input
                id="abbreviation"
                className="w-full mt-1 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none"
                value={form.abbreviation}
                onChange={(e) =>
                  setForm({ ...form, abbreviation: e.target.value })
                }
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-muted-foreground"
              >
                Location
              </label>
              <input
                id="location"
                className="w-full mt-1 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            {/* Mission */}
            <div>
              <label
                htmlFor="mission"
                className="block text-sm font-medium text-muted-foreground"
              >
                Mission
              </label>
              <input
                id="mission"
                className="w-full mt-1 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none"
                value={form.mission}
                onChange={(e) => setForm({ ...form, mission: e.target.value })}
              />
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-muted-foreground"
              >
                Role
              </label>
              <input
                id="role"
                className="w-full mt-1 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
            </div>
          </div>

          {/*  Description */}
          <div>
            <label
              htmlFor="Description"
              className="block text-sm font-medium text-muted-foreground"
            >
              Description
            </label>
            <textarea
              id="Description"
              rows={5}
              className="w-full mt-1 p-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* Arrays */}
          <ArrayInput
            label="Capabilities"
            value={form.capabilities}
            onChange={(val: any) => setForm({ ...form, capabilities: val })}
          />

          <ArrayInput
            label="Systems / Equipment"
            value={form.systems}
            onChange={(val: any) => setForm({ ...form, systems: val })}
          />

          <ArrayInput
            label="Responsibilities"
            value={form.responsibilities}
            onChange={(val: any) => setForm({ ...form, responsibilities: val })}
          />

          <HistoryEditor
            value={form.history || []}
            onChange={(val: any) => setForm({ ...form, history: val })}
          />

          <CommandersEditor
            value={form.commanders || []}
            onChange={(val: any) => setForm({ ...form, commanders: val })}
          />

          <CustomSectionsEditor
            value={form.customSections || []}
            onChange={(val: any) => setForm({ ...form, customSections: val })}
          />

          {/* LOGO */}
          <div className="space-y-3">
            <label
              htmlFor="logo"
              className="block text-sm font-medium text-muted-foreground"
            >
              Unit Logo
            </label>

            {form.logo ? (
              <div className="flex items-center gap-4">
                <Image
                  src={form.logo}
                  alt="Unit Logo"
                  width={100}
                  height={100}
                  className="object-contain border border-border rounded bg-background p-2"
                />
                <span className="text-sm text-accent font-medium">
                  Logo already uploaded
                </span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No logo uploaded</p>
            )}

            <input
              id="logo"
              type="file"
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/80"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 pt-4">
            <button className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition">
              Update Unit
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-muted text-foreground py-3 rounded-lg font-medium hover:bg-muted/80 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
