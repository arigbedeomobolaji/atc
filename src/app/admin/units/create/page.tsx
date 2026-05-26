/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import ArrayInput from "@/components/ArrayInput";
import CustomSectionsEditor from "@/components/CustomSectionsEditor";
import HistoryEditor from "@/components/HistoryEditor";
import InputFile from "@/components/widget/InputFile";

const INPUT = "w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(220,64%,16%)]/20 focus:border-[hsl(220,64%,16%)]/40 transition-colors placeholder:text-slate-300";
const LABEL = "block text-sm font-semibold text-slate-700 mb-1.5";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100">{title}</p>
      {children}
    </div>
  );
}

export default function CreateUnitPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<any>({
    unit: "", slug: "", establishedDate: "", abbreviation: "", role: "",
    location: "", mission: "", description: "",
    capabilities: [], systems: [], responsibilities: [],
    history: [], customSections: [],
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.unit.trim()) return toast.error("Unit name is required");
    if (!form.slug.trim()) return toast.error("Slug is required");
    if (!form.role.trim()) return toast.error("Role is required");
    if (!form.description.trim()) return toast.error("Description is required");
    if (!form.location.trim()) return toast.error("Location is required");

    setSaving(true);
    try {
      const res = await fetch("/api/units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create unit");

      if (file instanceof File && file.type.startsWith("image/")) {
        const fd = new FormData();
        const compressed = await imageCompression(file, { maxSizeMB: 0.5 });
        fd.append("file", compressed);
        const up = await fetch(`/api/units/${json.id}/upload-logo`, { method: "POST", body: fd });
        if (!up.ok) toast.warning("Unit created but logo upload failed");
      }

      toast.success("Unit created successfully");
      router.push("/admin/units");
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/admin/units" className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(220,64%,16%)] font-heading tracking-wide">Create Unit</h1>
            <p className="text-slate-400 text-sm mt-0.5">Add a new unit to the Air Training Command</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/units" className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors">Cancel</Link>
          <button
            form="unit-form" type="submit" disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-sm font-semibold hover:bg-[hsl(220,64%,22%)] transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Creating…" : "Create Unit"}
          </button>
        </div>
      </div>

      <form id="unit-form" onSubmit={handleSubmit} className="space-y-5">
        {/* Identity */}
        <Section title="Identity">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className={LABEL}>Unit Name <span className="text-[hsl(350,66%,33%)]">*</span></label>
              <input className={INPUT} placeholder="e.g. 301 Flying Training School" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Slug <span className="text-[hsl(350,66%,33%)]">*</span></label>
              <input className={INPUT} placeholder="e.g. 301-flying-training-school" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase() })} />
            </div>
            <div>
              <label className={LABEL}>Abbreviation</label>
              <input className={INPUT} placeholder="e.g. 301 FTS" value={form.abbreviation} onChange={e => setForm({ ...form, abbreviation: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Location <span className="text-[hsl(350,66%,33%)]">*</span></label>
              <input className={INPUT} placeholder="e.g. Kano" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Established Date</label>
              <input type="date" className={INPUT} value={form.establishedDate} onChange={e => setForm({ ...form, establishedDate: e.target.value })} />
            </div>
          </div>
        </Section>

        {/* Description */}
        <Section title="Description">
          <div>
            <label className={LABEL}>Role <span className="text-[hsl(350,66%,33%)]">*</span></label>
            <input className={INPUT} placeholder="Primary role of this unit" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
          </div>
          <div>
            <label className={LABEL}>Mission Statement <span className="text-slate-400 font-normal">(optional)</span></label>
            <textarea className={INPUT + " h-20 resize-none"} placeholder="Mission statement…" value={form.mission} onChange={e => setForm({ ...form, mission: e.target.value })} />
          </div>
          <div>
            <label className={LABEL}>Description <span className="text-[hsl(350,66%,33%)]">*</span></label>
            <textarea className={INPUT + " h-32 resize-none"} placeholder="Full description of the unit…" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
        </Section>

        {/* Capabilities */}
        <Section title="Capabilities & Systems">
          <ArrayInput label="Capabilities" value={form.capabilities} onChange={(v: any) => setForm({ ...form, capabilities: v })} />
          <ArrayInput label="Systems / Equipment" value={form.systems} onChange={(v: any) => setForm({ ...form, systems: v })} />
          <ArrayInput label="Responsibilities" value={form.responsibilities} onChange={(v: any) => setForm({ ...form, responsibilities: v })} />
        </Section>

        {/* History */}
        <Section title="History">
          <HistoryEditor value={form.history} onChange={(v: any) => setForm({ ...form, history: v })} />
        </Section>

        {/* Custom Sections */}
        <Section title="Custom Sections">
          <CustomSectionsEditor value={form.customSections || []} onChange={(v: any) => setForm({ ...form, customSections: v })} />
        </Section>

        {/* Logo */}
        <Section title="Unit Logo">
          <p className="text-xs text-slate-400">Logo can also be uploaded after creation via Edit.</p>
          <InputFile file={file} setFile={setFile} label="Unit Logo" />
        </Section>

        {/* Bottom save */}
        <div className="flex justify-end gap-3 pt-2">
          <Link href="/admin/units" className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors">Cancel</Link>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[hsl(220,64%,16%)] text-white text-sm font-semibold hover:bg-[hsl(220,64%,22%)] transition-colors disabled:opacity-60">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Creating…" : "Create Unit"}
          </button>
        </div>
      </form>
    </div>
  );
}
