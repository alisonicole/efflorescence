import type {
  Season,
  GardenState,
  HabitCategory,
  BlossomSpecies,
} from "@/types";

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

export function computeGardenState(
  completionsLast7Days: number,
  streak: number = 0,
): GardenState {
  if (streak >= 30) return "radiant";
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

/**
 * Returns true when `streak` crosses a new 7-day multiple that `prevStreak` had not yet reached.
 * Pass the streak value from before the current completion as `prevStreak`.
 */
export function detectBlossomEarned(
  streak: number,
  prevStreak: number,
): boolean {
  if (streak < 7) return false;
  return Math.floor(streak / 7) > Math.floor(prevStreak / 7);
}

export const BLOSSOM_SPECIES: Record<HabitCategory, BlossomSpecies> = {
  no_contact: { emoji: "🌿", name: "thistle" },
  no_stalking: { emoji: "🌼", name: "marigold" },
  no_old_photos: { emoji: "🪻", name: "lavender" },
  eat_water: { emoji: "🍵", name: "chamomile" },
  move_body: { emoji: "🌻", name: "sunflower" },
  fresh_air: { emoji: "🌸", name: "daisy" },
  talk: { emoji: "🌺", name: "dahlia" },
  sleep: { emoji: "🌙", name: "evening primrose" },
  get_dressed: { emoji: "🌱", name: "dandelion" },
  journal: { emoji: "🪷", name: "iris" },
  just_for_you: { emoji: "💮", name: "peony" },
  therapy: { emoji: "💙", name: "forget-me-not" },
};
