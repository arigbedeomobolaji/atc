"use client";

import { useState } from "react";

interface UnitCardProps {
  unit: string;
  description: string;
  abbreviation: string;
}

export default function UnitCard({
  unit,
  description,
  abbreviation,
}: UnitCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Split description into words
  const words = description.split(" ");
  const preview =
    words.slice(0, 20).join(" ") + (words.length > 20 ? "..." : "");

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 border hover:shadow-lg transition">
      {/* Placeholder Image */}
      <div className="w-full h-40 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-lg">
        No Image
      </div>

      <h2 className="text-xl font-bold mt-4">{abbreviation}</h2>
      <h3 className="text-md font-semibold text-gray-700 h-12 line-clamp-2">
        {unit}
      </h3>

      <p className="text-gray-600 mt-2 text-sm text-justify">
        {expanded ? description : preview}
      </p>

      {words.length > 20 && (
        <button
          className="mt-2 text-blue-600 hover:underline text-sm font-semibold"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
