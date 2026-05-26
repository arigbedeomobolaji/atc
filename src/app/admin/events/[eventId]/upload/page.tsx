"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowLeft, Upload, Loader2, X, ImageIcon, CheckCircle2 } from "lucide-react";

export default function UploadEventImagesPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const inputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(0);

  function handleFiles(selected: FileList | null) {
    if (!selected) return;
    const arr = Array.from(selected).filter(f => f.type.startsWith("image/"));
    setFiles(prev => [...prev, ...arr]);
    const urls = arr.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...urls]);
  }

  function removeFile(i: number) {
    URL.revokeObjectURL(previews[i]);
    setFiles(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  }

  async function handleUpload() {
    if (files.length === 0) return toast.error("Select at least one image");
    setUploading(true);
    setUploaded(0);
    let success = 0;

    for (const file of files) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("caption", "Event Image");
        fd.append("category", "EVENT");
        fd.append("scope", "COMMAND");
        fd.append("eventId", eventId as string);
        const res = await fetch("/api/gallery/upload", { method: "POST", body: fd });
        if (res.ok) success++;
      } catch { /* continue */ }
      setUploaded(s => s + 1);
    }

    toast.success(`${success} of ${files.length} image${files.length > 1 ? "s" : ""} uploaded`);
    setFiles([]); setPreviews([]); setUploading(false); setUploaded(0);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/admin/events" className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(220,64%,16%)] font-heading tracking-wide">Upload Event Photos</h1>
            <p className="text-slate-400 text-sm mt-0.5">Add photos to this event&apos;s gallery</p>
          </div>
        </div>
        {files.length > 0 && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-sm font-semibold hover:bg-[hsl(220,64%,22%)] transition-colors disabled:opacity-60"
          >
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {uploading ? `Uploading ${uploaded}/${files.length}…` : `Upload ${files.length} photo${files.length > 1 ? "s" : ""}`}
          </button>
        )}
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        className="flex flex-col items-center justify-center gap-4 h-48 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 cursor-pointer hover:border-[hsl(220,64%,16%)] hover:bg-[hsl(220,64%,16%)]/[0.02] transition-colors"
      >
        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
          <ImageIcon size={24} className="text-slate-300" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-600">Click or drag photos here</p>
          <p className="text-xs text-slate-400 mt-0.5">JPEG, PNG, WebP supported · multiple files allowed</p>
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{files.length} photo{files.length > 1 ? "s" : ""} ready to upload</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {previews.map((src, i) => (
              <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                <Image src={src} alt={`Preview ${i + 1}`} fill className="object-cover" />
                {uploading && uploaded > i && (
                  <div className="absolute inset-0 bg-[hsl(220,64%,16%)]/60 flex items-center justify-center">
                    <CheckCircle2 size={24} className="text-[hsl(45,68%,47%)]" />
                  </div>
                )}
                {!uploading && (
                  <button
                    onClick={e => { e.stopPropagation(); removeFile(i); }}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {/* Progress bar when uploading */}
          {uploading && (
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 bg-[hsl(220,64%,16%)] rounded-full transition-all duration-300"
                style={{ width: `${(uploaded / files.length) * 100}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
