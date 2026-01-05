import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CustomImage } from "./extensions/CustomImage";

export default function NewsViewer({ content }: { content: string }) {
  const editor = useEditor({
    editable: false,
    extensions: [StarterKit, CustomImage],
    content, // JSON from DB
  });

  if (!editor) return null;
  return <EditorContent editor={editor} />;
}
