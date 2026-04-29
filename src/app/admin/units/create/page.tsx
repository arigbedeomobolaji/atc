/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // 1. Import useRouter
import imageCompression from "browser-image-compression";
import ArrayInput from "@/components/ArrayInput";
// import CommandersEditor from "@/components/CommandsEditor"; // Unused in this snippet but keep if needed
import CustomSectionsEditor from "@/components/CustomSectionsEditor";
import HistoryEditor from "@/components/HistoryEditor";
import InputFile from "@/components/widget/InputFile";

export default function CreateUnit() {
  const router = useRouter(); // 2. Initialize router
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false); // 3. Add loading state

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
    setLoading(true); // Start loading

    try {
      // 1. Create the Unit
      const res = await fetch("/api/units", {
        method: "POST",
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (!res.ok) {
        setLoading(false);
        return alert(json.error);
      }

      const unitId = json.id;

      // 2. Handle Logo Upload if file exists
      if (file instanceof File && file.type.startsWith("image/")) {
        const fd = new FormData();
        const compressed = await imageCompression(file, { maxSizeMB: 0.5 });

        fd.append("file", compressed);

        const uploadRes = await fetch(`/api/units/${unitId}/upload-logo`, {
          method: "POST",
          body: fd,
        });

        if (!uploadRes.ok) {
          console.error("Logo upload failed, but unit was created.");
        }
      }

      // 3. Final Alert and Redirect
      alert("Unit created successfully ✅");
      router.push("/admin/units"); // 4. Redirect to admin/units
      router.refresh(); // Optional: clears segment cache to show new data
    } catch (error) {
      console.error(error);
      alert("An error occurred while creating the unit ❌");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-8 space-y-5 shadow"
      >
        <h4 className="text-2xl font-bold text-foreground">Create Unit</h4>

        {/* ... (Existing input fields stay the same) ... */}

        {/* Unit Name */}
        <div>
          <label htmlFor="unit" className="text-sm text-muted-foreground">
            Unit Name
          </label>
          <input
            id="unit"
            required
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
            required
            className="w-full mt-1 p-3 border border-border rounded-lg bg-background"
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
        </div>

        {/* Established Date */}
        <div>
          <label
            htmlFor="establishedDate"
            className="text-sm text-muted-foreground"
          >
            Established Date
          </label>
          <input
            id="establishedDate"
            type="date"
            className="w-full mt-1 p-3 border border-border rounded-lg bg-background"
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
            className="w-full mt-1 p-3 rounded-lg border border-border bg-background"
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
            className="w-full mt-1 p-3 rounded-lg border border-border bg-background"
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
            className="w-full mt-1 p-3 border border-border rounded-lg bg-background"
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
            className="w-full mt-1 p-3 border border-border rounded-lg bg-background"
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
            className="w-full mt-1 p-3 border border-border rounded-lg bg-background h-32"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

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
        <CustomSectionsEditor
          value={form.customSections || []}
          onChange={(val: any) => setForm({ ...form, customSections: val })}
        />

        <div>
          <label className="text-sm text-muted-foreground">Unit Logo</label>
          <InputFile file={file} setFile={setFile} label="Unit Logo" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1a365d] text-white p-3 rounded-lg font-semibold hover:bg-[#c9a227] hover:text-[#1a365d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Unit..." : "Create Unit"}
        </button>
      </form>
    </div>
  );
}
