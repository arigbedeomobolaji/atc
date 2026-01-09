/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/news/edit/[id]/[slug]page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RichTextEditor from "@/components/editor/RichTextEditor";
import Image from "next/image";

export default function EditNewsPage() {
  const { id, slug } = useParams<{ id: string; slug: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function check() {
      const res = await fetch("/api/auth/me");
      const json = await res.json();
      setLoading(false);
      if (!json.authenticated) router.push("/admin/login");
    }
    check();
  }, [router]);

  useEffect(() => {
    if (!id) return;

    async function load() {
      const res = await fetch(`/api/news/${id}`);
      const j = await res.json();

      if (!res.ok || !j.news) {
        router.push("/admin/news");
        return;
      }

      setTitle(j.news.title);
      setContent(j.news.content || "");
      setImages(j.news.images || []);
      setLoading(false);
    }

    load();
  }, [id, router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch(`/api/news/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    setSaving(false);

    if (res.ok) {
      router.push("/admin/news");
    } else {
      alert("Update failed");
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
          className="w-full p-3 border rounded"
        />

        {content !== "" && (
          <RichTextEditor content={content} onChange={setContent} />
        )}

        <div className="flex gap-2">
          {images.map((imgId) => (
            <Image
              key={imgId}
              src={`/api/news/image/${imgId}`}
              alt=""
              width={64}
              height={64}
              className="rounded object-cover"
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
