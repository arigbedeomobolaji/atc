"use client";

import { Editor, useEditorState } from "@tiptap/react";
import { Level } from "@tiptap/extension-heading";
import { useCallback, useState, useRef } from "react";
import { toast } from "sonner";
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
  ChevronDown,
  Loader2,
  Minus,
} from "lucide-react";

const HEADING_LEVELS: Level[] = [1, 2, 3, 4, 5, 6];

export function EditorToolbar({ editor }: { editor: Editor }) {
  const [uploading, setUploading] = useState(false);
  const [showHeading, setShowHeading] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isLink: ctx.editor.isActive("link"),
      isBold: ctx.editor.isActive("bold"),
      isItalic: ctx.editor.isActive("italic"),
      isUnderline: ctx.editor.isActive("underline"),
      isStrike: ctx.editor.isActive("strike"),
      isCode: ctx.editor.isActive("code"),
      isBullet: ctx.editor.isActive("bulletList"),
      isOrdered: ctx.editor.isActive("orderedList"),
      isBlockquote: ctx.editor.isActive("blockquote"),
      isAlignLeft: ctx.editor.isActive({ textAlign: "left" }),
      isAlignCenter: ctx.editor.isActive({ textAlign: "center" }),
      isAlignRight: ctx.editor.isActive({ textAlign: "right" }),
      currentHeading: HEADING_LEVELS.find((l) =>
        ctx.editor.isActive("heading", { level: l })
      ),
    }),
  });

  const headingLabel = editorState.currentHeading
    ? `H${editorState.currentHeading}`
    : "¶";

  const setLink = useCallback(() => {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  async function handleImageUpload(files: FileList) {
    for (const file of Array.from(files)) {
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", file);

        const res = await fetch("/api/news/upload-image", {
          method: "POST",
          body: fd,
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);

        editor
          .chain()
          .focus()
          .insertContent({
            type: "image",
            attrs: { src: json.url, caption: "", alt: file.name },
          })
          .run();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Image upload failed"
        );
      } finally {
        setUploading(false);
      }
    }
  }

  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b bg-slate-50 rounded-t-lg">
      {/* Heading picker */}
      <div className="relative" ref={headingRef}>
        <ToolBtn
          onClick={() => setShowHeading((s: boolean) => !s)}
          title="Heading"
          className="min-w-[44px] font-mono text-xs font-bold"
        >
          {headingLabel}
          <ChevronDown size={12} className="ml-0.5" />
        </ToolBtn>

        {showHeading && (
          <div className="absolute z-20 top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden min-w-[120px]">
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().setParagraph().run();
                setShowHeading(false);
              }}
              className="w-full px-4 py-2 text-sm text-left hover:bg-slate-50 font-normal"
            >
              Paragraph
            </button>
            {HEADING_LEVELS.map((lvl) => (
              <button
                type="button"
                key={lvl}
                onClick={() => {
                  editor.chain().focus().toggleHeading({ level: lvl }).run();
                  setShowHeading(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-slate-50 ${
                  editorState.currentHeading === lvl
                    ? "bg-[hsl(220,64%,16%)]/8 font-semibold text-[hsl(220,64%,16%)]"
                    : ""
                }`}
                style={{ fontSize: `${1.1 - lvl * 0.07}rem` }}
              >
                H{lvl} — Heading {lvl}
              </button>
            ))}
          </div>
        )}
      </div>

      <Divider />

      {/* Text formatting */}
      <ToolBtn
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editorState.isBold}
        title="Bold"
      >
        <Bold size={15} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editorState.isItalic}
        title="Italic"
      >
        <Italic size={15} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editorState.isUnderline}
        title="Underline"
      >
        <Underline size={15} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editorState.isStrike}
        title="Strikethrough"
      >
        <Strikethrough size={15} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editorState.isCode}
        title="Inline code"
      >
        <Code size={15} />
      </ToolBtn>
      <ToolBtn
        onClick={() =>
          editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run()
        }
        title="Highlight"
      >
        <Highlighter size={15} />
      </ToolBtn>

      <Divider />

      {/* Lists & quotes */}
      <ToolBtn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editorState.isBullet}
        title="Bullet list"
      >
        <List size={15} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editorState.isOrdered}
        title="Ordered list"
      >
        <ListOrdered size={15} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editorState.isBlockquote}
        title="Blockquote"
      >
        <Quote size={15} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal rule"
      >
        <Minus size={15} />
      </ToolBtn>

      <Divider />

      {/* Alignment */}
      <ToolBtn
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        active={editorState.isAlignLeft}
        title="Align left"
      >
        <AlignLeft size={15} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        active={editorState.isAlignCenter}
        title="Align center"
      >
        <AlignCenter size={15} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        active={editorState.isAlignRight}
        title="Align right"
      >
        <AlignRight size={15} />
      </ToolBtn>

      <Divider />

      {/* Link */}
      <ToolBtn onClick={setLink} title="Set link">
        <LinkIcon size={15} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().unsetLink().run()}
        active={editorState.isLink}
        title="Remove link"
      >
        <Unlink size={15} />
      </ToolBtn>

      {/* Image upload */}
      <label
        className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-slate-200 cursor-pointer transition-colors text-slate-600 hover:text-slate-900"
        title="Insert image"
      >
        {uploading ? (
          <Loader2 size={15} className="animate-spin text-[hsl(220,64%,16%)]" />
        ) : (
          <ImageIcon size={15} />
        )}
        <input
          type="file"
          hidden
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={(e) => {
            if (e.target.files?.length) handleImageUpload(e.target.files);
            e.currentTarget.value = "";
          }}
        />
      </label>

      <Divider />

      {/* Formatting clear + history */}
      <ToolBtn
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        title="Clear formatting"
      >
        <Eraser size={15} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().undo().run()}
        title="Undo"
      >
        <Undo size={15} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().redo().run()}
        title="Redo"
      >
        <Redo size={15} />
      </ToolBtn>

    </div>
  );
}

function ToolBtn({
  onClick,
  children,
  active = false,
  title,
  className = "",
}: {
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
  title?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`inline-flex items-center justify-center w-8 h-8 rounded text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 ${
        active
          ? "bg-[hsl(220,64%,16%)] text-white hover:bg-[hsl(220,64%,20%)] hover:text-white"
          : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-slate-200 mx-0.5 shrink-0" />;
}

