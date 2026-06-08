const RANK_MAP: Record<string, string> = {
  "Marshal of the Nigerian Air Force": "Mshl NAF",
  "Air Chief Marshal": "ACM",
  "Air Marshal": "Air Mshl",
  "Air Vice Marshal": "AVM",
  "Air Commodore": "Air Cdre",
  "Group Captain": "Gp Capt",
  "Wing Commander": "Wg Cdr",
  "Squadron Leader": "Sqn Ldr",
  "Flight Lieutenant": "Flt Lt",
  "Flying Officer": "Fg Offr",
  "Pilot Officer": "Plt Offr",
  "Air Warrant Officer": "AWO",
  "Master Warrant Officer": "MWO",
  "Warrant Officer": "WO",
  "Flight Sergeant": "Flt Sgt",
  "Sergeant": "Sgt",
  "Corporal": "Cpl",
  "Lance Corporal": "LCpl",
  "Aircraftman / Aircraftwoman": "ACM / ACW",
};

export function abbrevRank(rank: string): string {
  return RANK_MAP[rank] ?? rank;
}
