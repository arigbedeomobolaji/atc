/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const caption = formData.get("caption") as string;
    const category = formData.get("category") as string;
    const scope = formData.get("scope") as string;
    const unitId = formData.get("unitId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadRes: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: scope === "COMMAND" ? "atc/command" : `atc/units/${unitId}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(buffer);
    });

    // Save to MongoDB
    const { db } = await connectToDatabase();

    const newImage = {
      imageUrl: uploadRes.secure_url,
      caption,
      category,
      scope,
      unitId: unitId ? new ObjectId(unitId) : null,
      createdAt: new Date(),
    };

    await db.collection("galleries").insertOne(newImage);

    return NextResponse.json({
      message: "Upload successful",
      data: newImage,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
