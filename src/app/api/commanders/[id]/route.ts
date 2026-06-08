/* eslint-disable @typescript-eslint/no-explicit-any */
// /Users/mac/omobolaji/atc/src/app/api/commanders/[id]/route.ts

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import cloudinary from "@/lib/cloudinary";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { db } = await connectToDatabase();

  const commander = await db.collection("commanders").findOne({
    _id: new ObjectId(id),
  });

  return NextResponse.json({
    ...commander,
    _id: commander?._id.toString(),
    unitId: commander?.unitId.toString(),
  });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();

    const { db } = await connectToDatabase();

    const commanderId = new ObjectId(id);

    // 🔍 Get existing commander
    const existing = await db.collection("commanders").findOne({
      _id: commanderId,
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Commander not found" },
        { status: 404 }
      );
    }

    const unitId = existing.unitId;

    //  If editing dates → prevent overlap issues
    if (body.startDate || body.endDate) {
      const overlapping = await db.collection("commanders").findOne({
        _id: { $ne: commanderId },
        unitId,
        $or: [
          { endDate: null },
          {
            startDate: {
              $lte: new Date(body.startDate || existing.startDate),
            },
            endDate: {
              $gte: new Date(body.startDate || existing.startDate),
            },
          },
        ],
      });

      if (overlapping) {
        return NextResponse.json(
          { error: "Date overlaps with another commander" },
          { status: 400 }
        );
      }
    }

    //  Build update object safely
    const updateData: any = {
      ...(body.name && { name: body.name }),
      ...(body.rank && { rank: body.rank }),
      ...(body.svcNo !== undefined && { svcNo: body.svcNo }),
      ...(body.appointment && { appointment: body.appointment }),

      ...(body.portrait !== undefined && { portrait: body.portrait }),
      ...(body.bio !== undefined && { bio: body.bio }),

      // ✅ NEW FIELD
      ...(body.awards && { awards: body.awards }),

      ...(body.startDate && {
        startDate: new Date(body.startDate),
      }),
      ...(body.endDate !== undefined && {
        endDate: body.endDate ? new Date(body.endDate) : null,
      }),
    };

    // 🧹 Delete old portrait if new one is provided
    if (body.portrait && existing.portraitPublicId) {
      try {
        await cloudinary.uploader.destroy(existing.portraitPublicId);
      } catch (err) {
        console.error("Failed to delete old image:", err);
      }
    }

    await db
      .collection("commanders")
      .updateOne({ _id: commanderId }, { $set: updateData });

    if (updateData.endDate === null) {
      await db.collection("units").updateOne(
        { _id: unitId },
        {
          $set: {
            currentCommanderId: commanderId,
          },
        }
      );
    }

    return NextResponse.json({ message: "Commander updated" });
  } catch (error) {
    console.error("COMMANDER UPDATE ERROR:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { db } = await connectToDatabase();

  await db.collection("commanders").deleteOne({
    _id: new ObjectId(id),
  });

  return NextResponse.json({ message: "Deleted" });
}
