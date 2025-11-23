"use client";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import AOC_Portrait from "../assets/NAF_ASSETS/AOC_portrait.jpeg";
import ChangingColor from "../assets/NAF_ASSETS/Handing_command_colour.jpeg";
import HandingOver from "../assets/NAF_ASSETS/Handing_over.jpeg";
import HQ_ATC from "../assets/NAF_ASSETS/ATC_HQ.jpeg";
import { GalleryCard } from "./GalleryCard";

const tabs = [
  "Headquarters & Leadership",
  "Units & Departments",
  "Training & Education",
  "Ceremonies & Parades",
  "Infrastructure & Facilities",
  "Aircraft & Equipment",
  "Community & Social Events",
  "History & Archives",
  "Students & Cadets Life",
];

type ImageData = {
  imageSrc: StaticImageData | string;
  caption: string;
  description: string;
};

export const HeadquartersAndLeaderships = [
  {
    imageSrc: AOC_Portrait,
    caption: "Portrait of the Air Training Command AOC",
    description:
      "Official portrait of the Air Officer Commanding, Air Training Command, Kaduna, representing leadership, service, and the strategic oversight of all NAF training institutions under the Command.",
  },
  {
    imageSrc: ChangingColor,
    caption: "AOC Command Colour Handover Ceremony",
    description:
      "Moment captured during the ceremonial handover of the Air Training Command Colour as the outgoing AOC transfers authority and honours to the incoming AOC AVM H.J. Gambo.",
  },
  {
    imageSrc: HandingOver,
    caption: "Formal Handover of Command Documents",
    description:
      "Official handover session where the outgoing AOC transfers Command documents to the new AOC, AVM H.J. Gambo, marking the seamless transition of leadership within Air Training Command.",
  },
  {
    imageSrc: HQ_ATC,
    caption: "Air Training Command Headquarters, Kaduna",
    description:
      "Front view of the Air Training Command Headquarters in Kaduna, the hub for coordinating Nigerian Air Force training, doctrine development, and capacity-building programmes.",
  },
];
const galleryData: Record<string, ImageData[]> = {
  "Headquarters & Leadership": HeadquartersAndLeaderships,
  "Units & Departments": [],
  "Training & Education": [],
  "Ceremonies & Parades": [],
  "Infrastructure & Facilities": [],
  "Aircraft & Equipment": [],
  "Community & Social Events": [],
  "History & Archives": [],
  "Students & Cadets Life": [],
};

export default function GalleryTabs() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="w-full p-4">
      {/* Tabs */}
      <div className="flex gap-3 overflow-x-auto border-b pb-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-4 py-2 rounded-md text-sm font-medium transition-all
            ${
              activeTab === tab
                ? "bg-white text-dark shadow-md"
                : "bg-dark text-white shadow-md hover:bg-dark/10"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryData[activeTab].length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">
            No images yet.
          </p>
        ) : (
          galleryData[activeTab].map((imageData, index) => (
            <div key={index} className="rounded-md overflow-hidden">
              <GalleryCard {...imageData} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
