"use client";

import Link from "next/link";
import type { Habit, HabitCategory } from "@/types";

const STAGGER = [0, 8, 3, 12, 1, 9, 4, 14, 2, 7, 5, 11, 0, 6, 10];

const CATEGORY_COLOR: Record<HabitCategory, string> = {
  no_contact: "#6B8F6E",
  no_stalking: "#D4823A",
  no_old_photos: "#9B8DB5",
  eat_water: "#D4B483",
  move_body: "#E8C547",
  fresh_air: "#8FB5A0",
  talk: "#C97A8A",
  sleep: "#5C6B8A",
  get_dressed: "#C4B447",
  journal: "#7B6EA0",
  just_for_you: "#D48A9B",
  therapy: "#7A9BB5",
  custom: "#B8A89A",
};

const PETAL_ANGLES: Record<number, number[]> = {
  4: [0, 180],
  5: [0, 90, 180, 270],
  6: [0, 60, 120, 180, 240, 300],
  7: [0, 45, 90, 135, 180, 225, 270, 315],
};

function MiniFlower({
  stage,
  color,
  opacity,
}: {
  stage: number;
  color: string;
  opacity: number;
}) {
  return (
    <svg
      width="40"
      height="54"
      viewBox="0 0 56 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      {stage === 0 ? (
        <>
          <ellipse
            cx="28"
            cy="69"
            rx="13"
            ry="3.5"
            fill="#C4A882"
            opacity="0.55"
          />
          <ellipse
            cx="28"
            cy="66"
            rx="3.5"
            ry="2.5"
            fill={color}
            opacity="0.65"
          />
        </>
      ) : stage === 1 ? (
        <>
          <line
            x1="28"
            y1="56"
            x2="28"
            y2="72"
            stroke="#4A6741"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <ellipse
            cx="21"
            cy="54"
            rx="7"
            ry="3.2"
            fill="#7A9E6E"
            opacity="0.8"
            transform="rotate(-30 21 54)"
          />
          <ellipse
            cx="35"
            cy="54"
            rx="7"
            ry="3.2"
            fill="#7A9E6E"
            opacity="0.8"
            transform="rotate(30 35 54)"
          />
        </>
      ) : stage === 2 ? (
        <>
          <line
            x1="28"
            y1="48"
            x2="28"
            y2="72"
            stroke="#4A6741"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <ellipse
            cx="21"
            cy="63"
            rx="6"
            ry="3"
            fill="#7A9E6E"
            opacity="0.65"
            transform="rotate(-35 21 63)"
          />
          <ellipse cx="28" cy="42" rx="4" ry="7" fill={color} opacity="0.5" />
          <ellipse
            cx="28"
            cy="43"
            rx="2.5"
            ry="5"
            fill={color}
            opacity="0.72"
          />
        </>
      ) : stage === 3 ? (
        <>
          <line
            x1="28"
            y1="38"
            x2="28"
            y2="72"
            stroke="#4A6741"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <ellipse
            cx="21"
            cy="58"
            rx="7"
            ry="3.5"
            fill="#7A9E6E"
            opacity="0.65"
            transform="rotate(-35 21 58)"
          />
          <ellipse cx="28" cy="26" rx="6" ry="11" fill={color} opacity="0.45" />
          <ellipse cx="28" cy="27" rx="4" ry="8" fill={color} opacity="0.7" />
        </>
      ) : (
        <>
          <line
            x1="28"
            y1="38"
            x2="28"
            y2="72"
            stroke="#4A6741"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <ellipse
            cx="21"
            cy="58"
            rx="7"
            ry="3.5"
            fill="#7A9E6E"
            opacity="0.65"
            transform="rotate(-35 21 58)"
          />
          {(PETAL_ANGLES[stage] ?? PETAL_ANGLES[7]).map((angle) => (
            <ellipse
              key={angle}
              cx="28"
              cy="17"
              rx="4.5"
              ry="8"
              fill={color}
              opacity="0.82"
              transform={`rotate(${angle} 28 28)`}
            />
          ))}
          <circle cx="28" cy="28" r={stage === 7 ? 7 : 5} fill="#F5EFE4" />
          <circle
            cx="28"
            cy="28"
            r={stage === 7 ? 5 : 3.5}
            fill={color}
            opacity="0.55"
          />
          <circle cx="28" cy="28" r="2.5" fill={color} opacity="0.9" />
        </>
      )}
    </svg>
  );
}

export default function GardenScene({
  habits,
  streaks,
  showLabels = true,
}: {
  habits: Habit[];
  streaks: Record<string, number>;
  showLabels?: boolean;
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
            const color = CATEGORY_COLOR[h.category] ?? "#7A9E6E";
            const mb = STAGGER[i % STAGGER.length];
            const opacity = stage === 0 ? 0.35 : 0.9;

            return (
              <div
                key={h.objectId}
                className="flex flex-col items-center"
                style={{ marginBottom: mb }}
              >
                <MiniFlower stage={stage} color={color} opacity={opacity} />
                {showLabels && (
                  <p
                    className="font-mono uppercase text-bark/40 text-center leading-none"
                    style={{ fontSize: 5.5, maxWidth: 40 }}
                  >
                    {h.name.length > 7 ? h.name.slice(0, 7) : h.name}
                  </p>
                )}
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
