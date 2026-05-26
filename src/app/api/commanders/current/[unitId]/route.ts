// /Users/mac/omobolaji/atc/src/app/api/commanders/current/[unitId]/route.ts

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ unitId: string }> }
) {
  try {
    const { unitId } = await params;

    if (!ObjectId.isValid(unitId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const commander = await db.collection("commanders").findOne({
      unitId: new ObjectId(unitId),
      endDate: null,
    });

    if (!commander) {
      return new NextResponse(null, { status: 404 });
    }

    return NextResponse.json({
      ...commander,
      _id: commander._id.toString(),
      unitId: commander.unitId.toString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch commander" },
      { status: 500 }
    );
  }
}
