"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { CustomImage } from "./extensions/CustomImage";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
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

export default function NewsViewer({ content }: { content: string }) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    extensions: [
      Document, Paragraph, Text,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      BulletList, OrderedList, ListItem,
      Blockquote, CodeBlock, HorizontalRule, HardBreak,
      Bold, Italic, Underline, Strike, Code,
      Highlight.configure({ multicolor: true }),
      CustomImage,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: true }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none focus:outline-none " +
          "[&_ol]:list-decimal [&_ul]:list-disc " +
          "[&_blockquote]:border-l-4 [&_blockquote]:border-[hsl(220,64%,16%)] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-500 " +
          "[&_a]:text-[hsl(220,64%,35%)] [&_a]:underline " +
          "[&_img]:rounded-xl [&_img]:shadow-lg [&_img]:max-w-full " +
          "[&_figure]:my-8 [&_figure]:text-center " +
          "[&_figcaption]:text-slate-400 [&_figcaption]:text-xs [&_figcaption]:mt-2 [&_figcaption]:italic",
      },
    },
  });

  if (!editor) return null;
  return <EditorContent editor={editor} />;
}
