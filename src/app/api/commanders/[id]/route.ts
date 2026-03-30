import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

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
  const { id } = await params;
  const body = await req.json();

  const { db } = await connectToDatabase();

  await db.collection("commanders").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...body,
      },
    }
  );

  return NextResponse.json({ message: "Updated" });
}
