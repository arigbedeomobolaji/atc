/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getGridFSBucket } from "@/lib/db";
import sharp from "sharp";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: Request) {
  try {
    const { filename, data } = await req.json();

    if (!filename || !data) {
      return NextResponse.json(
        { error: "Filename and image data are required." },
        { status: 400 }
      );
    }

    // Extract base64 + mime
    const match = data.match(/^data:(image\/.+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json(
        { error: "Invalid image format." },
        { status: 400 }
      );
    }

    const contentType = match[1];
    const base64 = match[2];

    if (!ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json(
        { error: "Unsupported image type." },
        { status: 415 }
      );
    }

    const buffer = Buffer.from(base64, "base64");

    if (buffer.length > MAX_SIZE) {
      return NextResponse.json(
        { error: "Image exceeds 5MB limit." },
        { status: 413 }
      );
    }

    /* -----------------------------
       🔥 SERVER-SIDE IMAGE RESIZING
    ------------------------------ */
    const resizedBuffer = await sharp(buffer)
      .resize({
        width: 800,
        height: 800,
        fit: "inside",
        withoutEnlargement: true,
      })
      .toFormat("webp", { quality: 80 })
      .toBuffer();

    const safeName = filename.replace(/[^a-zA-Z0-9_.-]/g, "_");

    const bucket = await getGridFSBucket();
    const uploadStream = bucket.openUploadStream(safeName, {
      contentType,
      metadata: {
        originalName: filename,
        uploadedAt: new Date(),
      },
    } as any);

    uploadStream.end(resizedBuffer);

    await new Promise<void>((resolve, reject) => {
      uploadStream.on("finish", resolve);
      uploadStream.on("error", reject);
    });

    return NextResponse.json({
      success: true,
      fileId: uploadStream.id.toString(),
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Image upload failed." },
      { status: 500 }
    );
  }
}
