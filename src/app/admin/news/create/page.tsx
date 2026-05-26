"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Upload,
  X,
  Loader2,
  Save,
  Eye,
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import RichTextEditor from "@/components/editor/RichTextEditor";

export default function CreateNewsPage() {
  const { checking } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverPublicId, setCoverPublicId] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleCoverUpload(file: File) {
    setUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/news/upload-image", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setCoverImage(json.url);
      setCoverPublicId(json.publicId);
      toast.success("Cover image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required");
    if (!content.trim() || content === "<p></p>")
      return toast.error("Content cannot be empty");

    setSaving(true);
    try {
      const res = await fetch("/api/news/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, coverImage }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success("Article published!");
      router.push("/admin/news");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to publish");
    } finally {
      setSaving(false);
    }
  }

  if (checking) return <FormSkeleton />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(220,64%,16%)] font-heading tracking-wide">
            New Article
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Write and publish a news article
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(220,64%,16%)] text-white text-sm font-semibold hover:bg-[hsl(220,64%,20%)] transition-colors disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Article Title <span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a compelling headline…"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[hsl(220,64%,16%)]/30 placeholder:text-slate-300"
            />
          </div>

          {/* Editor */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Article Content <span className="text-red-500">*</span>
            </label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Cover image */}
          <div className="border border-slate-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <ImageIcon size={15} />
              Cover Image
            </p>

            {coverImage ? (
              <div className="relative group">
                <Image
                  src={coverImage}
                  alt="Cover"
                  width={400}
                  height={225}
                  className="w-full rounded-lg object-cover aspect-video"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <label className="cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-slate-800 text-xs font-semibold hover:bg-slate-100 transition-colors">
                    <Upload size={12} />
                    Replace
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0])
                          handleCoverUpload(e.target.files[0]);
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImage(null);
                      setCoverPublicId(null);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors"
                  >
                    <X size={12} />
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label
                className={`flex flex-col items-center justify-center h-36 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                  uploadingCover
                    ? "border-[hsl(220,64%,16%)] bg-[hsl(220,64%,16%)]/4"
                    : "border-slate-200 hover:border-[hsl(220,64%,16%)] hover:bg-[hsl(220,64%,16%)]/4"
                }`}
              >
                {uploadingCover ? (
                  <>
                    <Loader2
                      size={24}
                      className="animate-spin text-[hsl(220,64%,16%)] mb-2"
                    />
                    <span className="text-sm text-[hsl(220,64%,16%)]">
                      Uploading…
                    </span>
                  </>
                ) : (
                  <>
                    <Upload size={24} className="text-slate-300 mb-2" />
                    <span className="text-sm text-slate-400">
                      Click to upload cover image
                    </span>
                    <span className="text-xs text-slate-300 mt-1">
                      JPEG, PNG, WebP — max 8 MB
                    </span>
                  </>
                )}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  disabled={uploadingCover}
                  onChange={(e) => {
                    if (e.target.files?.[0])
                      handleCoverUpload(e.target.files[0]);
                    e.currentTarget.value = "";
                  }}
                />
              </label>
            )}

            {!coverImage && (
              <p className="text-xs text-slate-400 mt-2">
                If no cover is set, the first image from the article body is
                used automatically.
              </p>
            )}
          </div>

          {/* Tips */}
          <div className="border border-slate-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Eye size={15} />
              Publishing Tips
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5">
              <li>• Use a clear, descriptive headline</li>
              <li>• The first 150 characters form the excerpt</li>
              <li>
                • Images in the editor are stored on Cloudinary automatically
              </li>
              <li>• Set a cover image for best social sharing</li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-48 bg-slate-100 rounded-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-12 bg-slate-100 rounded-xl" />
          <div className="h-96 bg-slate-100 rounded-xl" />
        </div>
        <div className="h-64 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}
