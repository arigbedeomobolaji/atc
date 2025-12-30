/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/news/edit/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";
import Image from "next/image";

export default function EditNewsPage() {
  const params = useParams();
  const id = (params as any).id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/news/${id}`);
      const j = await res.json();
      if (res.ok && j.news) {
        const n = j.news;
        setTitle(n.title);
        setSlug(n.slug);
        setContent(n.content || "");
        setImages(
          (n.images || []).map((o: any) => (o.toString ? o.toString() : o))
        );
      } else {
        alert("Not found");
        router.push("/admin/news");
      }
      setLoading(false);
    }
    load();
  }, [id, router]);

  async function handleSave(e: any) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/news/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title, slug, content, images }),
    });
    const j = await res.json();
    setSaving(false);
    if (res.ok) {
      router.push("/admin/news");
    } else {
      alert(j.error || "Failed");
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Edit News</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-3 border rounded"
        />
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Slug"
          className="w-full p-3 border rounded"
        />
        <RichTextEditor content={content} onChange={setContent} />
        <div className="flex gap-2">
          {images.map((id) => (
            <Image
              priority
              alt={id}
              key={id}
              src={`/api/news/image/${id}`}
              className="h-16 w-16 object-cover rounded"
            />
          ))}
        </div>
        <button className="bg-blue-600 text-white p-3 rounded">
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
