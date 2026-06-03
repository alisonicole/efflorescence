"use client";

import Link from "next/link";
import { BLOSSOM_SPECIES } from "@/lib/garden";
import type { Habit } from "@/types";

const STAGGER = [0, 8, 3, 12, 1, 9, 4, 14, 2, 7, 5, 11, 0, 6, 10];

export default function GardenScene({
  habits,
  streaks,
}: {
  habits: Habit[];
  streaks: Record<string, number>;
}) {
  if (habits.length === 0) {
    return (
      <div className="mx-2.5 bg-white rounded-card border border-border p-8 text-center">
        <p className="font-display italic text-bark/40 text-sm">
          Plant your first seed to grow your garden.
        </p>
      </div>
    );
  }

  return (
    <Link href="/garden" className="block mx-2.5">
      <div
        className="relative rounded-card overflow-hidden"
        style={{
          background:
            "linear-gradient(175deg, #f5ede0 0%, #dcebd0 70%, #c8ddb8 100%)",
          minHeight: 148,
        }}
      >
        {/* Flowers */}
        <div className="flex flex-wrap items-end justify-around gap-x-2 gap-y-0 px-4 pt-5 pb-9">
          {habits.map((h, i) => {
            const streak = streaks[h.objectId] ?? 0;
            const stage = Math.min(streak, 7);
            const species = BLOSSOM_SPECIES[h.category];
            const emoji = species?.emoji ?? "🌱";
            // Scale emoji with stage: seed is tiny, full bloom is large
            const size = stage === 0 ? 14 : 16 + stage * 2.5;
            const mb = STAGGER[i % STAGGER.length];

            return (
              <div
                key={h.objectId}
                className="flex flex-col items-center"
                style={{ marginBottom: mb, opacity: stage === 0 ? 0.35 : 0.9 }}
              >
                <span style={{ fontSize: size, lineHeight: 1 }}>{emoji}</span>
                <p
                  className="font-mono uppercase text-bark/40 text-center mt-0.5 leading-none"
                  style={{ fontSize: 5.5, maxWidth: 28 }}
                >
                  {h.name.length > 6 ? h.name.slice(0, 6) : h.name}
                </p>
              </div>
            );
          })}
        </div>

        {/* Ground strip */}
        <div
          className="absolute bottom-0 left-0 right-0 h-7 rounded-b-card"
          style={{ background: "rgba(90,138,74,0.28)" }}
        />

        <p
          className="absolute bottom-2 right-3 font-mono uppercase tracking-widest text-bark/25"
          style={{ fontSize: 6.5 }}
        >
          tap to tend
        </p>
      </div>
    </Link>
  );
}
