"use client";

import { useEffect, useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import { computeStreak } from "@/lib/garden";
import { seedDefaultHabits, HABIT_METADATA } from "@/lib/default-habits";
import type { Habit, HabitCategory } from "@/types";
import FlowerHabit from "./FlowerHabit";

type BedId = "detox" | "feed" | "heal";

const CATEGORY_GROUP = Object.fromEntries(
  HABIT_METADATA.map((m) => [m.category, m.group]),
) as Record<HabitCategory, BedId>;

const BEDS: { id: BedId; label: string; tagline: string }[] = [
  { id: "detox", label: "Detox", tagline: "protect your peace" },
  { id: "feed", label: "Feed", tagline: "tend to your body" },
  { id: "heal", label: "Heal", tagline: "soften & grow" },
];

export default function HabitGrid() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set());
  const [streaks, setStreaks] = useState<Record<string, number>>({});

  useEffect(() => {
    loadHabits();
  }, []);

  async function loadHabits() {
    initParse();
    const user = Parse.User.current();
    if (!user) return;

    try {
      const ParseHabit = Parse.Object.extend("Habit");
      const habitQuery = new Parse.Query(ParseHabit);
      habitQuery.equalTo("user", user);
      habitQuery.equalTo("isActive", true);
      const results = await habitQuery.find();

      if (!user.get("habitsSeeded")) {
        // Delete any old-format habits so we can reseed with the new flower set.
        if (results.length > 0) {
          await Parse.Object.destroyAll(results);
        }
        await seedDefaultHabits(user);
        void loadHabits();
        return;
      }

      const habitList: Habit[] = results.map((h) => ({
        objectId: h.id,
        name: h.get("name"),
        category: h.get("category"),
        icon: h.get("icon"),
        isActive: h.get("isActive"),
        createdAt: h.createdAt!,
      }));
      setHabits(habitList);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const HabitCompletion = Parse.Object.extend("HabitCompletion");
      const completionQuery = new Parse.Query(HabitCompletion);
      completionQuery.equalTo("user", user);
      completionQuery.greaterThanOrEqualTo("completedDate", thirtyDaysAgo);
      completionQuery.limit(1000);
      const completions = await completionQuery.find();

      const todaySet = new Set<string>();
      const streakMap: Record<string, number> = {};

      for (const habit of habitList) {
        const habitCompletions = completions
          .filter((c) => c.get("habitId") === habit.objectId)
          .map((c) => c.get("completedDate") as Date);

        const isTodayDone = habitCompletions.some((d) => {
          const dd = new Date(d);
          dd.setHours(0, 0, 0, 0);
          return (
            dd.getTime() >= today.getTime() && dd.getTime() < tomorrow.getTime()
          );
        });
        if (isTodayDone) todaySet.add(habit.objectId);
        streakMap[habit.objectId] = computeStreak(habitCompletions);
      }

      setCompletedToday(todaySet);
      setStreaks(streakMap);
    } catch {
      // silently preserve existing empty state; user can pull-to-refresh
    }
  }

  function handleToggle(habitId: string, completed: boolean) {
    setCompletedToday((prev) => {
      const next = new Set(prev);
      completed ? next.add(habitId) : next.delete(habitId);
      return next;
    });
  }

  if (habits.length === 0)
    return (
      <p className="text-[11px] text-muted px-2.5">
        No habits yet — they'll appear after onboarding.
      </p>
    );

  return (
    <div className="flex flex-col gap-2.5 mx-2.5">
      {BEDS.map((bed) => {
        const bedHabits = habits.filter(
          (h) => CATEGORY_GROUP[h.category] === bed.id,
        );
        if (bedHabits.length === 0) return null;

        return (
          <div
            key={bed.id}
            className="bg-white rounded-card shadow-sm overflow-hidden"
          >
            {/* Bed header */}
            <div className="px-3.5 pt-3 pb-0 flex items-baseline gap-2">
              <span className="font-mono text-[8px] uppercase tracking-[2.5px] text-bark/60">
                {bed.label}
              </span>
              <span className="font-mono text-[8px] text-bark/30 italic">
                {bed.tagline}
              </span>
            </div>

            {/* Flowers — 3-column grid keeps rows even */}
            <div className="px-2 pt-2 grid grid-cols-3 justify-items-center gap-y-1">
              {bedHabits.map((habit) => (
                <FlowerHabit
                  key={habit.objectId}
                  habit={habit}
                  streak={streaks[habit.objectId] ?? 0}
                  completedToday={completedToday.has(habit.objectId)}
                  onToggle={handleToggle}
                />
              ))}
            </div>

            {/* Soil strip */}
            <div className="mt-1 mx-3.5 mb-3 h-1.5 rounded-full bg-[#C4A882] opacity-30" />
          </div>
        );
      })}
    </div>
  );
}
