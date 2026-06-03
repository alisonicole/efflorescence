"use client";

import { useEffect, useRef, useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import { computeStreak } from "@/lib/garden";
import SuggestedSeeds from "./SuggestedSeeds";
import type { Habit, HabitCategory } from "@/types";
import FlowerHabit from "./FlowerHabit";

// Auto-assigned icons cycle through this list for custom habits
const CUSTOM_ICONS = [
  "🌱",
  "🌿",
  "🌺",
  "💮",
  "🌙",
  "🦋",
  "🍃",
  "✨",
  "💫",
  "🌼",
];

const MILESTONES = [7, 21, 30] as const;
const MILESTONE_COPY: Record<number, string> = {
  7: "Seven days of showing up. That's a real streak — your brain is building something.",
  21: "21 days. The neural pathway exists. You are someone who does this now.",
  30: "30 days. Acute distress modulates around here. The nervous system downregulates. You built this.",
};

export default function HabitGrid() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set());
  const [restToday, setRestToday] = useState<Set<string>>(new Set());
  const [streaks, setStreaks] = useState<Record<string, number>>({});
  const [hasCompleted, setHasCompleted] = useState<Set<string>>(new Set());
  const [milestone, setMilestone] = useState<{
    habit: Habit;
    days: number;
  } | null>(null);

  const [plantOpen, setPlantOpen] = useState(false);
  const [weedOpen, setWeedOpen] = useState(false);
  const [weeding, setWeeding] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [planting, setPlanting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    if (plantOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [plantOpen]);

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
        name: h.get("name") as string,
        category: h.get("category") as HabitCategory,
        icon: h.get("icon") as string,
        isActive: h.get("isActive") as boolean,
        createdAt: h.createdAt!,
        habitGroup: h.get("habitGroup") as string | undefined,
        lastCelebrated: (h.get("lastCelebrated") as number | undefined) ?? 0,
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
      const restSet = new Set<string>();
      const streakMap: Record<string, number> = {};
      const hasCompletedSet = new Set<string>();

      for (const c of completions) {
        hasCompletedSet.add(c.get("habitId") as string);
      }

      for (const habit of habitList) {
        const habitCompletions = completions.filter(
          (c) => c.get("habitId") === habit.objectId,
        );
        const dates = habitCompletions.map(
          (c) => c.get("completedDate") as Date,
        );

        const todayCompletion = habitCompletions.find((c) => {
          const dd = new Date(c.get("completedDate") as Date);
          dd.setHours(0, 0, 0, 0);
          return (
            dd.getTime() >= today.getTime() && dd.getTime() < tomorrow.getTime()
          );
        });

        if (todayCompletion) {
          todaySet.add(habit.objectId);
          if (todayCompletion.get("isRestDay")) restSet.add(habit.objectId);
        }
        streakMap[habit.objectId] = computeStreak(dates);
      }

      setCompletedToday(todaySet);
      setRestToday(restSet);
      setStreaks(streakMap);
      setHasCompleted(hasCompletedSet);

      let found = false;
      for (const habit of habitList) {
        if (found) break;
        const streak = streakMap[habit.objectId] ?? 0;
        const lastCelebrated = habit.lastCelebrated ?? 0;
        for (const m of MILESTONES) {
          if (streak >= m && lastCelebrated < m) {
            setMilestone({ habit, days: m });
            found = true;
            break;
          }
        }
      }
    } catch {
      // silently preserve existing empty state
    }
  }

  async function handlePlant() {
    if (!newName.trim() || planting) return;
    setPlanting(true);
    initParse();
    const user = Parse.User.current();
    if (!user) {
      setPlanting(false);
      return;
    }

    try {
      // Auto-assign icon based on how many custom habits already exist
      const customCount = habits.filter((h) => h.habitGroup === "grow").length;
      const autoIcon = CUSTOM_ICONS[customCount % CUSTOM_ICONS.length];

      const ParseHabit = Parse.Object.extend("Habit");
      const habit = new ParseHabit();
      habit.set("user", user);
      habit.set("name", newName.trim());
      habit.set("category", "custom");
      habit.set("icon", autoIcon);
      habit.set("isActive", true);
      habit.set("habitGroup", "grow");
      habit.setACL(new Parse.ACL(user));
      await habit.save();
      setNewName("");
      setPlantOpen(false);
      void loadHabits();
    } catch {
      // best-effort
    } finally {
      setPlanting(false);
    }
  }

  async function handleWeed(habitId: string) {
    if (weeding) return;
    setWeeding(habitId);
    initParse();
    const user = Parse.User.current();
    if (!user) {
      setWeeding(null);
      return;
    }
    try {
      const ParseHabit = Parse.Object.extend("Habit");
      const query = new Parse.Query(ParseHabit);
      const habit = await query.get(habitId);
      habit.set("isActive", false);
      await habit.save();
      setWeedOpen(false);
      void loadHabits();
    } catch {
      // silent
    } finally {
      setWeeding(null);
    }
  }

  function handleToggle(habitId: string, completed: boolean) {
    setCompletedToday((prev) => {
      const next = new Set(prev);
      completed ? next.add(habitId) : next.delete(habitId);
      return next;
    });
  }

  async function dismissMilestone() {
    if (!milestone) return;
    const { habit, days } = milestone;
    setMilestone(null);
    initParse();
    const user = Parse.User.current();
    if (!user) return;
    try {
      const ParseHabit = Parse.Object.extend("Habit");
      const query = new Parse.Query(ParseHabit);
      const parseHabit = await query.get(habit.objectId);
      parseHabit.set("lastCelebrated", days);
      await parseHabit.save();
      setHabits((prev) =>
        prev.map((h) =>
          h.objectId === habit.objectId ? { ...h, lastCelebrated: days } : h,
        ),
      );
    } catch {
      // non-critical
    }
  }

  if (habits.length === 0)
    return <SuggestedSeeds onAdded={() => void loadHabits()} />;

  return (
    <>
      {/* Unified garden */}
      <div className="mx-2.5">
        <div className="bg-white rounded-card shadow-sm">
          {/* Header */}
          <div className="px-3.5 pt-3 pb-0 flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[8px] uppercase tracking-[2.5px] text-bark/60">
                Your garden
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setWeedOpen(true)}
                className="font-mono text-[8px] uppercase tracking-[2px] text-bark/40 hover:text-bark/70 transition-colors"
              >
                + weed
              </button>
              <button
                onClick={() => setPlantOpen(true)}
                className="font-mono text-[8px] uppercase tracking-[2px] text-bark/40 hover:text-bark/70 transition-colors"
              >
                + plant
              </button>
            </div>
          </div>

          {/* All habits in one grid */}
          <div className="px-2 pt-4 grid grid-cols-3 justify-items-center gap-y-1">
            {habits.map((habit) => {
              const streak = streaks[habit.objectId] ?? 0;
              const doneToday = completedToday.has(habit.objectId);
              const isWilting =
                !doneToday && streak === 0 && hasCompleted.has(habit.objectId);
              return (
                <FlowerHabit
                  key={habit.objectId}
                  habit={habit}
                  streak={streak}
                  completedToday={doneToday}
                  isWilting={isWilting}
                  restToday={restToday.has(habit.objectId)}
                  onToggle={handleToggle}
                />
              );
            })}
          </div>

          <div className="mt-1 mx-3.5 mb-3 h-1.5 rounded-full bg-[#C4A882] opacity-30" />
        </div>
      </div>

      {/* Plant a seed bottom sheet */}
      {plantOpen && (
        <>
          <div
            className="fixed inset-0 bg-bark/30 z-40 backdrop-blur-[2px]"
            onClick={() => setPlantOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
            <div className="bg-cream rounded-t-2xl px-5 pt-6 pb-10 max-w-app mx-auto">
              <div className="w-8 h-0.5 rounded-full bg-bark/15 mx-auto mb-5" />
              <p className="font-display font-light italic text-[20px] text-bark tracking-tight mb-1">
                Plant a new seed
              </p>
              <p className="font-mono text-[9px] text-soil opacity-50 mb-5">
                Something you want to tend to
              </p>

              <input
                ref={inputRef}
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void handlePlant()}
                placeholder="Name your habit..."
                maxLength={40}
                className="w-full bg-white border border-border rounded-card px-4 py-3 text-sm text-bark placeholder:text-bark/30 focus:outline-none focus:border-clay/40 mb-4"
              />

              <button
                onClick={() => void handlePlant()}
                disabled={!newName.trim() || planting}
                className="w-full bg-bark text-cream rounded-card py-3 text-sm font-medium disabled:opacity-40 transition-opacity"
              >
                {planting ? "Planting..." : "Plant it"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Weed bottom sheet */}
      {weedOpen && (
        <>
          <div
            className="fixed inset-0 bg-bark/30 z-40 backdrop-blur-[2px]"
            onClick={() => setWeedOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
            <div className="bg-cream rounded-t-2xl px-5 pt-6 pb-10 max-w-app mx-auto">
              <div className="w-8 h-0.5 rounded-full bg-bark/15 mx-auto mb-5" />
              <p className="font-display font-light italic text-[20px] text-bark tracking-tight mb-1">
                Pull a weed
              </p>
              <p className="font-mono text-[9px] text-soil opacity-50 mb-5">
                Remove a habit from your garden
              </p>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {habits.map((habit) => (
                  <button
                    key={habit.objectId}
                    onClick={() => void handleWeed(habit.objectId)}
                    disabled={!!weeding}
                    className="w-full flex items-center gap-3 bg-white border border-border rounded-card px-4 py-3 text-left disabled:opacity-40 active:scale-[0.98] transition-transform"
                  >
                    <span className="text-xl">{habit.icon}</span>
                    <span className="text-sm text-bark flex-1">
                      {habit.name}
                    </span>
                    {weeding === habit.objectId ? (
                      <span className="font-mono text-[9px] text-muted">
                        removing...
                      </span>
                    ) : (
                      <span className="font-mono text-[9px] text-bark/30">
                        remove
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Milestone overlay */}
      {milestone && (
        <div className="fixed inset-0 bg-bark/60 z-50 flex items-center justify-center px-6 backdrop-blur-sm">
          <div className="bg-cream rounded-card px-7 py-8 w-full max-w-app text-center animate-slide-up">
            <p className="text-5xl mb-4">🌸</p>
            <p className="font-mono text-[9px] uppercase tracking-[3px] text-bark/50 mb-1">
              {milestone.habit.name}
            </p>
            <p className="font-display italic text-bark text-2xl mb-4">
              {milestone.days} days.
            </p>
            <p className="text-sm text-bark/70 leading-relaxed mb-6">
              {MILESTONE_COPY[milestone.days]}
            </p>
            <button
              onClick={() => void dismissMilestone()}
              className="w-full bg-bark text-cream rounded-card py-3 text-sm font-medium"
            >
              Seal it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
