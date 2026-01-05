/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import CodeBlock from "@tiptap/extension-code-block";
import Blockquote from "@tiptap/extension-blockquote";
import HardBreak from "@tiptap/extension-hard-break";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

export const CustomImage = Image.extend({
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      caption: { default: null },
      source: { default: null },
    };
  },
  renderHTML({ HTMLAttributes }) {
    const { caption, source, ...attrs } = HTMLAttributes;
    return [
      "figure",
      { class: "editor-figure" },
      ["img", attrs],
      caption ? ["figcaption", { class: "editor-caption" }, caption] : "",
      source ? ["span", { class: "editor-source" }, `Source: ${source}`] : "",
    ];
  },
});

export default function RichTextEditor2({
  content = "",
  onChange,
}: {
  content?: string;
  onChange: (html: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  // const editor = useEditor({
  //   immediatelyRender: false,
  //   extensions: [
  //     StarterKit.configure({
  //       heading: false, // we'll use our own Heading extension
  //     }),
  //     TextStyle,
  //     Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
  //     // BulletList,
  //     // OrderedList,
  //     // ListItem,
  //     CodeBlock,
  //     Blockquote,
  //     HardBreak,
  //     HorizontalRule,
  //     CustomImage,
  //     Link,
  //   ],
  //   content,
  //   onUpdate: ({ editor }) => onChange(editor.getHTML()),
  // });

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextStyle,
      CustomImage,
      Link.configure({
        openOnClick: false,
      }),
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

        editor
          .chain()
          .focus()
          .insertContent({
            type: "image",
            attrs: {
              src: `/api/news/image/${json.fileId}`,
              caption: "",
              source: "",
            },
          })
          .run();
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      alert(err.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="border rounded-md bg-white">
      {/* Toolbar */}
      {editor && (
        <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-50">
          {/* Text styles */}
          {(
            [
              ["Bold", () => editor?.chain().focus().toggleBold().run()],
              ["Italic", () => editor?.chain().focus().toggleItalic().run()],
              ["Strike", () => editor?.chain().focus().toggleStrike().run()],
              ["Code", () => editor?.chain().focus().toggleCode().run()],
              [
                "Clear marks",
                () => editor?.chain().focus().unsetAllMarks().run(),
              ],
              ["Clear nodes", () => editor?.chain().focus().clearNodes().run()],
            ] as [string, () => void][]
          ).map(([label, action]) => (
            <button
              key={label} // now TS knows it's a string
              type="button"
              onClick={action}
              className="btn"
            >
              {label}
            </button>
          ))}
          {/* {[
          ["Bold", () => editor?.chain().focus().toggleBold().run()],
          ["Italic", () => editor?.chain().focus().toggleItalic().run()],
          ["Strike", () => editor?.chain().focus().toggleStrike().run()],
          ["Code", () => editor?.chain().focus().toggleCode().run()],
          ["Clear marks", () => editor?.chain().focus().unsetAllMarks().run()],
          ["Clear nodes", () => editor?.chain().focus().clearNodes().run()],
        ].map(([label, action]) => (
          <button
            key={label}
            type="button"
            onClick={action as any}
            className="btn"
          >
            {label}
          </button>
        ))} */}

          {/* Headings */}
          {(
            [
              ["Paragraph", () => editor?.chain().focus().setParagraph().run()],
              [
                "H1",
                () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
              ],
              [
                "H2",
                () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
              ],
              [
                "H3",
                () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
              ],
              [
                "H4",
                () => editor?.chain().focus().toggleHeading({ level: 4 }).run(),
              ],
              [
                "H5",
                () => editor?.chain().focus().toggleHeading({ level: 5 }).run(),
              ],
              [
                "H6",
                () => editor?.chain().focus().toggleHeading({ level: 6 }).run(),
              ],
            ] as [string, () => void][]
          ).map(([label, action]) => (
            <button
              key={label}
              type="button"
              onClick={action as any}
              className="btn"
            >
              {label}
            </button>
          ))}

          {/* Lists & blocks */}
          {(
            [
              [
                "Bullet list",
                () => editor?.chain().focus().toggleBulletList().run(),
              ],
              [
                "Ordered list",
                () => editor?.chain().focus().toggleOrderedList().run(),
              ],
              [
                "Code block",
                () => editor?.chain().focus().toggleCodeBlock().run(),
              ],
              [
                "Blockquote",
                () => editor?.chain().focus().toggleBlockquote().run(),
              ],
              [
                "Horizontal rule",
                () => editor?.chain().focus().setHorizontalRule().run(),
              ],
              [
                "Hard break",
                () => editor?.chain().focus().setHardBreak().run(),
              ],
              ["Undo", () => editor?.chain().focus().undo().run()],
              ["Redo", () => editor?.chain().focus().redo().run()],
            ] as [string, () => void][]
          ).map(([label, action]) => (
            <button
              key={label}
              type="button"
              onClick={action as any}
              className="btn"
            >
              {label}
            </button>
          ))}

          {/* Image upload */}
          <label className="cursor-pointer text-sm px-2 py-1 border rounded bg-white">
            {uploading ? "Uploading..." : "Image"}
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                if (!e.target.files) return;
                Array.from(e.target.files).forEach(handleImageUpload);
                e.currentTarget.value = "";
              }}
            />
          </label>
        </div>
      )}

      {/* Selected image metadata */}
      {editor?.isActive("image") && (
        <div className="flex gap-2 p-2 bg-gray-100 border-t">
          <input
            placeholder="Caption"
            className="border p-1 text-sm w-full"
            onChange={(e) =>
              editor
                ?.chain()
                .updateAttributes("image", { caption: e.target.value })
                .run()
            }
          />
          <input
            placeholder="Source / Credit"
            className="border p-1 text-sm w-full"
            onChange={(e) =>
              editor
                ?.chain()
                .updateAttributes("image", { source: e.target.value })
                .run()
            }
          />
        </div>
      )}

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="p-4 min-h-62.5 editor-content max-w-none"
      />
    </div>
  );
}
