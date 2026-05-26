/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import {
  ArrowLeft, Loader2, Save, User, Upload,
} from "lucide-react";

const APPOINTMENTS = ["COMMANDER", "COMMANDANT", "AOC", "COS", "DCOS"] as const;

const INPUT = "w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(220,64%,16%)]/20 focus:border-[hsl(220,64%,16%)]/40 transition-colors placeholder:text-slate-300";
const LABEL = "block text-sm font-semibold text-slate-700 mb-1.5";

export default function CreateLeaderPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "", rank: "", appointment: "", appointmentAbbreviation: "", bio: "", awards: "",
  });

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.rank.trim()) return toast.error("Rank is required");
    if (!form.appointment) return toast.error("Appointment is required");

    setSaving(true);
    try {
      const res = await fetch("/api/command-leadership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create");

      const id = json.id;

      if (file) {
        const fd = new FormData();
        const compressed = await imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 800 });
        fd.append("file", compressed);
        const up = await fetch(`/api/command-leadership/${id}/upload-image`, { method: "POST", body: fd });
        if (!up.ok) toast.warning("Officer created but portrait upload failed");
      }

      toast.success("Officer added successfully");
      router.push("/admin/command-leadership");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/admin/command-leadership" className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(220,64%,16%)] font-heading tracking-wide">Add Officer</h1>
            <p className="text-slate-400 text-sm mt-0.5">Add a new HQ ATC leadership officer</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/command-leadership" className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors">
            Cancel
          </Link>
          <button
            form="leader-form"
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-sm font-semibold hover:bg-[hsl(220,64%,22%)] transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving…" : "Add Officer"}
          </button>
        </div>
      </div>

      <form id="leader-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Identity */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100">Officer Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className={LABEL}>Full Name <span className="text-[hsl(350,66%,33%)]">*</span></label>
                  <input className={INPUT} placeholder="e.g. John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className={LABEL}>Rank <span className="text-[hsl(350,66%,33%)]">*</span></label>
                  <input className={INPUT} placeholder="e.g. Air Vice Marshal" value={form.rank} onChange={e => setForm({ ...form, rank: e.target.value })} />
                </div>
                <div>
                  <label className={LABEL}>Appointment <span className="text-[hsl(350,66%,33%)]">*</span></label>
                  <select className={INPUT + " bg-white cursor-pointer"} value={form.appointment} onChange={e => setForm({ ...form, appointment: e.target.value })}>
                    <option value="">Select appointment</option>
                    {APPOINTMENTS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className={LABEL}>Abbreviation</label>
                  <input className={INPUT} placeholder="e.g. AOC" value={form.appointmentAbbreviation} onChange={e => setForm({ ...form, appointmentAbbreviation: e.target.value })} />
                </div>
                <div>
                  <label className={LABEL}>Awards</label>
                  <input className={INPUT} placeholder="e.g. psc, fdc, mni" value={form.awards} onChange={e => setForm({ ...form, awards: e.target.value })} />
                </div>
              </div>
              <div>
                <label className={LABEL}>Biography</label>
                <textarea className={INPUT + " h-32 resize-none"} placeholder="Brief biography of the officer…" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Portrait sidebar */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100">Portrait Photo</p>
              {preview ? (
                <div className="space-y-3">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <Image src={preview} alt="Preview" fill className="object-cover" />
                  </div>
                  <label className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg border-2 border-dashed border-slate-200 text-slate-500 text-sm cursor-pointer hover:border-[hsl(220,64%,16%)] hover:text-[hsl(220,64%,16%)] transition-colors">
                    <Upload size={14} />
                    Replace photo
                    <input type="file" accept="image/*" hidden onChange={handleFile} />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-3 w-full h-48 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 cursor-pointer hover:border-[hsl(220,64%,16%)] hover:text-[hsl(220,64%,16%)] transition-colors">
                  <User size={32} className="text-slate-200" />
                  <div className="text-center">
                    <p className="text-sm font-medium">Upload portrait</p>
                    <p className="text-xs text-slate-300 mt-0.5">JPEG, PNG — max 5 MB</p>
                  </div>
                  <input type="file" accept="image/*" hidden onChange={handleFile} />
                </label>
              )}
              <p className="text-xs text-slate-400">Official uniform portrait recommended. Can also be added after creation.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
