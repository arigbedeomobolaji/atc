import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { requireAuth } from "@/lib/auth";

const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export async function POST(req: Request) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported image type. Use JPEG, PNG, WebP or GIF." },
        { status: 415 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Image exceeds 8 MB limit." },
        { status: 413 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "atc/news",
      transformation: [
        { width: 1200, crop: "limit", quality: "auto:good", fetch_format: "auto" },
      ],
      resource_type: "image",
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (err) {
    return NextResponse.json({ error: "Image upload failed." }, { status: 500 });
  }
}
