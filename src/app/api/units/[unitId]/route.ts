// /Users/mac/omobolaji/atc/src/app/api/units/[unitId]/route.ts

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

/**
 * GET SINGLE UNIT
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ unitId: string }> }
) {
  const { unitId } = await context.params;

  if (!ObjectId.isValid(unitId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  const unit = await db.collection("units").findOne({
    _id: new ObjectId(unitId),
  });

  if (!unit) {
    return NextResponse.json({ error: "Unit not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...unit,
    _id: unit._id.toString(),
    currentCommanderId: unit.currentCommanderId?.toString() || null,
  });
}

/**
 * UPDATE UNIT
 */
export async function PUT(
  req: Request,
  context: { params: Promise<{ unitId: string }> }
) {
  const { unitId } = await context.params;
  const body = await req.json();

  const { db } = await connectToDatabase();

  const updateDoc = {
    // Identity
    unit: body.unit,
    slug: body.slug,
    abbreviation: body.abbreviation,

    // Structure
    location: body.location,
    parentCommand: body.parentCommand || "",

    // Description
    role: body.role,
    description: body.description,
    fullDescription: body.fullDescription,

    // 🔥 NEW FIELDS
    capabilities: body.capabilities || [],
    systems: body.systems || [],
    responsibilities: body.responsibilities || [],

    history: body.history || [],
    commanders: body.commanders || [],
    customSections: body.customSections || [],

    // Contact
    contact: {
      address: body.contact?.address || "",
      phone: body.contact?.phone || "",
      email: body.contact?.email || "",
    },

    links: body.links || [],

    establishedDate: body.establishedDate
      ? new Date(body.establishedDate)
      : null,

    updatedAt: new Date(),
  };

  await db
    .collection("units")
    .updateOne({ _id: new ObjectId(unitId) }, { $set: updateDoc });

  return NextResponse.json({ message: "Unit updated" });
}

/**
 * DELETE UNIT
 */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ unitId: string }> }
) {
  const { unitId } = await context.params;

  const { db } = await connectToDatabase();

  await db.collection("units").deleteOne({
    _id: new ObjectId(unitId),
  });

  return NextResponse.json({ message: "Unit deleted" });
}
