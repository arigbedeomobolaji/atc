// /Users/mac/omobolaji/atc/src/app/api/commanders/route.ts

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
    if (!body.endDate) {
      const overlapping = await db.collection("commanders").findOne({
        unitId,
        endDate: null,
      });

      if (overlapping) {
        return NextResponse.json(
          { error: "A current commander already exists" },
          { status: 400 }
        );
      }
    }

    // 🔍 Validate unit
    const unit = await db.collection("units").findOne({ _id: unitId });

    if (!unit) {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    // //  Enforce ATC only
    // if (unit.parentCommand !== "Air Training Command") {
    //   return NextResponse.json(
    //     { error: "Only ATC units can have commanders here" },
    //     { status: 400 }
    //   );
    // }

    const allowed = ["COMMANDER", "COMMANDANT", "AOC"];

    if (!allowed.includes(body.appointment)) {
      return NextResponse.json(
        { error: "Invalid appointment type" },
        { status: 400 }
      );
    }

    //  Close previous active commander

    const isPast = !!body.endDate;

    if (!isPast) {
      // ONLY for current commander — close at the new commander's start date
      await db
        .collection("commanders")
        .updateMany(
          { unitId, endDate: null },
          { $set: { endDate: new Date(body.startDate || Date.now()) } }
        );
    }
    // ✅ NEW COMMANDER OBJECT
    const newCommander = {
      name: body.name,
      rank: body.rank,
      svcNo: body.svcNo || "",
      appointment: body.appointment || "COMMANDER",

      unitId,

      portrait: body.portrait || "",
      portraitPublicId: body.portraitPublicId || "",
      bio: body.bio || "",

      //  NEW FIELD
      awards: body.awards || "",

      startDate: new Date(body.startDate || Date.now()),
      endDate: body.endDate ? new Date(body.endDate) : null,

      createdAt: new Date(),
    };

    const result = await db.collection("commanders").insertOne(newCommander);

    //  Update unit pointer
    if (!body.endDate) {
      await db.collection("units").updateOne(
        { _id: unitId },
        {
          $set: {
            currentCommanderId: result.insertedId,
          },
        }
      );
    }

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
      { error: `Failed to fetch commanders ${error}` },
      { status: 500 }
    );
  }
}
