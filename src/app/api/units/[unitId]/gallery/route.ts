// /Users/mac/omobolaji/atc/src/app/api/units/[unitId]/gallery/route.ts

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: { unitId: string } }
) {
  try {
    const { db } = await connectToDatabase();

    const images = await db
      .collection("galleries")
      .find({
        scope: "UNIT",
        unitId: new ObjectId(params.unitId),
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      images.map((img) => ({
        ...img,
        _id: img._id.toString(),
        unitId: img.unitId?.toString(),
      }))
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch gallery" },
      { status: 500 }
    );
  }
}
