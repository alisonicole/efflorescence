"use client";

import { useCallback, useEffect, useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import { BLOSSOM_SPECIES } from "@/lib/garden";
import type { BlossomEntry, HabitCategory } from "@/types";

export default function BlossomGrove() {
  const [blossoms, setBlossoms] = useState<BlossomEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    initParse();
    const user = Parse.User.current();
    if (!user) return;
    try {
      const query = new Parse.Query("BlossomEntry");
      query.equalTo("user", user);
      query.ascending("createdAt");
      const results = await query.find();
      setBlossoms(
        results.map((r) => ({
          objectId: r.id,
          habitCategory: r.get("habitCategory") as HabitCategory,
          habitName: r.get("habitName") as string,
          streakStartDate: r.get("streakStartDate") as Date,
          streakEndDate: r.get("streakEndDate") as Date,
          streakLength: r.get("streakLength") as number,
          createdAt: r.createdAt!,
        })),
      );
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading || blossoms.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="font-mono text-[9px] uppercase tracking-[3px] text-soil opacity-60 mb-2">
        blossom grove
      </p>
      <div className="flex flex-wrap gap-2">
        {blossoms.map((b) => {
          const species = BLOSSOM_SPECIES[b.habitCategory];
          return (
            <div
              key={b.objectId}
              title={`${b.habitName} - ${b.streakLength} days`}
              className="flex flex-col items-center gap-0.5 bg-white rounded-card px-3 py-2 border border-border"
            >
              <span className="text-xl">{species.emoji}</span>
              <span className="font-mono text-[7px] text-muted">
                {b.streakStartDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
