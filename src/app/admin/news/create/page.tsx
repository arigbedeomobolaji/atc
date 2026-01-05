// app/admin/news/create/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/editor/RichTextEditor";
export default function CreateNewsPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      const res = await fetch("/api/auth/me");
      const json = await res.json();
      setLoading(false);
      if (!json.authenticated) router.push("/admin/login");
    }
    check();
  }, [router]);

  if (loading) return <div className="p-8">Loading...</div>;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/news/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    const json = await res.json();
    console.log({ json });
    setSaving(false);
    if (res.ok) {
      router.push(`/news/${json.slug}`);
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

        <RichTextEditor content={content} onChange={setContent} />

        <button className="bg-blue-600 text-white p-3 rounded">
          {saving ? "Saving..." : "Save News"}
        </button>
      </form>
    </div>
  );
}
