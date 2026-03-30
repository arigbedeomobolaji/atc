import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const { db } = await connectToDatabase();

    const images = await db
      .collection("galleries")
      .find({ eventId: new ObjectId(params.eventId) })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      images.map((img) => ({
        ...img,
        _id: img._id.toString(),
      }))
    );
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
