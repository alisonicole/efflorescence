import { INSPIRE_CONTENT } from "./inspire-content";
import type { Spiral, InspireItem } from "@/types";

export function isWithinDayRange(
  dayCount: number,
  range: [number, number] | undefined,
): boolean {
  if (!range) return true;
  return dayCount >= range[0] && dayCount <= range[1];
}

export function getMilestoneItem(dayCount: number): InspireItem | undefined {
  return INSPIRE_CONTENT.find(
    (item) => item.type === "milestone" && item.milestoneDay === dayCount,
  );
}

export function getInspireItems(
  spiral: Spiral,
  dayCount: number,
  seenIds: string[],
): InspireItem[] {
  const seenSet = new Set(seenIds);

  const eligible = INSPIRE_CONTENT.filter((item) => {
    if (item.type === "milestone") return false;
    if (seenSet.has(item.id)) return false;
    if (!isWithinDayRange(dayCount, item.dayRange)) return false;
    return item.spirals.includes(spiral) || item.spirals.includes("all");
  });

  const copy = [...eligible];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, 3);
}
