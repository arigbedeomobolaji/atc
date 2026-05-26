"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import { Dropcursor } from "@tiptap/extensions";
import { CustomImage } from "./extensions/CustomImage";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import History from "@tiptap/extension-history";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import Heading from "@tiptap/extension-heading";
import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";
import Blockquote from "@tiptap/extension-blockquote";
import HardBreak from "@tiptap/extension-hard-break";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import CodeBlock from "@tiptap/extension-code-block";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { EditorToolbar } from "./EditorToolbar";
import { Image as ImageIcon } from "lucide-react";

/* ── Caption bar — rendered between toolbar and content ── */
function ImageCaptionBar({ editor }: { editor: Editor }) {
  const attrs = editor.getAttributes("image");
  const [caption, setCaption] = useState(attrs?.caption || "");

  // Sync when a different image gets selected
  useEffect(() => {
    setCaption(attrs?.caption || "");
  }, [attrs?.src]);

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-[hsl(220,64%,16%)]/[0.05] border-b border-[hsl(220,64%,16%)]/15">
      <div className="flex items-center gap-1.5 shrink-0">
        <ImageIcon size={13} className="text-[hsl(220,64%,16%)]" />
        <span className="text-xs font-semibold text-[hsl(220,64%,16%)] uppercase tracking-wide">
          Caption
        </span>
      </div>
      <input
        className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[hsl(220,64%,16%)]/25 bg-white placeholder:text-slate-300"
        placeholder="Add a caption for this image…"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        onBlur={() =>
          editor
            .chain()
            .focus()
            .updateAttributes("image", { caption: caption.trim() })
            .run()
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            editor
              .chain()
              .focus()
              .updateAttributes("image", { caption: caption.trim() })
              .run();
          }
          if (e.key === "Escape") {
            e.preventDefault();
            editor.commands.focus();
          }
        }}
      />
    </div>
  );
}

export default function RichTextEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Document,
      Paragraph,
      Text,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      CodeBlock,
      HorizontalRule,
      HardBreak,
      Bold,
      Italic,
      Underline,
      Strike,
      Code,
      Highlight.configure({ multicolor: true }),
      History,
      CustomImage,
      Dropcursor,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
        isAllowedUri: (url, ctx) => {
          try {
            const parsed = url.includes(":")
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`);
            if (!ctx.defaultValidate(parsed.href)) return false;
            const protocol = parsed.protocol.replace(":", "");
            const allowed = ctx.protocols.map((p) =>
              typeof p === "string" ? p : p.scheme
            );
            return allowed.includes(protocol);
          } catch {
            return false;
          }
        },
        shouldAutoLink: (url) => {
          try {
            new URL(url.includes(":") ? url : `https://${url}`);
            return true;
          } catch {
            return false;
          }
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none min-h-[480px] px-8 py-6 focus:outline-none " +
          "[&_ol]:list-decimal [&_ul]:list-disc " +
          "[&_h1]:text-3xl [&_h1]:font-black [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-xl [&_h3]:font-semibold " +
          "[&_blockquote]:border-l-4 [&_blockquote]:border-[hsl(220,64%,16%)] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-500 " +
          "[&_a]:text-[hsl(220,64%,35%)] [&_a]:underline [&_a]:underline-offset-2 " +
          "[&_img]:rounded-lg [&_img]:max-w-full [&_img]:mx-auto " +
          "[&_figure]:my-6 [&_figure]:text-center " +
          "[&_figcaption]:text-slate-400 [&_figcaption]:text-xs [&_figcaption]:mt-2 [&_figcaption]:italic " +
          "[&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono " +
          "[&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto " +
          "[&_hr]:border-slate-200",
      },
    },
  });

  const isImageActive = useEditorState({
    editor,
    selector: (ctx) => ctx.editor?.isActive("image") ?? false,
  });

  const wordCount = editor
    ? editor.getText().trim().split(/\s+/).filter(Boolean).length
    : 0;
  const charCount = editor ? editor.getText().length : 0;

  if (!editor) return null;

  return (
    <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
      {/* Toolbar */}
      <EditorToolbar editor={editor} />

      {/* Contextual caption bar — only shown when an image is selected */}
      {isImageActive && <ImageCaptionBar editor={editor} />}

      {/* Editor content */}
      <EditorContent editor={editor} />

      {/* Status bar */}
      <div className="flex items-center justify-between px-5 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-400">
        <span className="font-medium text-slate-500">Rich Text Editor</span>
        <div className="flex gap-4">
          <span>{wordCount.toLocaleString()} words</span>
          <span>{charCount.toLocaleString()} chars</span>
        </div>
      </div>
    </div>
  );
}
