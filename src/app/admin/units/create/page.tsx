/* eslint-disable @typescript-eslint/no-explicit-any */

// /Users/mac/omobolaji/atc/src/app/admin/units/create/page.tsx
"use client";

import ArrayInput from "@/components/ArrayInput";
import CommandersEditor from "@/components/CommandsEditor";
import CustomSectionsEditor from "@/components/CustomSectionsEditor";
import HistoryEditor from "@/components/HistoryEditor";
import { useState } from "react";

export default function CreateUnit() {
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

  async function handleSubmit(e: any) {
    e.preventDefault();

    // 1️⃣ Create Unit
    const res = await fetch("/api/units", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const json = await res.json();

    if (!res.ok) {
      alert(json.error);
      return;
    }

    const unitId = json.id;

    // 2️⃣ Upload Logo
    if (file) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("unitId", unitId);

      await fetch("/api/units/upload-logo", {
        method: "POST",
        body: fd,
      });
    }

    alert("Unit created ✅");
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-xl space-y-4">
      <input
        placeholder="Unit Name"
        onChange={(e) => setForm({ ...form, unit: e.target.value })}
      />

      <input
        placeholder="Slug"
        onChange={(e) => setForm({ ...form, slug: e.target.value })}
      />

      <input
        placeholder="Location"
        onChange={(e) => setForm({ ...form, location: e.target.value })}
      />

      <textarea
        placeholder="Description"
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <ArrayInput
        label="Capabilities"
        value={form.capabilities}
        onChange={(val: any) => setForm({ ...form, capabilities: val })}
      />

      {/* Systems - Equipments */}
      <ArrayInput
        label="Systems / Equipment"
        value={form.systems}
        onChange={(val: any) => setForm({ ...form, systems: val })}
      />

      {/* Responsibilities */}
      <ArrayInput
        label="Responsibilities"
        value={form.responsibilities}
        onChange={(val: any) => setForm({ ...form, responsibilities: val })}
      />

      {/* Others fields */}

      <HistoryEditor />
      <CommandersEditor />
      <CustomSectionsEditor />

      {/* Logo */}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button className="bg-blue-600 text-white p-3 rounded">
        Create Unit
      </button>
    </form>
  );
}
