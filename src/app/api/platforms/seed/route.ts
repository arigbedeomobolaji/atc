import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

const SEED_DATA = [
  {
    caption: "ABT-18: NAF ab-initio training aircraft",
    description:
      "The ABT-18 is one of the earliest aircraft inducted into the Nigerian Air Force inventory. It is primarily used for ab-initio flying training of student pilots, providing them with foundational skills for all subsequent aircraft.",
  },
  {
    caption: "DA-40: NAF basic transport trainer",
    description:
      "The DA-40 serves as a primary training aircraft for the Nigerian Air Force, helping new transport pilot cadets learn flight operations. Its design also allows for light surveillance and reconnaissance roles.",
  },
  {
    caption: "DA-42: NAF ISR and training aircraft",
    description:
      "The DA-42 is a twin-engine aircraft used for ab-initio transport pilot training as well as intelligence, surveillance, and reconnaissance (ISR) missions.",
  },
  {
    caption: "Super Mushshak: NAF fighter trainer",
    description:
      "The Super Mushshak is a dedicated trainer aircraft used for developing the skills of future NAF fighter pilots before they progress to jet aircraft.",
  },
  {
    caption: "L-39ZA: NAF advanced jet trainer",
    description:
      "The L-39ZA is an attack/fighter trainer aircraft used for advanced fighter pilot training. With recent R&D upgrades, it can also perform limited combat operations.",
  },
  {
    caption: "Alpha Jet: NAF flagship fighter trainer",
    description:
      "The Alpha Jet is regarded as the flagship fighter aircraft of the Nigerian Air Force, used for advanced pilot training and light combat operations.",
  },
  {
    caption: "A-29 Super Tucano: NAF precision strike",
    description:
      "The A-29 Super Tucano was inducted for combat roles due to its precise combat capabilities. Within three years, the fleet attained 10,000 flight hours — a milestone rarely achieved globally.",
  },
  {
    caption: "DO-228: NAF transport and VIP aircraft",
    description:
      "The DO-228 is a versatile transport aircraft used for moving troops, cargo, and VIP personnel — supporting both routine logistics and operational deployments.",
  },
  {
    caption: "Agusta-109 LUH: NAF attack helicopter",
    description:
      "The Agusta-109 LUH is an agile attack helicopter that supports troop movements and VIP transport while being equipped for close combat missions.",
  },
  {
    caption: "AW109S Trekker: NAF light attack helicopter",
    description:
      "The AW109S Trekker is a light attack helicopter for in-theatre operations and troop transport, with skids allowing efficient landings in confined or rough areas.",
  },
];

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { db } = await connectToDatabase();

    const existing = await db.collection("platforms").countDocuments();
    if (existing > 0) {
      return NextResponse.json({
        message: `Skipped — ${existing} platforms already exist.`,
      });
    }

    const docs = SEED_DATA.map((p, i) => ({
      ...p,
      image: null,
      imagePublicId: null,
      order: i,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await db.collection("platforms").insertMany(docs);

    return NextResponse.json({
      message: `Seeded ${docs.length} platforms successfully.`,
    });
  } catch {
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
