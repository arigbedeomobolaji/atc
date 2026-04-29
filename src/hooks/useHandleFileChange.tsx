import { useState } from "react";

export function useHandleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
  const [file, setFile] = useState<File | null>(null);

  const selected = e.target.files?.[0];

  if (!selected) return;

  // ✅ 1. Check file type
  if (!selected.type.startsWith("image/")) {
    alert("Only image files are allowed ❌");
    return;
  }

  // ✅ 2. Check file size (before compression)
  const maxSizeMB = 5;
  if (selected.size > maxSizeMB * 1024 * 1024) {
    alert(`Image must be less than ${maxSizeMB}MB ❌`);
    return;
  }

  setFile(selected);

  return { file, setFile };
}
