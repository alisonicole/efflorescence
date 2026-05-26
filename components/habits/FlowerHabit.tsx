"use client";

import { useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import { detectBlossomEarned } from "@/lib/garden";
import type { Habit, HabitCategory } from "@/types";

const CATEGORY_COLOR: Record<HabitCategory, string> = {
  water_meals: "#7A9E6E",
  outside: "#B8935A",
  no_contact: "#C97A6E",
  no_stalking: "#8A7BA0",
  journaling: "#4A6741",
  talking: "#DBA898",
};

interface FlowerHabitProps {
  habit: Habit;
  streak: number;
  completedToday: boolean;
  onToggle: (habitId: string, completed: boolean) => void;
}

const PETAL_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export default function FlowerHabit({
  habit,
  streak,
  completedToday,
  onToggle,
}: FlowerHabitProps) {
  const [saving, setSaving] = useState(false);
  const [watering, setWatering] = useState(false);
  const color = CATEGORY_COLOR[habit.category] ?? "#7A9E6E";

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
        onToggle(habit.objectId, false);
      } else {
        const completion = new HabitCompletion();
        completion.set("user", user);
        completion.set("habitId", habit.objectId);
        completion.set("completedDate", new Date());
        completion.setACL(new Parse.ACL(user));
        await completion.save();
        onToggle(habit.objectId, true);

        // Check if a blossom was earned (7-day streak milestone)
        try {
          const completionQuery = new Parse.Query(HabitCompletion);
          completionQuery.equalTo("user", user);
          completionQuery.equalTo("habitId", habit.objectId);
          const allCompletions = await completionQuery.find();
          const newStreak = allCompletions.length;
          const prevStreak = newStreak - 1;

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
          // Blossom creation failure must not affect the habit completion record
        }
      }
    } finally {
      setSaving(false);
    }
  }

  return (
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
        className={`transition-all duration-500 ${completedToday ? "drop-shadow-sm" : "opacity-60"}`}
      >
        {/* Stem */}
        <line
          x1="28"
          y1="38"
          x2="28"
          y2="72"
          stroke="#4A6741"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Leaf */}
        <ellipse
          cx="21"
          cy="58"
          rx="7"
          ry="3.5"
          fill="#7A9E6E"
          opacity="0.65"
          transform="rotate(-35 21 58)"
        />

        {completedToday ? (
          <>
            {PETAL_ANGLES.map((angle) => (
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
            {/* Center disk */}
            <circle cx="28" cy="28" r="7" fill="#F5EFE4" />
            <circle cx="28" cy="28" r="5" fill={color} opacity="0.55" />
            <circle cx="28" cy="28" r="2.5" fill={color} opacity="0.9" />
          </>
        ) : (
          <>
            {/* Bud petals closed */}
            <ellipse
              cx="28"
              cy="26"
              rx="6"
              ry="11"
              fill={color}
              opacity="0.45"
            />
            <ellipse cx="28" cy="27" rx="4" ry="8" fill={color} opacity="0.7" />
            {/* Sepals */}
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
        )}
      </svg>

      <p className="font-mono text-[7.5px] uppercase tracking-[1.5px] text-bark text-center leading-tight w-14">
        {habit.name}
      </p>
      <div
        className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-bark/5 transition-opacity duration-500 ${
          streak === 0 ? "opacity-30" : "opacity-100"
        }`}
      >
        <span className="text-[10px] leading-none">🌱</span>
        <span className="font-mono text-[9px] font-medium text-bark leading-none">
          {Math.max(1, streak)}
        </span>
      </div>
    </button>
  );
}
