"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  ArrowLeft,
  Upload,
  Trash2,
  Loader2,
  ImageIcon,
  CheckCircle2,
  X,
  Pencil,
  Images,
} from "lucide-react";
import imageCompression from "browser-image-compression";

type AlbumImage = { url: string; publicId: string; caption: string };
type Album = {
  _id: string;
  title: string;
  description: string;
  category: string;
  scope: string;
  coverImage: string | null;
  images: AlbumImage[];
};

const CATEGORY_LABEL: Record<string, string> = {
  CEREMONY: "Ceremonies & Parades",
  TRAINING: "Training & Education",
  EXERCISE: "Exercises & Operations",
  LEADERSHIP: "Headquarters & Leadership",
  INFRASTRUCTURE: "Infrastructure & Facilities",
  COMMUNITY: "Community & Social Events",
  CADETS: "Students & Cadets Life",
  HISTORY: "History & Archives",
  UNITS: "Units & Departments",
};

export default function AlbumDetailPage() {
  const { albumId } = useParams<{ albumId: string }>();
  const inputRef = useRef<HTMLInputElement>(null);

  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/albums/${albumId}`)
      .then((r) => r.json())
      .then((j) => setAlbum(j.album))
      .finally(() => setLoading(false));
  }, [albumId]);

  function handleFiles(selected: FileList | null) {
    if (!selected) return;
    const arr = Array.from(selected).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...arr]);
    setPreviews((prev) => [...prev, ...arr.map((f) => URL.createObjectURL(f))]);
  }

  function removeFile(i: number) {
    URL.revokeObjectURL(previews[i]);
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleUpload() {
    if (files.length === 0) return toast.error("Select at least one image");
    setUploading(true);
    setUploaded(0);
    let success = 0;
    const newImages: AlbumImage[] = [];

    for (const file of files) {
      try {
        const compressed = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
        });
        const fd = new FormData();
        fd.append("file", compressed);
        const res = await fetch(`/api/albums/${albumId}/upload`, { method: "POST", body: fd });
        if (res.ok) {
          const json = await res.json();
          newImages.push(json.image);
          success++;
        }
      } catch {
        /* continue on individual failure */
      }
      setUploaded((s) => s + 1);
    }

    setAlbum((prev) =>
      prev
        ? {
            ...prev,
            images: [...prev.images, ...newImages],
            coverImage: prev.coverImage ?? newImages[0]?.url ?? null,
          }
        : prev
    );

    previews.forEach((p) => URL.revokeObjectURL(p));
    setFiles([]);
    setPreviews([]);
    setUploading(false);
    setUploaded(0);
    toast.success(`${success} of ${files.length} photo${files.length > 1 ? "s" : ""} uploaded`);
  }

  async function handleDeleteImage(publicId: string) {
    if (!confirm("Remove this photo?")) return;
    setDeletingId(publicId);
    const res = await fetch(`/api/albums/${albumId}/images`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId }),
    });
    if (res.ok) {
      setAlbum((prev) =>
        prev
          ? {
              ...prev,
              images: prev.images.filter((i) => i.publicId !== publicId),
              coverImage:
                prev.coverImage ===
                prev.images.find((i) => i.publicId === publicId)?.url
                  ? prev.images.filter((i) => i.publicId !== publicId)[0]?.url ?? null
                  : prev.coverImage,
            }
          : prev
      );
      toast.success("Photo removed");
    } else {
      toast.error("Failed to remove photo");
    }
    setDeletingId(null);
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-slate-100 rounded-lg animate-pulse" />
        <div className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p>Album not found.</p>
        <Link href="/admin/gallery" className="text-[hsl(220,64%,16%)] underline text-sm mt-2 inline-block">
          Back to Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/gallery"
            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[hsl(220,64%,16%)] flex items-center justify-center shrink-0">
              <Images size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[hsl(220,64%,16%)] font-heading tracking-wide line-clamp-1">
                {album.title}
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                {CATEGORY_LABEL[album.category] ?? album.category} ·{" "}
                {album.images.length} photo{album.images.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
        <Link
          href={`/admin/gallery/albums/${albumId}/edit`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors"
        >
          <Pencil size={14} />
          Edit Details
        </Link>
      </div>

      {/* Upload zone */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Upload Photos
        </p>
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          className="flex flex-col items-center justify-center gap-3 h-36 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 cursor-pointer hover:border-[hsl(220,64%,16%)] hover:bg-[hsl(220,64%,16%)]/[0.02] transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
            <ImageIcon size={22} className="text-slate-300" />
          </div>
          <p className="text-sm font-medium text-slate-500">
            Click or drag photos here · multiple files allowed
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {previews.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {files.length} photo{files.length > 1 ? "s" : ""} ready
              </p>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(220,64%,16%)] text-white text-sm font-semibold hover:bg-[hsl(220,64%,22%)] transition-colors disabled:opacity-60"
              >
                {uploading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Upload size={14} />
                )}
                {uploading ? `Uploading ${uploaded}/${files.length}…` : "Upload All"}
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {previews.map((src, i) => (
                <div
                  key={i}
                  className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-50"
                >
                  <Image src={src} alt={`Preview ${i + 1}`} fill className="object-cover" />
                  {uploading && uploaded > i && (
                    <div className="absolute inset-0 bg-[hsl(220,64%,16%)]/60 flex items-center justify-center">
                      <CheckCircle2 size={20} className="text-[hsl(45,68%,47%)]" />
                    </div>
                  )}
                  {!uploading && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(i);
                      }}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {uploading && (
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-1.5 bg-[hsl(220,64%,16%)] rounded-full transition-all duration-300"
                  style={{ width: `${(uploaded / files.length) * 100}%` }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Existing photos */}
      {album.images.length > 0 ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {album.images.length} photo{album.images.length !== 1 ? "s" : ""} in this album
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {album.images.map((img) => (
              <div
                key={img.publicId}
                className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
              >
                <Image src={img.url} alt={img.caption || "Photo"} fill className="object-cover" />
                {album.coverImage === img.url && (
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[hsl(45,68%,47%)] text-[hsl(220,64%,16%)] uppercase tracking-wide">
                    Cover
                  </span>
                )}
                <button
                  onClick={() => handleDeleteImage(img.publicId)}
                  disabled={deletingId === img.publicId}
                  className="absolute top-1.5 right-1.5 w-7 h-7 rounded-lg bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[hsl(350,66%,33%)]"
                >
                  {deletingId === img.publicId ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Trash2 size={12} />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 border border-dashed border-slate-200 rounded-2xl">
          <ImageIcon size={32} className="mb-3 text-slate-200" />
          <p className="text-sm font-medium">No photos yet</p>
          <p className="text-xs mt-1">Upload photos using the zone above</p>
        </div>
      )}
    </div>
  );
}
