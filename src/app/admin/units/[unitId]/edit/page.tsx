/* eslint-disable @typescript-eslint/no-explicit-any */

// /Users/mac/omobolaji/atc/src/app/admin/units/[unitId]/edit/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
    abbreviation: "",
    location: "",
    role: "",
    description: "",
    fullDescription: "",

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

      setForm({
        ...data,
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
      fd.append("file", file);
      fd.append("unitId", unitId as string);

      await fetch("/api/units/upload-logo", {
        method: "POST",
        body: fd,
      });
    }

    alert("Unit updated ✅");
    router.push("/admin/units");
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Unit</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Unit Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Unit Name
          </label>
          <input
            className="w-full mt-1 p-3 border rounded-lg"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Slug
          </label>
          <input
            className="w-full mt-1 p-3 border rounded-lg"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
        </div>

        {/* Abbreviation */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Abbreviation
          </label>
          <input
            className="w-full mt-1 p-3 border rounded-lg"
            value={form.abbreviation}
            onChange={(e) => setForm({ ...form, abbreviation: e.target.value })}
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            className="w-full mt-1 p-3 border rounded-lg"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <input
            className="w-full mt-1 p-3 border rounded-lg"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Short Description
          </label>
          <textarea
            className="w-full mt-1 p-3 border rounded-lg"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Full Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Description
          </label>
          <textarea
            className="w-full mt-1 p-3 border rounded-lg"
            rows={5}
            value={form.fullDescription}
            onChange={(e) =>
              setForm({ ...form, fullDescription: e.target.value })
            }
          />
        </div>

        {/* Capabilities */}
        <ArrayInput
          label="Capabilities"
          value={form.capabilities}
          onChange={(val: any) => setForm({ ...form, capabilities: val })}
        />

        {/* Systems / Equioment */}
        <ArrayInput
          label="Systems / Equipment"
          value={form.systems}
          onChange={(val: any) => setForm({ ...form, systems: val })}
        />

        {/* Responsibilties */}
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
        {/* LOGO SECTION */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Unit Logo
          </label>

          {/* Existing Logo */}
          {form.logo ? (
            <div className="flex items-center gap-4">
              <Image
                src={form.logo}
                alt="Unit Logo"
                width={100}
                height={100}
                className="object-contain border rounded bg-white p-2"
              />
              <span className="text-sm text-green-600">
                Logo already uploaded
              </span>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No logo uploaded</p>
          )}

          {/* Upload */}
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 pt-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Update Unit
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-300 px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
