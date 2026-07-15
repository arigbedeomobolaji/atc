"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { ArrowLeft, Loader2, Save, Upload, ImageIcon } from "lucide-react";

const INPUT =
  "w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(220,64%,16%)]/20 focus:border-[hsl(220,64%,16%)]/40 transition-colors placeholder:text-slate-300";
const LABEL = "block text-sm font-semibold text-slate-700 mb-1.5";

export default function EditPlatformPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({ caption: "", description: "" });

  useEffect(() => {
    fetch("/api/platforms")
      .then((r) => r.json())
      .then((j) => {
        const p = j.platforms?.find((x: { _id: string }) => x._id === id);
        if (p) {
          setForm({ caption: p.caption, description: p.description || "" });
          if (p.image) setPreview(p.image);
        }
      });
  }, [id]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.caption.trim()) return toast.error("Caption is required");

    setSaving(true);
    try {
      const res = await fetch(`/api/platforms/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");

      if (file) {
        setUploading(true);
        const fd = new FormData();
        const compressed = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
        });
        fd.append("file", compressed);
        const up = await fetch(`/api/platforms/${id}/upload-image`, {
          method: "POST",
          body: fd,
        });
        setUploading(false);
        if (!up.ok) toast.warning("Details saved but image upload failed");
      }

      toast.success("Platform updated");
      router.push("/admin/platforms");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
      setUploading(false);
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
              Edit Platform
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">Update platform details and image</p>
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
            disabled={saving || uploading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-sm font-semibold hover:bg-[hsl(220,64%,22%)] transition-colors disabled:opacity-60"
          >
            {saving || uploading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            {uploading ? "Uploading…" : saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      <form id="platform-form" onSubmit={handleSave}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                value={form.caption}
                onChange={(e) => setForm({ ...form, caption: e.target.value })}
              />
            </div>
            <div>
              <label className={LABEL}>Description</label>
              <textarea
                className={INPUT + " h-36 resize-none"}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

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
          </div>
        </div>
      </form>
    </div>
  );
}
