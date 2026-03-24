import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

import { connectToDatabase } from "../lib/db";
import { unitSeedData } from "@/data/units.seed";

async function seedUnits() {
  const { db } = await connectToDatabase();

  // OPTIONAL: clear existing
  await db.collection("units").deleteMany({});

  const formattedUnits = unitSeedData.map((unit) => ({
    slug: unit.slug,
    unit: unit.unit,
    abbreviation: unit.abbreviation,
    location: unit.location,

    role: unit.role,
    description: unit.description,
    fullDescription: unit.fullDescription,

    responsibilities: unit.responsibilities,
    aircraft: unit.aircraft || [],

    parentCommand: unit.parentCommand || "Air Training Command",

    // ⚠️ IMPORTANT: Replace static image import with string
    logo: "",

    gallery: [],

    contact: "contact" in unit ? unit.contact : {},

    links: unit.links || [],

    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await db.collection("units").insertMany(formattedUnits);

  console.log("✅ Units seeded successfully");
}

seedUnits().catch(console.error);
