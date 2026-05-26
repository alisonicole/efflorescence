"use client";

import { useEffect, useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import { computeStreak } from "@/lib/garden";
import type { Habit } from "@/types";
import FlowerHabit from "./FlowerHabit";

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
    <div className="mx-2.5 bg-white rounded-card px-3 pt-4 pb-2 shadow-sm">
      <div className="flex justify-around items-end">
        {habits.map((habit) => (
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
      <div className="mt-1 h-2 rounded-full bg-[#C4A882] opacity-30" />
    </div>
  );
}
