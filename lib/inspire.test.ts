import { describe, it, expect } from "vitest";
import { getInspireItems, getMilestoneItem, isWithinDayRange } from "./inspire";
import type { Spiral } from "@/types";

describe("isWithinDayRange", () => {
  it("returns true when dayCount is within range", () => {
    expect(isWithinDayRange(15, [1, 30])).toBe(true);
  });
  it("returns true when dayCount equals range boundary", () => {
    expect(isWithinDayRange(30, [1, 30])).toBe(true);
  });
  it("returns false when dayCount is outside range", () => {
    expect(isWithinDayRange(31, [1, 30])).toBe(false);
  });
  it("returns true when no range is specified (undefined)", () => {
    expect(isWithinDayRange(100, undefined)).toBe(true);
  });
});

describe("getMilestoneItem", () => {
  it("returns milestone item at day 21", () => {
    const item = getMilestoneItem(21);
    expect(item?.milestoneDay).toBe(21);
  });
  it("returns milestone item at day 30", () => {
    expect(getMilestoneItem(30)?.milestoneDay).toBe(30);
  });
  it("returns undefined for non-milestone day", () => {
    expect(getMilestoneItem(25)).toBeUndefined();
  });
});

describe("getInspireItems", () => {
  it("returns items matching the given spiral", () => {
    const items = getInspireItems("the_clock", 15, []);
    const spirals = items.map((i) => i.spirals);
    expect(
      spirals.every((s) => s.includes("the_clock") || s.includes("all")),
    ).toBe(true);
  });
  it("excludes already-seen items", () => {
    const items = getInspireItems("the_clock", 15, ["SCI-005"]);
    expect(items.every((i) => i.id !== "SCI-005")).toBe(true);
  });
  it("returns at most 3 items", () => {
    expect(getInspireItems("the_what_if", 15, []).length).toBeLessThanOrEqual(
      3,
    );
  });
});
