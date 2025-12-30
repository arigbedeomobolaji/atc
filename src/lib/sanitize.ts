import sanitizeHtml from "sanitize-html";

export function sanitizeHTML(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "b",
      "i",
      "em",
      "strong",
      "u",
      "p",
      "br",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "blockquote",
      "pre",
      "code",
      "img",
      "span",
    ],

    allowedAttributes: {
      img: ["src", "alt"],
      "*": ["style"],
    },

    allowedSchemes: ["data", "http", "https"],
    disallowedTagsMode: "discard",

    // Remove script/style tags entirely
    exclusiveFilter: function (frame) {
      return frame.tag === "script" || frame.tag === "style";
    },
  });
}
