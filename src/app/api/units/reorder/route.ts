import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const items: { _id: string; order: number }[] = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const bulk = db.collection("units").initializeUnorderedBulkOp();

    items.forEach(({ _id, order }) => {
      if (ObjectId.isValid(_id)) {
        bulk.find({ _id: new ObjectId(_id) }).updateOne({
          $set: { order, updatedAt: new Date() },
        });
      }
    });

    await bulk.execute();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("REORDER ERROR:", error);
    return NextResponse.json({ error: "Failed to reorder units" }, { status: 500 });
  }
}
