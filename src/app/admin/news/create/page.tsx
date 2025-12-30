// // app/admin/news/create/page.tsx
// "use client";
// import { useState } from "react";
// import RichTextEditor from "@/components/RichTextEditor";
// import { useRouter } from "next/navigation";

// export default function CreateNews() {
//   const [title, setTitle] = useState("");
//   const [slug, setSlug] = useState("");
//   const [content, setContent] = useState("");
//   const [images, setImages] = useState<string[]>([]);
//   const [saving, setSaving] = useState(false);
//   const router = useRouter();

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setSaving(true);
//     const res = await fetch("/api/news/create", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ title, slug, content, images }),
//     });
//     const json = await res.json();
//     setSaving(false);
//     if (res.ok) {
//       router.push(`/news/${json.id}`);
//     } else {
//       alert(json.error || "Failed");
//     }
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h2 className="text-xl font-semibold mb-4">Create News</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Title"
//           className="w-full p-3 border rounded"
//         />
//         <input
//           value={slug}
//           onChange={(e) => setSlug(e.target.value)}
//           placeholder="Slug (optional)"
//           className="w-full p-3 border rounded"
//         />
//         <RichTextEditor content={content} onChange={setContent} />
//         <div className="flex gap-2">
//           {/* images can be uploaded via editor; keep list for reference */}
//           {images.map((id) => (
//             <img
//               key={id}
//               src={`/api/news/image/${id}`}
//               className="h-16 w-16 object-cover rounded"
//             />
//           ))}
//         </div>
//         <button className="bg-blue-600 text-white p-3 rounded">
//           {saving ? "Saving..." : "Save News"}
//         </button>
//       </form>
//     </div>
//   );
// }

// app/admin/news/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import RichTextEditor from "@/components/EditorWrapper";

export default function CreateNewsPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/news/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, content, images }),
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
        <div className="flex gap-2">
          {images.map((id) => (
            <Image
              priority
              key={id}
              src={`/api/news/image/${id}`}
              alt={id}
              className="h-16 w-16 object-cover rounded"
            />
          ))}
        </div>
        <button className="bg-blue-600 text-white p-3 rounded">
          {saving ? "Saving..." : "Save News"}
        </button>
      </form>
    </div>
  );
}
