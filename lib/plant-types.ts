export const PLANT_TYPES = [
  {
    id: "lavender",
    name: "lavender",
    petalColor: "#9B8EC4",
    petalColorLight: "#B8AADA",
    centerColor: "#D4C9E8",
    centerDark: "#7C6FAB",
    stemColor: "#4A7A38",
    moteColor: "rgba(155,142,196,0.85)",
  },
  {
    id: "chamomile",
    name: "chamomile",
    petalColor: "#E8D472",
    petalColorLight: "#F2EDB8",
    centerColor: "#D4A832",
    centerDark: "#8B6820",
    stemColor: "#4A7A38",
    moteColor: "rgba(232,212,114,0.85)",
  },
  {
    id: "wild_rose",
    name: "wild rose",
    petalColor: "#D4788A",
    petalColorLight: "#E8A8B4",
    centerColor: "#F5D8DC",
    centerDark: "#8B3848",
    stemColor: "#4A7A38",
    moteColor: "rgba(212,120,138,0.85)",
  },
  {
    id: "foxglove",
    name: "foxglove",
    petalColor: "#C87DB8",
    petalColorLight: "#DCA8D0",
    centerColor: "#F0D8E8",
    centerDark: "#7A3878",
    stemColor: "#4A7A38",
    moteColor: "rgba(200,125,184,0.85)",
  },
  {
    id: "poppy",
    name: "poppy",
    petalColor: "#D45840",
    petalColorLight: "#E89080",
    centerColor: "#F8D8C8",
    centerDark: "#8B2818",
    stemColor: "#4A7A38",
    moteColor: "rgba(212,88,64,0.85)",
  },
  {
    id: "marigold",
    name: "marigold",
    petalColor: "#E8922A",
    petalColorLight: "#F4B870",
    centerColor: "#FDE8A0",
    centerDark: "#8B5010",
    stemColor: "#4A7A38",
    moteColor: "rgba(232,146,42,0.85)",
  },
  {
    id: "cornflower",
    name: "cornflower",
    petalColor: "#5A90D4",
    petalColorLight: "#90B8E8",
    centerColor: "#D8E8F8",
    centerDark: "#284878",
    stemColor: "#4A7A38",
    moteColor: "rgba(90,144,212,0.85)",
  },
  {
    id: "daisy",
    name: "daisy",
    petalColor: "#F0EDE0",
    petalColorLight: "#FDFBF5",
    centerColor: "#E8C840",
    centerDark: "#8B7010",
    stemColor: "#4A7A38",
    moteColor: "rgba(240,237,224,0.85)",
  },
];

export type PlantType = (typeof PLANT_TYPES)[number];

// Warm-toned plant IDs use a warm dark background in the overlay
const WARM_PLANTS = new Set(["poppy", "marigold", "wild_rose"]);
// Cool-toned plant IDs keep the default greenish dark background
const COOL_PLANTS = new Set(["lavender", "cornflower", "foxglove"]);

export function getOverlayBg(plantType: PlantType): string {
  if (WARM_PLANTS.has(plantType.id)) return "rgba(18, 10, 6, 0.94)";
  if (COOL_PLANTS.has(plantType.id)) return "rgba(10, 22, 14, 0.94)";
  // neutral: chamomile, daisy
  return "rgba(14, 14, 10, 0.94)";
}

export function getPlantTypeForHabit(habitId: string): PlantType {
  // Deterministic: hash the habitId to pick a plant type
  let hash = 0;
  for (let i = 0; i < habitId.length; i++) {
    hash = (hash * 31 + habitId.charCodeAt(i)) & 0xffffffff;
  }
  return PLANT_TYPES[Math.abs(hash) % PLANT_TYPES.length];
}
