import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

/**
 * GET ALL UNITS
 */
export async function GET() {
  try {
    const { db } = await connectToDatabase();

    const units = await db
      .collection("units")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      units.map((u) => ({
        ...u,
        _id: u._id.toString(),
      }))
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch units" },
      { status: 500 }
    );
  }
}

/**
 * CREATE UNIT (Admin use)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { db } = await connectToDatabase();

    const newUnit = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("units").insertOne(newUnit);

    return NextResponse.json({
      message: "Unit created",
      id: result.insertedId.toString(),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create unit" },
      { status: 500 }
    );
  }
}
