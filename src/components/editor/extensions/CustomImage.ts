/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "@tiptap/extension-image";

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
    const { caption, source, ...imgAttrs } = HTMLAttributes;

    const children: any[] = [["img", imgAttrs]];

    if (caption) {
      children.push(["figcaption", { class: "editor-caption" }, caption]);
    }

    if (source) {
      children.push(["span", { class: "editor-source" }, `Source: ${source}`]);
    }

    return ["figure", { class: "editor-figure" }, ...children];
  },
});
