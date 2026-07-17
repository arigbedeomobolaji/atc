import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { requireAuth } from "@/lib/auth";

// Used exclusively for commander portrait uploads.
// Unit/command gallery images go through /api/albums/[albumId]/upload instead.
export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const unitId = formData.get("unitId") as string | null;
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uploadRes: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: `atc/units/${unitId}/commanders` },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({
      message: "Portrait uploaded",
      data: {
        imageUrl: uploadRes.secure_url,
        publicId: uploadRes.public_id,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
