"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import React from "react";
// import axios from "axios";

export default function RichTextEditor({
  content = "",
  onChange,
}: {
  content?: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Image, Link],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  async function handleImageUpload(file: File) {
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string; // data:image/...
      // POST to upload API
      try {
        const res = await fetch("/api/news/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, data: dataUrl }),
        });
        const json = await res.json();
        if (json.fileId) {
          // image URL endpoint
          const url = `/api/news/image/${json.fileId}`;
          editor?.chain().focus().setImage({ src: url }).run();
        } else {
          console.error("Upload failed", json);
        }
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <div className="border rounded-md p-2 mb-2 flex gap-2">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className="px-2 py-1 rounded hover:bg-gray-100"
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className="px-2 py-1 rounded hover:bg-gray-100"
        >
          Italic
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (!e.target.files) return;
            handleImageUpload(e.target.files[0]);
            e.currentTarget.value = "";
          }}
        />
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
