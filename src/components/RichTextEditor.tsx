"use client";

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useState } from "react";

export default function RichTextEditor({
  content = "",
  onChange,
}: {
  content?: string;
  onChange: (html: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
      Link,
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  async function handleImageUpload(file: File) {
    if (!editor) return;

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const res = await fetch("/api/news/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            data: reader.result,
          }),
        });

        const json = await res.json();

        if (!res.ok) throw new Error(json.error);

        const imageUrl = `/api/news/image/${json.fileId}`;
        editor.chain().focus().setImage({ src: imageUrl }).run();
      };

      reader.readAsDataURL(file);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="border rounded-md">
      <div className="flex gap-2 p-2 border-b bg-gray-50">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className="btn"
        >
          Bold
        </button>

        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className="btn"
        >
          Italic
        </button>

        <label className="cursor-pointer text-sm px-2 py-1 border rounded bg-white">
          {uploading ? "Uploading..." : "Image"}
          <input
            type="file"
            accept="image/*"
            hidden
            disabled={uploading}
            onChange={(e) => {
              if (!e.target.files?.[0]) return;
              handleImageUpload(e.target.files[0]);
              e.currentTarget.value = "";
            }}
          />
        </label>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="p-3 min-h-[200px] prose max-w-none"
      />
    </div>
  );
}

// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Image from "@tiptap/extension-image";
// import Link from "@tiptap/extension-link";
// // import axios from "axios";

// export default function RichTextEditor({
//   content = "",
//   onChange,
// }: {
//   content?: string;
//   onChange: (html: string) => void;
// }) {
//   const editor = useEditor({
//     immediatelyRender: false,
//     extensions: [StarterKit, Image, Link],
//     content,
//     onUpdate: ({ editor }) => {
//       onChange(editor.getHTML());
//     },
//   });

//   async function handleImageUpload(file: File) {
//     const reader = new FileReader();
//     reader.onload = async () => {
//       const dataUrl = reader.result as string; // data:image/...
//       // POST to upload API
//       try {
//         const res = await fetch("/api/news/upload-image", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ filename: file.name, data: dataUrl }),
//         });
//         const json = await res.json();
//         if (json.fileId) {
//           // image URL endpoint
//           const url = `/api/news/image/${json.fileId}`;
//           editor?.chain().focus().setImage({ src: url }).run();
//         } else {
//           console.error("Upload failed", json);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     reader.readAsDataURL(file);
//   }

//   return (
//     <div>
//       <div className="border rounded-md p-2 mb-2 flex gap-2">
//         <button
//           type="button"
//           onClick={() => editor?.chain().focus().toggleBold().run()}
//           className="px-2 py-1 rounded hover:bg-gray-100"
//         >
//           Bold
//         </button>
//         <button
//           type="button"
//           onClick={() => editor?.chain().focus().toggleItalic().run()}
//           className="px-2 py-1 rounded hover:bg-gray-100"
//         >
//           Italic
//         </button>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => {
//             if (!e.target.files) return;
//             handleImageUpload(e.target.files[0]);
//             e.currentTarget.value = "";
//           }}
//         />
//       </div>

//       <EditorContent editor={editor} />
//     </div>
//   );
// }
