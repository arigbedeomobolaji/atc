// /Users/mac/omobolaji/atc/src/app/api/units/route.ts

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function POST(req: Request) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { db } = await connectToDatabase();

    // ✅ REQUIRED
    if (
      !body.unit ||
      !body.slug ||
      !body.abbreviation ||
      !body.location ||
      !body.role ||
      !body.description
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ UNIQUE SLUG
    const existing = await db.collection("units").findOne({
      slug: body.slug,
    });

    if (existing) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    // Assign order = count of existing units so new unit appears at the end
    const unitCount = await db.collection("units").countDocuments();

    // ✅ CLEAN + FLEXIBLE STRUCTURE
    const newUnit = {
      // Identity
      unit: body.unit,
      slug: body.slug.toLowerCase().trim(),
      abbreviation: body.abbreviation,

      // Structure
      location: body.location,
      parentCommand: body.parentCommand || "Air Training Command",
      mission: body.mission || "",

      // Description
      role: body.role,
      description: body.description,

      //  NEW FIELDS
      capabilities: body.capabilities || [],
      systems: body.systems || [],
      responsibilities: body.responsibilities || [],

      history: body.history || [],
      commanders: body.commanders || [],

      customSections: body.customSections || [],

      // Media
      logo: "",

      // Command
      currentCommanderId: null,

      // Contact
      contact: {
        address: body.contact?.address || "",
        phone: body.contact?.phone || "",
        email: body.contact?.email || "",
      },

      // Links
      links: body.links || [],

      // Display order (drag-sortable in admin)
      order: unitCount,

      // Meta
      isActive: true,
      establishedDate: body.establishedDate
        ? new Date(body.establishedDate)
        : null,

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("units").insertOne(newUnit);

    return NextResponse.json({
      message: "Unit created",
      id: result.insertedId.toString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create unit" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    const units = await db
      .collection("units")
      .find({})
      .sort({ order: 1, createdAt: 1 })
      .toArray();

    return NextResponse.json(
      units.map((u) => ({
        ...u,
        _id: u._id.toString(),
      }))
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch units" },
      { status: 500 }
    );
  }
}
