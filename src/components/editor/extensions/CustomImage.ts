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

// import Image from "@tiptap/extension-image";

// export const CustomImage = Image.extend({
//   name: "image",

//   group: "block",
//   draggable: true,
//   isolating: true,

//   addAttributes() {
//     return {
//       src: { default: null },
//       alt: { default: null },
//       caption: { default: null },
//     };
//   },

//   renderHTML({ HTMLAttributes }) {
//     const { caption, ...imgAttrs } = HTMLAttributes;

//     return [
//       "figure",
//       { class: "editor-figure" },
//       ["img", imgAttrs],
//       caption ? ["figcaption", { class: "editor-caption" }, caption] : null,
//     ];
//   },
// });
