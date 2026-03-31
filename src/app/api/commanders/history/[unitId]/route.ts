// /Users/mac/omobolaji/atc/src/app/api/commanders/history/[unitId]/route.ts

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ unitId: string }> }
) {
  try {
    const { unitId } = await params;

    const { db } = await connectToDatabase();

    const history = await db
      .collection("commanders")
      .find({
        unitId: new ObjectId(unitId),
      })
      .sort({ startDate: -1 })
      .toArray();

    return NextResponse.json(
      history.map((c) => ({
        ...c,
        _id: c._id.toString(),
        unitId: c.unitId.toString(),
      }))
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
