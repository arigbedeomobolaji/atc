/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import cloudinary from "@/lib/cloudinary";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    const { caption, description } = await req.json();

    await db.collection("platforms").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...(caption !== undefined && { caption: caption.trim() }),
          ...(description !== undefined && { description: description.trim() }),
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const { db } = await connectToDatabase();

    const platform = await db
      .collection("platforms")
      .findOne({ _id: new ObjectId(id) });

    if ((platform as any)?.imagePublicId) {
      await cloudinary.uploader.destroy((platform as any).imagePublicId);
    }

    await db.collection("platforms").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
