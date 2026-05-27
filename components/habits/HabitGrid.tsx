"use client";

import { useEffect, useRef, useState } from "react";
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

const STANDARD_BEDS: { id: BedId; label: string; tagline: string }[] = [
  { id: "detox", label: "Detox", tagline: "protect your peace" },
  { id: "feed", label: "Feed", tagline: "tend to your body" },
  { id: "heal", label: "Heal", tagline: "soften & grow" },
];

const GROW_ICONS = ["🌱", "🌿", "🌻", "🌺", "💮", "🌙", "🦋", "🍃", "✨", "💫"];

export default function HabitGrid() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set());
  const [streaks, setStreaks] = useState<Record<string, number>>({});
  const [hasCompleted, setHasCompleted] = useState<Set<string>>(new Set());

  // GROW creation sheet state
  const [plantOpen, setPlantOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("🌱");
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

      if (!user.get("habitsSeeded")) {
        if (results.length > 0) await Parse.Object.destroyAll(results);
        await seedDefaultHabits(user);
        void loadHabits();
        return;
      }

      const habitList: Habit[] = results.map((h) => ({
        objectId: h.id,
        name: h.get("name") as string,
        category: h.get("category") as HabitCategory,
        icon: h.get("icon") as string,
        isActive: h.get("isActive") as boolean,
        createdAt: h.createdAt!,
        habitGroup: h.get("habitGroup") as string | undefined,
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
      const hasCompletedSet = new Set<string>();

      for (const c of completions) {
        hasCompletedSet.add(c.get("habitId") as string);
      }

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
      setHasCompleted(hasCompletedSet);
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
      const ParseHabit = Parse.Object.extend("Habit");
      const habit = new ParseHabit();
      habit.set("user", user);
      habit.set("name", newName.trim());
      habit.set("category", "custom");
      habit.set("icon", newIcon);
      habit.set("isActive", true);
      habit.set("habitGroup", "grow");
      habit.setACL(new Parse.ACL(user));
      await habit.save();
      setNewName("");
      setNewIcon("🌱");
      setPlantOpen(false);
      void loadHabits();
    } catch {
      // best-effort
    } finally {
      setPlanting(false);
    }
  }

  function handleToggle(habitId: string, completed: boolean) {
    setCompletedToday((prev) => {
      const next = new Set(prev);
      completed ? next.add(habitId) : next.delete(habitId);
      return next;
    });
  }

  const growHabits = habits.filter((h) => h.habitGroup === "grow");

  function renderBed(
    label: string,
    tagline: string,
    bedHabits: Habit[],
    key: string,
    extra?: React.ReactNode,
  ) {
    if (bedHabits.length === 0 && !extra) return null;
    return (
      <div key={key} className="bg-white rounded-card shadow-sm">
        <div className="px-3.5 pt-3 pb-0 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[8px] uppercase tracking-[2.5px] text-bark/60">
              {label}
            </span>
            <span className="font-mono text-[8px] text-bark/30 italic">
              {tagline}
            </span>
          </div>
          {extra}
        </div>

        {bedHabits.length > 0 && (
          <div className="px-2 pt-4 grid grid-cols-3 justify-items-center gap-y-1">
            {bedHabits.map((habit) => {
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
                  onToggle={handleToggle}
                />
              );
            })}
          </div>
        )}

        <div className="mt-1 mx-3.5 mb-3 h-1.5 rounded-full bg-[#C4A882] opacity-30" />
      </div>
    );
  }

  if (
    habits.filter((h) => h.habitGroup !== "grow").length === 0 &&
    habits.length === 0
  )
    return (
      <p className="text-[11px] text-muted px-2.5">
        No habits yet — they'll appear after onboarding.
      </p>
    );

  return (
    <>
      <div className="flex flex-col gap-2.5 mx-2.5">
        {STANDARD_BEDS.map((bed) => {
          const bedHabits = habits.filter(
            (h) =>
              CATEGORY_GROUP[h.category] === bed.id && h.habitGroup !== "grow",
          );
          return renderBed(bed.label, bed.tagline, bedHabits, bed.id);
        })}

        {/* GROW bed — always visible */}
        {renderBed(
          "Grow",
          "plant your own",
          growHabits,
          "grow",
          // Header action: small "+ seed" when there are already habits
          growHabits.length > 0 ? (
            <button
              onClick={() => setPlantOpen(true)}
              className="font-mono text-[8px] uppercase tracking-[2px] text-bark/40 hover:text-bark/70 transition-colors"
            >
              + seed
            </button>
          ) : undefined,
        )}

        {/* Empty GROW invite */}
        {growHabits.length === 0 && (
          <div className="mx-0 -mt-2">
            {/* re-render just the empty state inside the existing card */}
          </div>
        )}
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

              {/* Icon picker */}
              <div className="flex gap-2 flex-wrap mb-4">
                {GROW_ICONS.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setNewIcon(icon)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all ${
                      newIcon === icon
                        ? "bg-bark/10 ring-2 ring-bark/30"
                        : "bg-bark/[0.04] hover:bg-bark/8"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>

              {/* Name input */}
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

      {/* Floating "plant a seed" pill when GROW is empty */}
      {growHabits.length === 0 && (
        <div className="mx-2.5 -mt-1">
          <button
            onClick={() => setPlantOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-bark/20 rounded-card text-bark/40 hover:border-bark/40 hover:text-bark/60 transition-colors"
          >
            <span className="text-base">🌱</span>
            <span className="font-mono text-[9px] uppercase tracking-[2px]">
              plant a seed
            </span>
          </button>
        </div>
      )}
    </>
  );
}
