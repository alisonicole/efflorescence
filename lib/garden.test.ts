import { describe, it, expect } from "vitest";
import {
  computeDayCount,
  computeSeason,
  computeGardenState,
  computeStreak,
  detectBlossomEarned,
} from "./garden";

describe("computeDayCount", () => {
  it("returns 0 when healingStartDate is today", () => {
    expect(computeDayCount(new Date())).toBe(0);
  });
  it("returns 14 when healingStartDate is 14 days ago", () => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    expect(computeDayCount(d)).toBe(14);
  });
});

describe("computeSeason", () => {
  it("returns late_autumn for day 0", () =>
    expect(computeSeason(0)).toBe("late_autumn"));
  it("returns late_autumn for day 14", () =>
    expect(computeSeason(14)).toBe("late_autumn"));
  it("returns winter for day 15", () =>
    expect(computeSeason(15)).toBe("winter"));
  it("returns early_spring for day 31", () =>
    expect(computeSeason(31)).toBe("early_spring"));
  it("returns full_spring for day 61", () =>
    expect(computeSeason(61)).toBe("full_spring"));
  it("returns summer for day 91", () =>
    expect(computeSeason(91)).toBe("summer"));
});

describe("computeGardenState", () => {
  it("returns dormant for 0 completions", () =>
    expect(computeGardenState(0)).toBe("dormant"));
  it("returns stirring for 2 completions", () =>
    expect(computeGardenState(2)).toBe("stirring"));
  it("returns tending for 7 completions", () =>
    expect(computeGardenState(7)).toBe("tending"));
  it("returns blooming for 11 completions", () =>
    expect(computeGardenState(11)).toBe("blooming"));
});

describe("computeStreak", () => {
  it("returns 0 for no completions", () => expect(computeStreak([])).toBe(0));
  it("returns 3 for 3 consecutive days ending today", () => {
    const dates = [0, 1, 2].map((daysAgo) => {
      const d = new Date();
      d.setDate(d.getDate() - daysAgo);
      return d;
    });
    expect(computeStreak(dates)).toBe(3);
  });
  it("returns 1 for a completion yesterday (streak still active)", () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    expect(computeStreak([d])).toBe(1);
  });
  it("returns 2 for consecutive completions yesterday and day before", () => {
    const dates = [1, 2].map((daysAgo) => {
      const d = new Date();
      d.setDate(d.getDate() - daysAgo);
      return d;
    });
    expect(computeStreak(dates)).toBe(2);
  });
  it("returns 0 when most recent completion was 2 days ago", () => {
    const d = new Date();
    d.setDate(d.getDate() - 2);
    expect(computeStreak([d])).toBe(0);
  });
});

describe("detectBlossomEarned", () => {
  it("returns false when streak is below 7", () => {
    expect(detectBlossomEarned(6, 5)).toBe(false);
  });
  it("returns true when streak crosses 7 for the first time", () => {
    expect(detectBlossomEarned(7, 6)).toBe(true);
  });
  it("returns false when streak was already past 7 with no new milestone", () => {
    expect(detectBlossomEarned(10, 8)).toBe(false);
  });
  it("returns true when streak crosses 14", () => {
    expect(detectBlossomEarned(14, 13)).toBe(true);
  });
  it("returns false when prev streak already past 14", () => {
    expect(detectBlossomEarned(16, 14)).toBe(false);
  });
});
