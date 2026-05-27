"use client";

import { useEffect, useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import {
  detectBlossomEarned,
  computeStreak,
  BLOSSOM_SPECIES,
} from "@/lib/garden";
import { HABIT_WHY } from "@/lib/default-habits";
import type { Habit, HabitCategory } from "@/types";

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
};

// Petal sets per stage: stage 4 = 2 petals, 5 = 4, 6 = 6, 7 = 8
const PETAL_ANGLES: Record<number, number[]> = {
  4: [0, 180],
  5: [0, 90, 180, 270],
  6: [0, 60, 120, 180, 240, 300],
  7: [0, 45, 90, 135, 180, 225, 270, 315],
};

interface FlowerHabitProps {
  habit: Habit;
  streak: number;
  completedToday: boolean;
  isWilting: boolean;
  onToggle: (habitId: string, completed: boolean) => void;
}

export default function FlowerHabit({
  habit,
  streak,
  completedToday,
  isWilting,
  onToggle,
}: FlowerHabitProps) {
  const [saving, setSaving] = useState(false);
  const [watering, setWatering] = useState(false);
  const [localStreak, setLocalStreak] = useState(streak);

  useEffect(() => {
    setLocalStreak(streak);
  }, [streak]);

  const color = CATEGORY_COLOR[habit.category] ?? "#7A9E6E";
  // Growth stage 0-7, capped at 7 for full bloom.
  const stage = Math.min(localStreak, 7);
  const svgOpacity = completedToday
    ? 1
    : isWilting
      ? 0.5
      : stage === 0
        ? 0.45
        : 0.65;

  async function handleTap() {
    if (saving) return;
    setSaving(true);
    if (!completedToday) {
      setWatering(true);
      setTimeout(() => setWatering(false), 700);
    }

    initParse();
    const user = Parse.User.current();
    if (!user) {
      setSaving(false);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const HabitCompletion = Parse.Object.extend("HabitCompletion");

    try {
      if (completedToday) {
        const query = new Parse.Query(HabitCompletion);
        query.equalTo("user", user);
        query.equalTo("habitId", habit.objectId);
        query.greaterThanOrEqualTo("completedDate", today);
        query.lessThan("completedDate", tomorrow);
        const existing = await query.first();
        if (existing) await existing.destroy();
        setLocalStreak(Math.max(0, localStreak - 1));
        onToggle(habit.objectId, false);
      } else {
        const completion = new HabitCompletion();
        completion.set("user", user);
        completion.set("habitId", habit.objectId);
        completion.set("completedDate", new Date());
        completion.setACL(new Parse.ACL(user));
        await completion.save();
        onToggle(habit.objectId, true);

        try {
          const completionQuery = new Parse.Query(HabitCompletion);
          completionQuery.equalTo("user", user);
          completionQuery.equalTo("habitId", habit.objectId);
          const allCompletions = await completionQuery.find();
          const dates = allCompletions.map(
            (c) => c.get("completedDate") as Date,
          );
          const newStreak = computeStreak(dates);
          setLocalStreak(newStreak);
          const prevStreak = Math.max(0, newStreak - 1);

          if (detectBlossomEarned(newStreak, prevStreak)) {
            const ParseBlossom = Parse.Object.extend("BlossomEntry");
            const blossom = new ParseBlossom();
            const streakStart = new Date();
            streakStart.setDate(streakStart.getDate() - (newStreak - 1));
            blossom.set("user", user);
            blossom.set("habitCategory", habit.category);
            blossom.set("habitName", habit.name);
            blossom.set("streakStartDate", streakStart);
            blossom.set("streakEndDate", new Date());
            blossom.set("streakLength", newStreak);
            blossom.setACL(new Parse.ACL(user));
            await blossom.save();
          }
        } catch {
          /* blossom failure must not affect completion */
        }
      }
    } finally {
      setSaving(false);
    }
  }

  const why = HABIT_WHY[habit.category];
  const flowerName = BLOSSOM_SPECIES[habit.category]?.name ?? habit.category;

  return (
    <div className="relative group flex flex-col items-center">
      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-36 bg-bark text-cream rounded-xl px-3 py-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg">
        <p className="font-mono text-[7px] uppercase tracking-wider opacity-50 mb-1">
          {flowerName}
        </p>
        <p className="text-[10px] leading-snug">{why}</p>
      </div>

      <button
        onClick={handleTap}
        disabled={saving}
        className="flex flex-col items-center gap-1 relative transition-transform active:scale-95"
        aria-label={`${habit.name}${completedToday ? " (done)" : ""}`}
      >
        {watering && (
          <span className="absolute -top-1 left-1/2 text-[11px] pointer-events-none animate-water-drop z-10">
            💧
          </span>
        )}

        <svg
          width="56"
          height="76"
          viewBox="0 0 56 76"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: svgOpacity }}
          className="transition-all duration-500"
        >
          {isWilting ? (
            // Wilting: stem curves and droops to the right.
            <>
              <path
                d="M28 72 C28 58 31 48 38 36"
                stroke="#4A6741"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <ellipse
                cx="22"
                cy="58"
                rx="7"
                ry="3.5"
                fill="#7A9E6E"
                opacity="0.5"
                transform="rotate(-35 22 58)"
              />
              <ellipse
                cx="40"
                cy="26"
                rx="6"
                ry="11"
                fill={color}
                opacity="0.3"
                transform="rotate(22 40 26)"
              />
              <ellipse
                cx="40"
                cy="27"
                rx="4"
                ry="8"
                fill={color}
                opacity="0.45"
                transform="rotate(22 40 27)"
              />
              <ellipse
                cx="34"
                cy="35"
                rx="3.5"
                ry="6"
                fill="#4A6741"
                opacity="0.4"
                transform="rotate(8 34 35)"
              />
              <ellipse
                cx="44"
                cy="37"
                rx="3.5"
                ry="6"
                fill="#4A6741"
                opacity="0.4"
                transform="rotate(32 44 37)"
              />
            </>
          ) : stage === 0 ? (
            // Seed in dirt — never been completed.
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
            // Sprout — first completion.
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
            // Growing — stem rises, tiny bud forms.
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
              <ellipse
                cx="28"
                cy="42"
                rx="4"
                ry="7"
                fill={color}
                opacity="0.5"
              />
              <ellipse
                cx="28"
                cy="43"
                rx="2.5"
                ry="5"
                fill={color}
                opacity="0.72"
              />
              <ellipse
                cx="24"
                cy="49"
                rx="2.5"
                ry="4"
                fill="#4A6741"
                opacity="0.5"
                transform="rotate(-15 24 49)"
              />
              <ellipse
                cx="32"
                cy="49"
                rx="2.5"
                ry="4"
                fill="#4A6741"
                opacity="0.5"
                transform="rotate(15 32 49)"
              />
            </>
          ) : stage === 3 ? (
            // Full stem + closed bud.
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
              <ellipse
                cx="28"
                cy="26"
                rx="6"
                ry="11"
                fill={color}
                opacity="0.45"
              />
              <ellipse
                cx="28"
                cy="27"
                rx="4"
                ry="8"
                fill={color}
                opacity="0.7"
              />
              <ellipse
                cx="22"
                cy="36"
                rx="3.5"
                ry="6"
                fill="#4A6741"
                opacity="0.55"
                transform="rotate(-20 22 36)"
              />
              <ellipse
                cx="34"
                cy="36"
                rx="3.5"
                ry="6"
                fill="#4A6741"
                opacity="0.55"
                transform="rotate(20 34 36)"
              />
            </>
          ) : (
            // Stages 4–7: blooming flower with growing petal count.
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

        <p className="font-mono text-[7.5px] uppercase tracking-[1.5px] text-bark text-center leading-tight w-14">
          {habit.name}
        </p>

        {isWilting ? (
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-bark/5 opacity-40">
            <span className="text-[10px] leading-none">🥀</span>
            <span className="font-mono text-[9px] font-medium text-bark leading-none">
              0
            </span>
          </div>
        ) : (
          <div
            className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-bark/5 transition-opacity duration-500 ${
              localStreak === 0 ? "opacity-30" : "opacity-100"
            }`}
          >
            <span className="text-[10px] leading-none">🌱</span>
            <span className="font-mono text-[9px] font-medium text-bark leading-none">
              {localStreak}
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
