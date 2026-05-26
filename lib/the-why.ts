const LOCK_MS = 48 * 60 * 60 * 1000;

export function isLocked(createdAt: Date): boolean {
  return Date.now() - createdAt.getTime() >= LOCK_MS;
}

export function hoursUntilLock(createdAt: Date): number {
  const remaining = LOCK_MS - (Date.now() - createdAt.getTime());
  return Math.max(0, Math.ceil(remaining / (60 * 60 * 1000)));
}
