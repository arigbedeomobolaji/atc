/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { ArrowLeft, Loader2, Save, ExternalLink, Upload } from "lucide-react";
import ArrayInput from "@/components/ArrayInput";
import HistoryEditor from "@/components/HistoryEditor";
import CommandersEditor from "@/components/CommandsEditor";
import CustomSectionsEditor from "@/components/CustomSectionsEditor";
import InputFile from "@/components/widget/InputFile";
import { formatDateSafe } from "@/lib/utils";

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

export default function EditUnitPage() {
  const { unitId } = useParams<{ unitId: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState<any>({
    unit: "", slug: "", establishedDate: "", abbreviation: "", location: "",
    role: "", description: "", mission: "",
    capabilities: [], systems: [], responsibilities: [],
    history: [], commanders: [], customSections: [],
    logo: "", links: [], contact: { address: "", phone: "", email: "" },
  });

  useEffect(() => {
    if (!unitId) return;
    fetch(`/api/units/${unitId}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setForm({
        unit: data.unit || "", slug: data.slug || "",
        establishedDate: formatDateSafe(data.establishedDate),
        abbreviation: data.abbreviation || "", location: data.location || "",
        role: data.role || "", description: data.description || "", mission: data.mission || "",
        capabilities: data.capabilities || [], systems: data.systems || [],
        responsibilities: data.responsibilities || [], history: data.history || [],
        commanders: data.commanders || [], customSections: data.customSections || [],
        logo: data.logo || "", links: data.links || [],
        contact: data.contact || { address: "", phone: "", email: "" },
      }))
      .catch(() => toast.error("Failed to load unit"))
      .finally(() => setLoading(false));
  }, [unitId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/units/${unitId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Update failed");

      if (file instanceof File && file.type.startsWith("image/")) {
        const fd = new FormData();
        const compressed = await imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 1000 });
        fd.append("file", compressed);
        const up = await fetch(`/api/units/${unitId}/upload-logo`, { method: "POST", body: fd });
        if (!up.ok) toast.warning("Saved but logo upload failed");
      }

      toast.success("Unit updated successfully");
      router.push("/admin/units");
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="space-y-5 animate-pulse">
      <div className="h-10 w-64 bg-slate-100 rounded-lg" />
      {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-40 bg-slate-100 rounded-2xl" />)}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/admin/units" className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(220,64%,16%)] font-heading tracking-wide">Edit Unit</h1>
            <p className="text-slate-400 text-sm mt-0.5">{form.unit || "Untitled"}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {form.slug && (
            <Link href={`/units/${form.slug}`} target="_blank"
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-slate-200 text-slate-500 text-sm hover:bg-slate-50 transition-colors">
              <ExternalLink size={14} /> View on site
            </Link>
          )}
          <Link href="/admin/units" className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors">Cancel</Link>
          <button
            form="unit-form" type="submit" disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-sm font-semibold hover:bg-[hsl(220,64%,22%)] transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      <form id="unit-form" onSubmit={handleSubmit} className="space-y-5">
        {/* Identity */}
        <Section title="Identity">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className={LABEL}>Unit Name <span className="text-[hsl(350,66%,33%)]">*</span></label>
              <input className={INPUT} value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Slug <span className="text-[hsl(350,66%,33%)]">*</span></label>
              <input className={INPUT} value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Abbreviation</label>
              <input className={INPUT} value={form.abbreviation} onChange={e => setForm({ ...form, abbreviation: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Location</label>
              <input className={INPUT} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Established Date</label>
              <input type="date" className={INPUT} value={form.establishedDate?.split("T")[0] || ""} onChange={e => setForm({ ...form, establishedDate: e.target.value })} />
            </div>
          </div>
        </Section>

        {/* Description */}
        <Section title="Description">
          <div>
            <label className={LABEL}>Role <span className="text-[hsl(350,66%,33%)]">*</span></label>
            <input className={INPUT} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
          </div>
          <div>
            <label className={LABEL}>Mission Statement <span className="text-slate-400 font-normal">(optional)</span></label>
            <input className={INPUT} value={form.mission} onChange={e => setForm({ ...form, mission: e.target.value })} />
          </div>
          <div>
            <label className={LABEL}>Description <span className="text-[hsl(350,66%,33%)]">*</span></label>
            <textarea className={INPUT + " h-32 resize-none"} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
        </Section>

        {/* Capabilities / Systems / Responsibilities */}
        <Section title="Capabilities & Systems">
          <ArrayInput label="Capabilities" value={form.capabilities} onChange={(v: any) => setForm({ ...form, capabilities: v })} />
          <ArrayInput label="Systems / Equipment" value={form.systems} onChange={(v: any) => setForm({ ...form, systems: v })} />
          <ArrayInput label="Responsibilities" value={form.responsibilities} onChange={(v: any) => setForm({ ...form, responsibilities: v })} />
        </Section>

        {/* History */}
        <Section title="History">
          <HistoryEditor value={form.history || []} onChange={(v: any) => setForm({ ...form, history: v })} />
        </Section>

        {/* Commanders */}
        <Section title="Commanders">
          <CommandersEditor value={form.commanders || []} onChange={(v: any) => setForm({ ...form, commanders: v })} />
        </Section>

        {/* Custom Sections */}
        <Section title="Custom Sections">
          <CustomSectionsEditor value={form.customSections || []} onChange={(v: any) => setForm({ ...form, customSections: v })} />
        </Section>

        {/* Contact */}
        <Section title="Contact Information">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className={LABEL}>Address</label>
              <input className={INPUT} value={form.contact?.address || ""} onChange={e => setForm({ ...form, contact: { ...form.contact, address: e.target.value } })} />
            </div>
            <div>
              <label className={LABEL}>Phone</label>
              <input className={INPUT} value={form.contact?.phone || ""} onChange={e => setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })} />
            </div>
            <div>
              <label className={LABEL}>Email</label>
              <input className={INPUT} type="email" value={form.contact?.email || ""} onChange={e => setForm({ ...form, contact: { ...form.contact, email: e.target.value } })} />
            </div>
          </div>
        </Section>

        {/* Logo */}
        <Section title="Unit Logo">
          {form.logo && (
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <Image src={form.logo} alt="Current logo" width={64} height={64} className="object-contain rounded-lg border border-slate-200 bg-white p-1" />
              <div>
                <p className="text-sm font-semibold text-slate-700">Current logo</p>
                <p className="text-xs text-slate-400 mt-0.5">Upload a new file below to replace it</p>
              </div>
            </div>
          )}
          <div>
            <label className={LABEL}>{form.logo ? "Replace Logo" : "Upload Logo"}</label>
            <InputFile file={file} setFile={setFile} label="Unit Logo" />
          </div>
        </Section>

        {/* Bottom save */}
        <div className="flex justify-end gap-3 pt-2">
          <Link href="/admin/units" className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors">Cancel</Link>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[hsl(220,64%,16%)] text-white text-sm font-semibold hover:bg-[hsl(220,64%,22%)] transition-colors disabled:opacity-60">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
