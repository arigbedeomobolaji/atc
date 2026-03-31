import { EditorContent, useEditor } from "@tiptap/react";

import { CustomImage } from "./extensions/CustomImage";

export default function NewsViewer({ content }: { content: string }) {
  const editor = useEditor({
    editable: false,
    extensions: [CustomImage],
    content, // JSON from DB
  });

  if (!editor) return null;
  return <EditorContent editor={editor} />;
}
