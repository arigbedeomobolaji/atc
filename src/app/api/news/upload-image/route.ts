/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getGridFSBucket } from "@/lib/db";

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

    const safeName = filename.replace(/[^a-zA-Z0-9_.-]/g, "_");

    const bucket = await getGridFSBucket();
    const uploadStream = bucket.openUploadStream(safeName, {
      contentType,
      metadata: {
        originalName: filename,
        uploadedAt: new Date(),
      },
    } as any);

    uploadStream.end(buffer);

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

// import { NextResponse } from "next/server";
// import { getGridFSBucket } from "@/lib/db";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { filename, data } = body;
//     if (!filename || !data) {
//       return NextResponse.json({ error: "Missing data" }, { status: 400 });
//     }

//     // data may be: "data:image/png;base64,...." or plain base64
//     const matches = data.match(/^data:(.+);base64,(.*)$/);
//     let buffer: Buffer;
//     let contentType = "application/octet-stream";
//     if (matches) {
//       contentType = matches[1];
//       buffer = Buffer.from(matches[2], "base64");
//     } else {
//       buffer = Buffer.from(data, "base64");
//     }

//     const bucket = await getGridFSBucket();
//     const uploadStream = bucket.openUploadStream(filename, {
//       contentType,
//     } as any);
//     uploadStream.end(buffer);

//     await new Promise((resolve, reject) => {
//       uploadStream.on("finish", resolve);
//       uploadStream.on("error", reject);
//     });

//     // file id
//     const fileId = uploadStream.id.toString();

//     return NextResponse.json({ success: true, fileId: fileId.toString() });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Upload failed" }, { status: 500 });
//   }
// }
