import { describe, it, expect } from "vitest";
import { isLocked, hoursUntilLock } from "./the-why";

describe("isLocked", () => {
  it("returns false for entry created 1 hour ago", () => {
    const createdAt = new Date(Date.now() - 1 * 60 * 60 * 1000);
    expect(isLocked(createdAt)).toBe(false);
  });

  it("returns false for entry created exactly 47 hours ago", () => {
    const createdAt = new Date(Date.now() - 47 * 60 * 60 * 1000);
    expect(isLocked(createdAt)).toBe(false);
  });

  it("returns true for entry created 49 hours ago", () => {
    const createdAt = new Date(Date.now() - 49 * 60 * 60 * 1000);
    expect(isLocked(createdAt)).toBe(true);
  });
});

describe("hoursUntilLock", () => {
  it("returns 47 for entry created 1 hour ago", () => {
    const createdAt = new Date(Date.now() - 1 * 60 * 60 * 1000);
    expect(hoursUntilLock(createdAt)).toBe(47);
  });

  it("returns 1 for entry created 47 hours ago", () => {
    const createdAt = new Date(Date.now() - 47 * 60 * 60 * 1000);
    expect(hoursUntilLock(createdAt)).toBe(1);
  });

  it("returns 0 for entry already locked", () => {
    const createdAt = new Date(Date.now() - 49 * 60 * 60 * 1000);
    expect(hoursUntilLock(createdAt)).toBe(0);
  });
});
