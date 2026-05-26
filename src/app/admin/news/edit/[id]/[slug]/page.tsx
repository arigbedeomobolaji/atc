"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Save,
  Loader2,
  Upload,
  X,
  ImageIcon,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import RichTextEditor from "@/components/editor/RichTextEditor";
import Link from "next/link";

export default function EditNewsPage() {
  const { id, slug } = useParams<{ id: string; slug: string }>();
  const router = useRouter();
  const { checking } = useAuth();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (checking || !id) return;
    fetch(`/api/news/${id}`)
      .then((r) => r.json())
      .then((j) => {
        if (!j.news) {
          toast.error("Article not found");
          router.push("/admin/news");
          return;
        }
        setTitle(j.news.title);
        setContent(j.news.content || "");
        setCoverImage(j.news.coverImage || null);
      })
      .catch(() => toast.error("Failed to load article"))
      .finally(() => setLoading(false));
  }, [checking, id, router]);

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
      toast.success("Cover image updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required");

    setSaving(true);
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, coverImage }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Article updated");
      router.push("/admin/news");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (checking || loading) return <FormSkeleton />;

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(220,64%,16%)] font-heading tracking-wide">
            Edit Article
          </h1>
          <p className="text-slate-400 text-sm mt-0.5 truncate max-w-xs">
            {title || "Untitled"}
          </p>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <Link
            href={`/news/${slug}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors"
          >
            <ExternalLink size={14} />
            View live
          </Link>
          <button
            type="button"
            onClick={() => router.push("/admin/news")}
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
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Article Title <span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title…"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[hsl(220,64%,16%)]/30 placeholder:text-slate-300"
            />
          </div>

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
                    onClick={() => setCoverImage(null)}
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
                      Upload cover image
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
          </div>

          {/* Metadata card */}
          <div className="border border-slate-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-slate-700 mb-2">
              Article Info
            </p>
            <dl className="text-xs text-slate-500 space-y-1.5">
              <div className="flex justify-between">
                <dt>ID</dt>
                <dd className="font-mono text-slate-400 truncate max-w-[100px]">
                  {id}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Slug</dt>
                <dd className="font-mono text-slate-400 truncate max-w-[140px]">
                  {slug}
                </dd>
              </div>
            </dl>
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
