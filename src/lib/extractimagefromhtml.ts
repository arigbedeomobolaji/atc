export function extractImagesFromHTML(html: string): string[] {
  const regex = /<img[^>]+src="([^">]+)"/g;
  const images: string[] = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    images.push(match[1]);
  }

  return [...new Set(images)]; // remove duplicates
}
