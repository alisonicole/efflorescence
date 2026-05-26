import type { HabitCompletion, CheckIn, Spiral } from "@/types";

export type HeatLevel = 0 | 1 | 2 | 3;

export function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function computeHeatLevel(
  completions: number,
  totalHabits: number,
): HeatLevel {
  if (completions === 0) return 0;
  const ratio = completions / Math.max(totalHabits, 1);
  if (ratio < 0.34) return 1;
  if (ratio < 0.67) return 2;
  return 3;
}

export function groupCompletionsByDate(
  completions: HabitCompletion[],
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const c of completions) {
    const key = dateKey(new Date(c.completedDate));
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

export function groupCheckInsByDate(
  checkIns: CheckIn[],
): Record<string, Spiral> {
  const result: Record<string, Spiral> = {};
  for (const c of checkIns) {
    result[dateKey(new Date(c.date))] = c.spiral;
  }
  return result;
}

export function monthDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}
