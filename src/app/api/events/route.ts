/* eslint-disable @typescript-eslint/no-explicit-any */
// /Users/mac/omobolaji/atc/src/app/api/events/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { db } = await connectToDatabase();

    if (!body.title || !body.scope || !body.category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (body.scope === "UNIT" && !body.unitId) {
      return NextResponse.json(
        { error: "unitId is required for UNIT events" },
        { status: 400 }
      );
    }

    const unitId =
      body.unitId && ObjectId.isValid(body.unitId)
        ? new ObjectId(body.unitId)
        : null;

    const newEvent = {
      title: body.title,
      description: body.description || "",
      scope: body.scope,
      unitId,
      category: body.category,
      coverImage: body.coverImage || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("events").insertOne(newEvent);

    return NextResponse.json({
      message: "Event created",
      id: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("EVENT CREATE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const unitId = searchParams.get("unitId");

    const query: any = {};

    if (unitId && ObjectId.isValid(unitId)) {
      query.unitId = new ObjectId(unitId);
    }

    const events = await db
      .collection("events")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      events.map((e) => ({
        ...e,
        _id: e._id.toString(),
        unitId: e.unitId?.toString(),
      }))
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
