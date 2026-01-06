/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Editor, useEditorState } from "@tiptap/react";
import { Level } from "@tiptap/extension-heading";
import { useCallback, useState, useEffect } from "react";

import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Highlighter,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Eraser,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading,
} from "lucide-react";

export function EditorToolbar({ editor }: { editor: Editor }) {
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [showHeading, setShowHeading] = useState(false);

  const imageAttrs = editor.getAttributes("image");

  useEffect(() => {
    if (imageAttrs?.caption) {
      setCaption(imageAttrs.caption);
    }
  }, [editor.isActive("image")]);

  const headingLevels: Level[] = [1, 2, 3, 4, 5, 6];

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

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

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isLink: ctx.editor.isActive("link"),
    }),
  });

  if (!editor) return null;

  const IconBtn = ({
    onClick,
    children,
    active = false,
  }: {
    onClick: () => void;
    children: React.ReactNode;
    active?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-200 ${active ? "bg-gray-300" : ""}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
      {/* Heading Dropdown */}
      <div className="relative">
        <IconBtn onClick={() => setShowHeading((s) => !s)}>
          <Heading size={18} />
        </IconBtn>

        {showHeading && (
          <div className="absolute z-10 mt-1 bg-white border rounded shadow">
            <button
              onClick={() => {
                editor.chain().focus().setParagraph().run();
                setShowHeading(false);
              }}
              className="block w-full px-3 py-1 hover:bg-gray-100 text-left"
            >
              Paragraph
            </button>
            {headingLevels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: lvl }).run();
                  setShowHeading(false);
                }}
                className="block w-full px-3 py-1 hover:bg-gray-100 text-left"
              >
                Heading {lvl}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Text formatting */}
      <IconBtn onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold size={18} />
      </IconBtn>

      <IconBtn onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic size={18} />
      </IconBtn>

      <IconBtn onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <Underline size={18} />
      </IconBtn>

      <IconBtn onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough size={18} />
      </IconBtn>

      <IconBtn onClick={() => editor.chain().focus().toggleCode().run()}>
        <Code size={18} />
      </IconBtn>

      <IconBtn
        onClick={() =>
          editor.chain().focus().toggleHighlight({ color: "#fde68a" }).run()
        }
      >
        <Highlighter size={18} />
      </IconBtn>

      {/* Lists */}
      <IconBtn onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List size={18} />
      </IconBtn>

      <IconBtn onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered size={18} />
      </IconBtn>

      <IconBtn onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote size={18} />
      </IconBtn>

      {/* Alignment (optional but important UX) */}
      <IconBtn
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft size={18} />
      </IconBtn>

      <IconBtn
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter size={18} />
      </IconBtn>

      <IconBtn
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight size={18} />
      </IconBtn>

      {/* Link */}
      <IconBtn onClick={setLink}>
        <LinkIcon size={18} />
      </IconBtn>

      <IconBtn
        onClick={() => editor.chain().focus().unsetLink().run()}
        active={editorState.isLink}
      >
        <Unlink size={18} />
      </IconBtn>

      {/* Image upload */}
      <label className="p-2 rounded hover:bg-gray-200 cursor-pointer">
        <ImageIcon size={18} />
        <input
          type="file"
          hidden
          accept="image/*"
          multiple
          onChange={(e) => {
            if (!e.target.files) return;
            Array.from(e.target.files).forEach(handleImageUpload);
            e.currentTarget.value = "";
          }}
        />
      </label>

      {/* Clear formatting */}
      <IconBtn onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        <Eraser size={18} />
      </IconBtn>

      {/* History */}
      <IconBtn onClick={() => editor.chain().focus().undo().run()}>
        <Undo size={18} />
      </IconBtn>

      <IconBtn onClick={() => editor.chain().focus().redo().run()}>
        <Redo size={18} />
      </IconBtn>

      {/* Image caption */}
      {editor.isActive("image") && (
        <div className="w-full mt-2">
          <input
            placeholder="Image caption..."
            className="w-full border px-2 py-1 text-sm rounded"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            onBlur={() => {
              editor
                .chain()
                .focus()
                .updateAttributes("image", { caption })
                .run();
            }}
          />
        </div>
      )}
    </div>
  );
}
