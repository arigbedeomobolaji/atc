// /Users/mac/omobolaji/atc/src/app/api/units/slug/[slug]/route.ts

// api/units/slug/[slug]/route.ts

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

/**
 * GET ONE UNIT
 */
export async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ slug: string }>;
  }
) {
  try {
    const { db } = await connectToDatabase();

    const { slug } = await params;

    const unit = await db.collection("units").findOne({ slug });

    if (!unit) {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...unit,
      _id: unit._id.toString(),
      currentCommanderId: unit.currentCommanderId?.toString() || null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch unit" },
      { status: 500 }
    );
  }
}

/**
 * UPDATE UNIT
 */
export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await req.json();
    const { db } = await connectToDatabase();

    await db.collection("units").updateOne(
      { slug: params.slug },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ message: "Unit updated" });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

/**
 * DELETE UNIT
 */
export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { db } = await connectToDatabase();

    await db.collection("units").deleteOne({
      slug: params.slug,
    });

    return NextResponse.json({ message: "Unit deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
