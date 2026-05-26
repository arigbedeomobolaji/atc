import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { db } = await connectToDatabase();

    const result = await db.collection("commandLeadership").insertOne({
      name: body.name,
      rank: body.rank,
      appointment: body.appointment,
      appointmentAbbreviation: body.appointmentAbbreviation,
      bio: body.bio || "",
      awards: body.awards || "",

      command: "HQ ATC",
      order: body.order || 0,
      isActive: true,

      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ id: result.insertedId });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// Get all commander leadership at once
export async function GET() {
  const { db } = await connectToDatabase();

  const data = await db
    .collection("commandLeadership")
    .find({ isActive: true })
    .sort({ order: 1 })
    .toArray();

  return NextResponse.json(data);
}
