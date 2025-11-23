import { WelcomeBanner } from "@/components/WelcomeBanner";
import { Navbar } from "@/components/Navbar";
import { FadeInSection } from "@/components/FadeInSection";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { HeaderText } from "@/components/HeaderText";
import { GalleryCard } from "@/components/GalleryCard";
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

const ourPlatforms = [
  {
    imageSrc: ABT18,
    caption: "ABT-18: NAF ab-initio training aircraft",
    description:
      "The ABT-18 is one of the earliest aircraft inducted into the Nigerian Air Force inventory. It is primarily used for ab-initio flying training of student pilots, providing them with foundational skills for all subsequent aircraft. Known for its reliability and simplicity, it remains an essential platform for introducing new cadets to controlled flight operations.",
  },
  {
    imageSrc: DA40,
    caption: "DA-40: NAF basic transport trainer",
    description:
      "The DA-40 serves as a primary training aircraft for the Nigerian Air Force, helping new transport pilot cadets learn flight operations. Its design also allows for light surveillance and reconnaissance roles, giving pilots early exposure to operational tasks beyond basic flying.",
  },
  {
    imageSrc: DA42,
    caption: "DA-42: NAF ISR and training aircraft",
    description:
      "The DA-42 is a twin-engine aircraft in NAF service, used for ab-initio transport pilot training as well as intelligence, surveillance, and reconnaissance (ISR) missions. Its multi-role capability ensures cadets are trained in both flight skills and practical operational tasks.",
  },
  {
    imageSrc: SUPER_MUSHSHACK,
    caption: "Super Mushshak: NAF fighter trainer",
    description:
      "The Super Mushshak is a dedicated trainer aircraft used for developing the skills of future NAF fighter pilots. It provides cadets with a stable platform to learn basic and intermediate flying maneuvers before progressing to jet aircraft like the L-39ZA and Alpha Jet.",
  },
  {
    imageSrc: L39ZA,
    caption: "L-39ZA: NAF advanced jet trainer",
    description:
      "The L-39ZA is an attack/fighter trainer aircraft used by the Nigerian Air Force for advanced fighter pilot training after cadets graduate from ab-initio training. With recent R&D upgrades, the aircraft can now also perform limited combat operations, enhancing its role in modern air defence training.",
  },
  {
    imageSrc: ALPHA_JET,
    caption: "Alpha Jet: NAF flagship fighter trainer",
    description:
      "The Alpha Jet is regarded as the flagship fighter aircraft of the Nigerian Air Force. It is used for advanced pilot training and light combat operations, providing cadets with hands-on experience in fighter tactics, weapon deployment, and high-speed maneuvering.",
  },
  {
    imageSrc: SUPER_TUCANO,
    caption: "A-29 Super Tucano: NAF precision strike",
    description:
      "The NAF’s A-29 Super Tucano was inducted into the NAF for combat roles due to its precise combat capabilities. It can acquire targets with accurate precision, and within three years of induction, the fleet attained 10,000 flight hours—a record celebrated nationally and rare globally.",
  },
  {
    imageSrc: DO228,
    caption: "DO-228: NAF transport and VIP aircraft",
    description:
      "The DO-228 is a versatile transport aircraft in NAF service, used for moving troops, cargo, and VIP personnel. Its adaptability allows it to support both routine logistical missions and operational deployments, making it an integral component of NAF mobility operations.",
  },
  {
    imageSrc: AGUSTA109,
    caption: "Agusta-109 LUH: NAF attack helicopter",
    description:
      "The Agusta-109 LUH (A and E variants) is an agile attack helicopter used in theatre operations. It supports troop movements and VIP transport while being equipped for close combat missions. Its wheel landing gear allows for versatility on different terrains.",
  },
  {
    imageSrc: AW109S,
    caption: "AW109S Trekker: NAF light attack helicopter",
    description:
      "The AW109S Trekker is a light attack helicopter used by the Nigerian Air Force for in-theatre operations, troop transport, and VIP movement. Unlike the LUH, it has skids instead of wheels, allowing for efficient landings in confined or rough areas.",
  },
];

export default function Home() {
  return (
    <div className="relative">
      <WelcomeBanner />

      {/* Fixed Header (Banner + Navbar) */}
      <div className="sticky top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <Navbar />
      </div>

      <div className="bg-dark">
        <div className="max-w-7xl mx-auto bg-white">
          <div className="">
            <FadeInSection delay={0.2}>
              <PageHero
                title="Air Training Command Platforms"
                description="Aircraft | Unmanned Aerial Vehicles"
                callToAction="Explore our Gallery"
              />
            </FadeInSection>
          </div>
          <HeaderText title="OUR PLATFORMS" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-3">
            {ourPlatforms.map((imageData, index) => (
              <div key={index} className="rounded-md overflow-hidden">
                <GalleryCard {...imageData} />
              </div>
            ))}
          </div>
        </div>
        <div className="mb-5" />
        <Footer />
      </div>
    </div>
  );
}
