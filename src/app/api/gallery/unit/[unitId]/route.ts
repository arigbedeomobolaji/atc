import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ unitId: string }> }
) {
  try {
    const { db } = await connectToDatabase();
    const { unitId } = await params;

    const galleries = await db
      .collection("galleries")
      .find({
        unitId: new ObjectId(unitId),
      })
      .sort({ createdAt: -1 })
      .toArray();

    console.log({ galleries });

    return NextResponse.json(galleries);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch gallery" },
      { status: 500 }
    );
  }
}
