import Image from "next/image";
import React, { useState } from "react";

export default function InputFile({
  file,
  setFile,
  label,
}: {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  label: string;
}) {
  //   const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
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

    setPreview(URL.createObjectURL(selected));
  }
  return (
    <div>
      <label className="text-sm text-muted-foreground">{label || "Logo"}</label>

      <div className="flex items-center gap-4 mt-2">
        <input
          id="logo"
          type="file"
          accept="image/*" // ✅ only images selectable
          className="block w-full text-sm text-muted-foreground 
  file:mr-4 file:py-2 file:px-4 file:rounded-lg 
  file:border-0 file:bg-secondary file:text-secondary-foreground 
  hover:file:bg-secondary/80"
          onChange={handleFileChange}
        />

        {preview && (
          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
            <Image src={preview} alt="portrait" fill className="object-cover" />
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-1">
        Uploading a new image will replace the current portrait
      </p>
    </div>
  );
}
