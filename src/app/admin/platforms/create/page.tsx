"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { ArrowLeft, Loader2, Save, ImageIcon, Upload } from "lucide-react";

const INPUT =
  "w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(220,64%,16%)]/20 focus:border-[hsl(220,64%,16%)]/40 transition-colors placeholder:text-slate-300";
const LABEL = "block text-sm font-semibold text-slate-700 mb-1.5";

export default function CreatePlatformPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({ caption: "", description: "" });

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.caption.trim()) return toast.error("Caption is required");

    setSaving(true);
    try {
      const res = await fetch("/api/platforms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create");

      if (file) {
        const fd = new FormData();
        const compressed = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
        });
        fd.append("file", compressed);
        const up = await fetch(`/api/platforms/${json.id}/upload-image`, {
          method: "POST",
          body: fd,
        });
        if (!up.ok) toast.warning("Platform created but image upload failed");
      }

      toast.success("Platform added");
      router.push("/admin/platforms");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/platforms"
            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(220,64%,16%)] font-heading tracking-wide">
              Add Platform
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">Add a new aircraft or equipment platform</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/platforms"
            className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            form="platform-form"
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-sm font-semibold hover:bg-[hsl(220,64%,22%)] transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving…" : "Add Platform"}
          </button>
        </div>
      </div>

      <form id="platform-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main fields */}
          <div className="lg:col-span-2 space-y-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100">
              Platform Details
            </p>
            <div>
              <label className={LABEL}>
                Caption <span className="text-[hsl(350,66%,33%)]">*</span>
              </label>
              <input
                className={INPUT}
                placeholder="e.g. Alpha Jet: NAF flagship fighter trainer"
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
              />
            </div>
            <div>
              <label className={LABEL}>Description</label>
              <textarea
                className={INPUT + " h-36 resize-none"}
                placeholder="Brief description of the platform and its role…"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          {/* Image sidebar */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100">
              Platform Image
            </p>
            {preview ? (
              <div className="space-y-3">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <Image src={preview} alt="Preview" fill className="object-cover" />
                </div>
                <label className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg border-2 border-dashed border-slate-200 text-slate-500 text-sm cursor-pointer hover:border-[hsl(220,64%,16%)] hover:text-[hsl(220,64%,16%)] transition-colors">
                  <Upload size={14} />
                  Replace image
                  <input type="file" accept="image/*" hidden onChange={handleFile} />
                </label>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-3 w-full h-48 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 cursor-pointer hover:border-[hsl(220,64%,16%)] hover:text-[hsl(220,64%,16%)] transition-colors">
                <ImageIcon size={32} className="text-slate-200" />
                <div className="text-center">
                  <p className="text-sm font-medium">Upload image</p>
                  <p className="text-xs text-slate-300 mt-0.5">JPEG, PNG, WEBP — max 10 MB</p>
                </div>
                <input type="file" accept="image/*" hidden onChange={handleFile} />
              </label>
            )}
            <p className="text-xs text-slate-400">
              Landscape images work best. Can be uploaded after creation.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
