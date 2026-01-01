"use client";

import { useState } from "react";
import RichTextEditor from "@/components/RichTextEditor";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CreateNewsPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/news/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, content }),
    });
    const json = await res.json();
    setSaving(false);
    if (res.ok) {
      router.push(`/news/${json.id}`);
    } else {
      alert(json.error || "Failed to create news");
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Create News</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-3 border rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full p-3 border rounded"
          placeholder="Slug (optional)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <RichTextEditor content={content} onChange={setContent} />

        <button className="bg-blue-600 text-white p-3 rounded">
          {saving ? "Saving..." : "Save News"}
        </button>
      </form>
    </div>
  );
}
