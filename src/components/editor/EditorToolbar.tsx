/* eslint-disable @typescript-eslint/no-explicit-any */
import { Level } from "@tiptap/extension-heading";
import { Editor, useEditorState } from "@tiptap/react";
import { useCallback, useState } from "react";

export function EditorToolbar({ editor }: { editor: Editor }) {
  const [uploading, setUploading] = useState(false);

  const level: Level[] = [1, 2, 3, 4, 5, 6];

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt(
      "Enter the URL starting with https://www.google.com or http://www.google.com ",
      previousUrl
    );

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    try {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } catch (e) {
      alert((e as Error).message);
    }
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
    selector: (ctx: { editor: { isActive: (arg0: string) => any } }) => ({
      isLink: ctx.editor.isActive("link"),
    }),
  });

  if (!editor) {
    console.log("No editor instance found");
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-50">
      <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-50">
        {/* Text styles */}
        {(
          [
            ["Bold", () => editor?.chain().focus().toggleBold().run()],
            ["Italic", () => editor?.chain().focus().toggleItalic().run()],
            [
              "Underline",
              () => editor?.chain().focus().toggleUnderline().run(),
            ],
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
            disabled={!editor}
            key={label} // now TS knows it's a string
            type="button"
            onClick={action}
            className="btn"
          >
            {label}
          </button>
        ))}

        {/* Headings */}
        <button
          disabled={!editor}
          className="btn"
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          P
        </button>
        {level.map((level) => (
          <button
            disabled={!editor}
            className="btn"
            type="button"
            key={level}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level }).run()
            }
          >
            H{level}
          </button>
        ))}

        {/* Lists & blocks & History */}
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
            ["Hard break", () => editor?.chain().focus().setHardBreak().run()],
            ["Undo", () => editor?.chain().focus().undo().run()],
            ["Redo", () => editor?.chain().focus().redo().run()],
          ] as [string, () => void][]
        ).map(([label, action]) => (
          <button
            disabled={!editor}
            key={label}
            type="button"
            onClick={action as any}
            className="btn"
          >
            {label}
          </button>
        ))}

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#ccddf" }).run()
          }
          className={`${editor.isActive("highlight") ? "is-active" : ""} btn`}
        >
          Toggle highlight
        </button>

        {/* Link */}
        <div className="button-group">
          <button type="button" onClick={setLink} className="btn">
            Set link
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editorState.isLink}
          >
            Unset link
          </button>
        </div>

        {/* Image upload */}
        <label className="cursor-pointer text-sm px-2 py-1 border rounded bg-white">
          {uploading ? "Uploading..." : "Image"}
          <input
            type="file"
            accept="image/*"
            className="btn"
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

      {/* Selected image metadata */}
      {/* Selected image metadata */}
      {editor?.isActive("image") && (
        <div className="flex gap-2 p-2 bg-gray-100 border-t">
          <input
            placeholder="Caption"
            className="border p-1 text-sm block text-center w-full"
            onChange={(e) =>
              editor
                ?.chain()
                .focus()
                .updateAttributes("image", { caption: e.target.value })
                .run()
            }
          />
        </div>
      )}
    </div>
  );
}
