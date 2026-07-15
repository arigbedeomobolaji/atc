import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const doc = await db.collection("aoc").findOne({});
    if (!doc) return NextResponse.json({ aoc: null });
    return NextResponse.json({ aoc: { ...doc, _id: doc._id.toString() } });
  } catch {
    return NextResponse.json({ aoc: null });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { db } = await connectToDatabase();
    const body = await req.json();
    const { name, rank, awards, appointment, statementType, statement } = body;

    if (!name?.trim() || !rank?.trim() || !appointment?.trim() || !statement?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await db.collection("aoc").updateOne(
      {},
      {
        $set: {
          name: name.trim(),
          rank: rank.trim(),
          awards: (awards || "").trim(),
          appointment: appointment.trim(),
          statementType: statementType || "Vision",
          statement: statement.trim(),
          updatedAt: new Date(),
        },
        $setOnInsert: { image: null, imagePublicId: null, createdAt: new Date() },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
