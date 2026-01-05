"use client";

import dynamic from "next/dynamic";

interface EditorProps {
  content: string;
  onChange: (value: string) => void;
}

const RichTextEditor = dynamic<EditorProps>(() => import("./RichTextEditor2"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export default RichTextEditor;
