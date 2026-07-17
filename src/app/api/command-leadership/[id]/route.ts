// /Users/mac/omobolaji/atc/src/app/api/command-leadership/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { db } = await connectToDatabase();
    const { id } = await params;

    const leader = await db
      .collection("commandLeadership")
      .findOne({ _id: new ObjectId(id) });

    if (!leader) {
      return NextResponse.json({ error: "Leader not found" }, { status: 404 });
    }

    return NextResponse.json(leader);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch leader" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { db } = await connectToDatabase();
  const { id } = await params;

  await db
    .collection("commandLeadership")
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } }
    );

  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { db } = await connectToDatabase();
  const { id } = await params;

  await db.collection("commandLeadership").deleteOne({
    _id: new ObjectId(id),
  });

  return NextResponse.json({ success: true });
}
