import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GalleryCard } from "@/components/GalleryCard";
import { Radio, Plane } from "lucide-react";
import ABT18 from "../../../assets/ATC_PLATFORMS/ABT18.jpeg";
import L39ZA from "../../../assets/ATC_PLATFORMS/L39ZA.jpeg";
import DA40 from "../../../assets/ATC_PLATFORMS/DA40.jpg";
import DA42 from "../../../assets/ATC_PLATFORMS/DA42.jpg";
import ALPHA_JET from "../../../assets/ATC_PLATFORMS/ALPHA_JET.webp";
import SUPER_TUCANO from "../../../assets/ATC_PLATFORMS/SUPER_TUCANO.jpg";
import DO228 from "../../../assets/ATC_PLATFORMS/DO228.jpg";
import AGUSTA109 from "../../../assets/ATC_PLATFORMS/AGUSTA109.jpg";
import AW109S from "../../../assets/ATC_PLATFORMS/AW109S.jpg";
import SUPER_MUSHSHACK from "../../../assets/ATC_PLATFORMS/SUPER_MUSHSHACK.jpeg";

const PLATFORMS = [
  {
    imageSrc: ABT18,
    caption: "ABT-18: NAF ab-initio training aircraft",
    description:
      "The ABT-18 is one of the earliest aircraft inducted into the Nigerian Air Force inventory. It is primarily used for ab-initio flying training of student pilots, providing them with foundational skills for all subsequent aircraft.",
  },
  {
    imageSrc: DA40,
    caption: "DA-40: NAF basic transport trainer",
    description:
      "The DA-40 serves as a primary training aircraft for the Nigerian Air Force, helping new transport pilot cadets learn flight operations. Its design also allows for light surveillance and reconnaissance roles.",
  },
  {
    imageSrc: DA42,
    caption: "DA-42: NAF ISR and training aircraft",
    description:
      "The DA-42 is a twin-engine aircraft used for ab-initio transport pilot training as well as intelligence, surveillance, and reconnaissance (ISR) missions.",
  },
  {
    imageSrc: SUPER_MUSHSHACK,
    caption: "Super Mushshak: NAF fighter trainer",
    description:
      "The Super Mushshak is a dedicated trainer aircraft used for developing the skills of future NAF fighter pilots before they progress to jet aircraft.",
  },
  {
    imageSrc: L39ZA,
    caption: "L-39ZA: NAF advanced jet trainer",
    description:
      "The L-39ZA is an attack/fighter trainer aircraft used for advanced fighter pilot training. With recent R&D upgrades, it can also perform limited combat operations.",
  },
  {
    imageSrc: ALPHA_JET,
    caption: "Alpha Jet: NAF flagship fighter trainer",
    description:
      "The Alpha Jet is regarded as the flagship fighter aircraft of the Nigerian Air Force, used for advanced pilot training and light combat operations.",
  },
  {
    imageSrc: SUPER_TUCANO,
    caption: "A-29 Super Tucano: NAF precision strike",
    description:
      "The A-29 Super Tucano was inducted for combat roles due to its precise combat capabilities. Within three years, the fleet attained 10,000 flight hours — a milestone rarely achieved globally.",
  },
  {
    imageSrc: DO228,
    caption: "DO-228: NAF transport and VIP aircraft",
    description:
      "The DO-228 is a versatile transport aircraft used for moving troops, cargo, and VIP personnel — supporting both routine logistics and operational deployments.",
  },
  {
    imageSrc: AGUSTA109,
    caption: "Agusta-109 LUH: NAF attack helicopter",
    description:
      "The Agusta-109 LUH is an agile attack helicopter that supports troop movements and VIP transport while being equipped for close combat missions.",
  },
  {
    imageSrc: AW109S,
    caption: "AW109S Trekker: NAF light attack helicopter",
    description:
      "The AW109S Trekker is a light attack helicopter for in-theatre operations and troop transport, with skids allowing efficient landings in confined or rough areas.",
  },
];

export default function PlatformsPage() {
  return (
    <div className="bg-[hsl(220,64%,8%)]">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative bg-[hsl(220,64%,8%)] pt-20 pb-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, white 0, white 1px, transparent 0, transparent 50%)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-64 bg-[hsl(45,68%,47%)]/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-5">
            <Radio size={11} className="text-[hsl(350,66%,55%)] animate-pulse" />
            <span className="text-[hsl(45,68%,47%)] text-[11px] font-black uppercase tracking-[0.3em]">
              Air Training Command
            </span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase leading-tight tracking-wide mb-4">
            Our Platforms
          </h1>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-20 h-1 rounded-full bg-[hsl(45,68%,47%)]" />
            <div className="w-10 h-0.5 rounded-full bg-white/20" />
          </div>
          <p className="text-white/55 text-base max-w-xl leading-relaxed">
            A comprehensive look at the aircraft and rotary-wing platforms
            operated by units under the Air Training Command.
          </p>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="bg-[hsl(220,64%,10%)] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl bg-[hsl(45,68%,47%)] flex items-center justify-center shadow-lg">
              <Plane size={16} className="text-[hsl(220,64%,16%)]" />
            </div>
            <div>
              <span className="text-[hsl(45,68%,47%)] text-xs font-bold uppercase tracking-[0.3em]">
                Aircraft &amp; Equipment
              </span>
              <div className="mt-1 flex items-center gap-1.5">
                <div className="w-10 h-0.5 rounded-full bg-[hsl(45,68%,47%)]" />
                <div className="w-5 h-px rounded-full bg-white/20" />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {PLATFORMS.map((platform, i) => (
              <GalleryCard key={i} {...platform} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
