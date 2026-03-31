// /Users/mac/omobolaji/atc/src/app/api/commanders/route.ts

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { db } = await connectToDatabase();

    if (!body.name || !body.rank || !body.unitId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const unitId = new ObjectId(body.unitId);

    // 🚫 Prevent duplicate startDate for same unit
    const exists = await db.collection("commanders").findOne({
      unitId,
      startDate: new Date(body.startDate),
    });

    if (exists) {
      return NextResponse.json(
        { error: "Commander already exists for this start date" },
        { status: 400 }
      );
    }

    // 🔥 Check overlapping commanders for same unit
    const overlapping = await db.collection("commanders").findOne({
      unitId,
      $or: [
        { endDate: null }, // active commander exists
        {
          startDate: { $lte: new Date(body.startDate || Date.now()) },
          endDate: { $gte: new Date(body.startDate || Date.now()) },
        },
      ],
    });

    if (overlapping) {
      return NextResponse.json(
        { error: "A commander already exists for this period" },
        { status: 400 }
      );
    }

    // commander can only be created for units under ATC
    const unit = await db.collection("units").findOne({
      _id: unitId,
    });

    if (!unit) {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    // 🔥 enforce ATC
    if (unit.parentCommand !== "Air Training Command") {
      return NextResponse.json(
        { error: "Only ATC units can have commanders here" },
        { status: 400 }
      );
    }

    const allowed = ["COMMANDER", "COMMANDANT", "AOC"];

    if (!allowed.includes(body.appointment)) {
      return NextResponse.json(
        { error: "Invalid appointment type" },
        { status: 400 }
      );
    }

    // 🔥 Close previous active commander
    await db
      .collection("commanders")
      .updateMany({ unitId, endDate: null }, { $set: { endDate: new Date() } });

    const newCommander = {
      name: body.name,
      rank: body.rank,
      appointment: body.appointment || "Commander",
      unitId,
      portrait: body.portrait || "",
      bio: body.bio || "",
      startDate: new Date(body.startDate || Date.now()),
      endDate: null,
      createdAt: new Date(),
    };

    const result = await db.collection("commanders").insertOne(newCommander);

    return NextResponse.json({
      message: "Commander created",
      id: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("COMMANDER CREATE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create commander" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    const commanders = await db
      .collection("commanders")
      .find({})
      .sort({ startDate: -1 })
      .toArray();

    return NextResponse.json(
      commanders.map((c) => ({
        ...c,
        _id: c._id.toString(),
        unitId: c.unitId.toString(),
      }))
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch commanders" },
      { status: 500 }
    );
  }
}
