import { units_in_atc } from "@/utils/units_in_ATC";
import UnitCard from "./UnitCard";

export default function UnitsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 max-w-7xl mx-auto">
      {units_in_atc.map((item, index) => (
        <UnitCard
          key={index}
          unit={item.unit}
          description={item.description}
          abbreviation={item.abbreviation}
          imageSrc={item.imageSrc}
        />
      ))}
    </div>
  );
}
