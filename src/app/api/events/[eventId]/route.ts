import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

/**
 * GET SINGLE EVENT
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await context.params; // ✅ FIX

    const id = eventId?.toString().trim();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const event = await db.collection("events").findOne({
      _id: new ObjectId(id),
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const images = await db
      .collection("galleries")
      .find({ eventId: new ObjectId(id) })
      .toArray();

    return NextResponse.json({
      event: {
        ...event,
        _id: event._id.toString(),
        unitId: event.unitId?.toString(),
      },
      images: images.map((img) => ({
        ...img,
        _id: img._id.toString(),
      })),
    });
  } catch (error) {
    console.error("GET EVENT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

/**
 * UPDATE EVENT
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { db } = await connectToDatabase();
    const { eventId } = await params;

    await db.collection("events").updateOne(
      { _id: new ObjectId(eventId) },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ message: "Updated" });
  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

/**
 * DELETE EVENT
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { db } = await connectToDatabase();

    const { eventId } = await params;

    await db.collection("events").deleteOne({
      _id: new ObjectId(eventId),
    });

    //  ALSO delete related images
    await db.collection("galleries").deleteMany({
      eventId: new ObjectId(eventId),
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
