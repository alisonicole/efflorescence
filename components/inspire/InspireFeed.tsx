"use client";

import { useEffect, useState } from "react";
import { getInspireItems, getMilestoneItem } from "@/lib/inspire";
import InspireCard from "./InspireCard";
import type { Spiral, InspireItem } from "@/types";

const SEEN_STORAGE_KEY = "tender_inspire_seen";
const SEEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

interface SeenRecord {
  id: string;
  seenAt: number;
}

function getSeenIds(): string[] {
  try {
    const raw = localStorage.getItem(SEEN_STORAGE_KEY);
    if (!raw) return [];
    const records: SeenRecord[] = JSON.parse(raw) as SeenRecord[];
    const cutoff = Date.now() - SEEN_TTL_MS;
    return records.filter((r) => r.seenAt > cutoff).map((r) => r.id);
  } catch {
    return [];
  }
}

function markSeen(ids: string[]) {
  try {
    const existing: SeenRecord[] = JSON.parse(
      localStorage.getItem(SEEN_STORAGE_KEY) ?? "[]",
    ) as SeenRecord[];
    const newRecords: SeenRecord[] = ids.map((id) => ({
      id,
      seenAt: Date.now(),
    }));
    const merged = [
      ...existing.filter((r) => !ids.includes(r.id)),
      ...newRecords,
    ];
    localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // silent
  }
}

interface InspireFeedProps {
  spiral: Spiral | undefined;
  dayCount: number;
}

export default function InspireFeed({ spiral, dayCount }: InspireFeedProps) {
  const [items, setItems] = useState<InspireItem[]>([]);
  const [milestone, setMilestone] = useState<InspireItem | undefined>();

  useEffect(() => {
    if (!spiral) return;
    const seenIds = getSeenIds();
    const feed = getInspireItems(spiral, dayCount, seenIds);
    const mile = getMilestoneItem(dayCount);
    setItems(feed);
    setMilestone(mile);
    markSeen(feed.map((i) => i.id));
  }, [spiral, dayCount]);

  if (!spiral) {
    return (
      <p className="text-sm text-muted">Check in today to see your feed.</p>
    );
  }

  return (
    <div className="space-y-3">
      {milestone && <InspireCard item={milestone} isMilestone />}
      {items.map((item) => (
        <InspireCard key={item.id} item={item} />
      ))}
      {items.length === 0 && !milestone && (
        <p className="text-sm text-muted">
          Nothing new today. Check back tomorrow.
        </p>
      )}
    </div>
  );
}
