/* eslint-disable @typescript-eslint/no-explicit-any */
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
//     const uploadStream = bucket.openUploadStream(filename, { contentType });
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

import { NextRequest, NextResponse } from "next/server";

import { GridFSBucket } from "mongodb";
import { sanitizeHTML } from "@/lib/sanitize";
import { connectToDatabase } from "@/lib/db";

export const config = {
  api: {
    bodyParser: false, // required for file streaming
    sizeLimit: "5mb", // hard limit for uploads
  },
};

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // ENFORCE FILE SIZE CHECK
    const contentLength = Number(req.headers.get("content-length") || 0);
    if (contentLength > 5_000_000) {
      return NextResponse.json(
        { error: "File too large. Max file size: 5MB." },
        { status: 413 }
      );
    }

    // Only allow images
    if (!contentType.includes("image/")) {
      return NextResponse.json(
        { error: "Only image uploads are allowed." },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    // STREAM upload
    const fileName = `img-${Date.now()}`;
    const uploadStream = bucket.openUploadStream(fileName);

    const stream = req.body;
    if (!stream) throw new Error("Invalid stream");

    const reader = stream.getReader();

    async function pump() {
      const { done, value } = await reader.read();
      if (done) {
        uploadStream.end();
        return;
      }
      uploadStream.write(Buffer.from(value));
      return pump();
    }

    await pump();

    return NextResponse.json({
      success: true,
      fileId: uploadStream.id.toString(),
      fileName,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
