/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "@tiptap/extension-image";

export const CustomImage = Image.extend({
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      caption: {
        default: null,
        parseHTML: (element) => {
          // When parsing saved HTML, grab caption from sibling <figcaption>
          const figure = element.closest("figure");
          const figcaption = figure?.querySelector("figcaption");
          return figcaption?.textContent?.trim() || null;
        },
      },
    };
  },

  parseHTML() {
    return [
      // Parse plain <img> tags
      { tag: "img[src]" },
      // Parse <figure><img> structures from saved content
      {
        tag: "figure",
        getAttrs: (node) => {
          const img = (node as HTMLElement).querySelector("img");
          if (!img) return false;
          const caption =
            (node as HTMLElement).querySelector("figcaption")?.textContent?.trim() || null;
          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            caption,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { caption, ...imgAttrs } = HTMLAttributes;
    const children: any[] = [["img", imgAttrs]];
    if (caption) {
      children.push(["figcaption", { class: "editor-caption" }, caption]);
    }
    return ["figure", { class: "editor-figure" }, ...children];
  },
});
