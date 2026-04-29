/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  const items = await req.json();
  const { db } = await connectToDatabase();

  const bulk = db.collection("commandLeadership").initializeUnorderedBulkOp();

  items.forEach((item: any) => {
    bulk.find({ _id: new ObjectId(item._id) }).updateOne({
      $set: { order: item.order },
    });
  });

  await bulk.execute();

  return NextResponse.json({ success: true });
}
