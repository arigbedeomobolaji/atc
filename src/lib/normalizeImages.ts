export function normalizeImages(html: string) {
  return html.replace(
    /<img([^>]*)\/>\s*([^<]+)\s*(?=<p>)/g,
    `
    <figure class="editor-figure">
      <img $1 />
      <figcaption class="editor-caption">$2</figcaption>
    </figure>
    `
  );
}
