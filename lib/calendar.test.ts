import { describe, it, expect } from "vitest";
import {
  dateKey,
  computeHeatLevel,
  groupCompletionsByDate,
  groupCheckInsByDate,
} from "./calendar";
import type { HabitCompletion, CheckIn } from "@/types";

describe("dateKey", () => {
  it("formats date as YYYY-MM-DD", () => {
    expect(dateKey(new Date("2026-05-15T14:30:00Z"))).toBe("2026-05-15");
  });
});

describe("computeHeatLevel", () => {
  it("returns 0 for 0 completions", () => {
    expect(computeHeatLevel(0, 4)).toBe(0);
  });
  it("returns 1 for low completion ratio (1/4)", () => {
    expect(computeHeatLevel(1, 4)).toBe(1);
  });
  it("returns 2 for medium completion ratio (2/4)", () => {
    expect(computeHeatLevel(2, 4)).toBe(2);
  });
  it("returns 3 for high completion ratio (4/4)", () => {
    expect(computeHeatLevel(4, 4)).toBe(3);
  });
  it("returns 3 when completions exceed totalHabits", () => {
    expect(computeHeatLevel(5, 4)).toBe(3);
  });
});

describe("groupCompletionsByDate", () => {
  it("counts completions per date key", () => {
    const completions: HabitCompletion[] = [
      {
        objectId: "1",
        habitId: "h1",
        completedDate: new Date("2026-05-01T10:00:00Z"),
      },
      {
        objectId: "2",
        habitId: "h2",
        completedDate: new Date("2026-05-01T11:00:00Z"),
      },
      {
        objectId: "3",
        habitId: "h3",
        completedDate: new Date("2026-05-02T10:00:00Z"),
      },
    ];
    expect(groupCompletionsByDate(completions)).toEqual({
      "2026-05-01": 2,
      "2026-05-02": 1,
    });
  });
});

describe("groupCheckInsByDate", () => {
  it("maps date to spiral", () => {
    const checkIns: CheckIn[] = [
      {
        objectId: "1",
        date: new Date("2026-05-01T09:00:00Z"),
        spiral: "the_clock",
        createdAt: new Date(),
      },
      {
        objectId: "2",
        date: new Date("2026-05-02T09:00:00Z"),
        spiral: "actually_okay",
        createdAt: new Date(),
      },
    ];
    expect(groupCheckInsByDate(checkIns)).toEqual({
      "2026-05-01": "the_clock",
      "2026-05-02": "actually_okay",
    });
  });
});
