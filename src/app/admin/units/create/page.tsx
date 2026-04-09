/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import ArrayInput from "@/components/ArrayInput";
import CommandersEditor from "@/components/CommandsEditor";
import CustomSectionsEditor from "@/components/CustomSectionsEditor";
import HistoryEditor from "@/components/HistoryEditor";
import InputFile from "@/components/widget/InputFile";

export default function CreateUnit() {
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState<any>({
    unit: "",
    slug: "",
    establishedDate: "",
    abbreviation: "",
    role: "",
    location: "",
    mission: "",
    description: "",
    capabilities: [],
    systems: [],
    responsibilities: [],
    history: [],
    commanders: [],
    customSections: [],
  });

  async function handleSubmit(e: any) {
    e.preventDefault();

    const res = await fetch("/api/units", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const json = await res.json();
    if (!res.ok) return alert(json.error);

    const unitId = json.id;

    if (file instanceof File && file.type.startsWith("image/")) {
      const fd = new FormData();
      const compressed = await imageCompression(file, { maxSizeMB: 0.5 });

      fd.append("file", compressed);

      await fetch(`/api/units/${unitId}/upload-logo`, {
        method: "POST",
        body: fd,
      });
    }

    alert("Unit created ✅");
  }
  // function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   const selected = e.target.files?.[0];

  //   if (!selected) return;

  //   // ✅ 1. Check file type
  //   if (!selected.type.startsWith("image/")) {
  //     alert("Only image files are allowed ❌");
  //     return;
  //   }

  //   // ✅ 2. Check file size (before compression)
  //   const maxSizeMB = 5;
  //   if (selected.size > maxSizeMB * 1024 * 1024) {
  //     alert(`Image must be less than ${maxSizeMB}MB ❌`);
  //     return;
  //   }

  //   setFile(selected);
  // }

  return (
    <div className="min-h-screen bg-background p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-8 space-y-5 shadow"
      >
        <h4 className="text-2xl font-bold text-foreground">Create Unit</h4>

        {/* Unit */}
        <div>
          <label htmlFor="unit" className="text-sm text-muted-foreground">
            Unit Name
          </label>
          <input
            id="unit"
            className="w-full mt-1 p-3 border border-border rounded-lg bg-background"
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="text-sm text-muted-foreground">
            Slug
          </label>
          <input
            id="slug"
            className="w-full mt-1 p-3 border border-border rounded-lg"
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
        </div>

        {/* established Date */}
        <div>
          <label htmlFor="slug" className="text-sm text-muted-foreground">
            Established Date
          </label>
          <input
            id="establishedDate"
            type="date"
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
            onChange={(e) => setForm({ ...form, abbreviation: e.target.value })}
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

        {/* Location */}
        <div>
          <label htmlFor="location" className="text-sm text-muted-foreground">
            Location
          </label>
          <input
            id="location"
            className="w-full mt-1 p-3 border border-border rounded-lg"
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>

        {/* Mission */}
        <div>
          <label htmlFor="mission" className="text-sm text-muted-foreground">
            Mission
          </label>
          <input
            id="mission"
            className="w-full mt-1 p-3 border border-border rounded-lg"
            onChange={(e) => setForm({ ...form, mission: e.target.value })}
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="text-sm text-muted-foreground"
          >
            Description
          </label>
          <textarea
            id="description"
            className="w-full mt-1 p-3 border border-border rounded-lg"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Arrays */}
        <ArrayInput
          label="Capabilities"
          value={form.capabilities}
          onChange={(v: any) => setForm({ ...form, capabilities: v })}
        />
        <ArrayInput
          label="Systems"
          value={form.systems}
          onChange={(v: any) => setForm({ ...form, systems: v })}
        />
        <ArrayInput
          label="Responsibilities"
          value={form.responsibilities}
          onChange={(v: any) => setForm({ ...form, responsibilities: v })}
        />

        <HistoryEditor
          value={form.history}
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

        {/* Logo */}
        <div>
          <label className="text-sm text-muted-foreground">Unit Logo</label>
          <InputFile file={file} setFile={setFile} />
        </div>

        <button className="w-full bg-primary text-primary-foreground p-3 rounded-lg font-semibold hover:opacity-90">
          Create Unit
        </button>
      </form>
    </div>
  );
}
