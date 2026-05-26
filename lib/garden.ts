import type { Season, GardenState } from "@/types";

export function computeDayCount(healingStartDate: Date): number {
  const start = new Date(healingStartDate);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(
    0,
    Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
  );
}

export function computeSeason(dayCount: number): Season {
  if (dayCount <= 14) return "late_autumn";
  if (dayCount <= 30) return "winter";
  if (dayCount <= 60) return "early_spring";
  if (dayCount <= 90) return "full_spring";
  return "summer";
}

export function computeGardenState(completionsLast7Days: number): GardenState {
  if (completionsLast7Days === 0) return "dormant";
  if (completionsLast7Days <= 3) return "stirring";
  if (completionsLast7Days <= 10) return "tending";
  return "blooming";
}

export function computeStreak(completionDates: Date[]): number {
  if (completionDates.length === 0) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateSet = new Set(
    completionDates.map((d) => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    }),
  );
  // Allow streak anchored on today or yesterday (user may not have completed today yet)
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const cursor = dateSet.has(today.getTime())
    ? new Date(today)
    : new Date(yesterday);
  let streak = 0;
  while (dateSet.has(cursor.getTime())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export const SEASON_LABELS: Record<Season, string> = {
  late_autumn: "Late Autumn",
  winter: "Winter",
  early_spring: "Early Spring",
  full_spring: "Full Spring",
  summer: "Summer",
};
