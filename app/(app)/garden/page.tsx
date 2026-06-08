"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import { computeDayCount, computeStreak } from "@/lib/garden";
import type { Habit, HabitCategory } from "@/types";

import TopBar from "@/components/layout/TopBar";
import GardenTour from "@/components/garden/GardenTour";
import HabitGrid from "@/components/habits/HabitGrid";
import OnboardingModal from "@/components/onboarding/OnboardingModal";
import BlossomGrove from "@/components/garden/BlossomGrove";
import PushPermission from "@/components/notifications/PushPermission";

const TOUR_KEY = "gardenTourSeen";

// Colors used for pressed flower petals in the Codex
const SLOT_COLORS = [
  "#6B8F6E", // sage
  "#D4823A", // clay
  "#9B8DB5", // lavender
  "#D4B483", // wheat
  "#C97A8A", // rose
  "#5C6B8A", // slate
];

interface BloomedHabit extends Habit {
  streak: number;
}

function PressedFlowerSvg({
  color,
  size = 40,
}: {
  color: string;
  size?: number;
}) {
  const angles = [0, 72, 144, 216, 288];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "saturate(0.5) brightness(1.05)" }}
    >
      {angles.map((angle) => (
        <ellipse
          key={angle}
          cx="20"
          cy="11"
          rx="4"
          ry="8"
          fill={color}
          opacity="0.8"
          transform={`rotate(${angle} 20 20)`}
        />
      ))}
      <circle cx="20" cy="20" r="5" fill="#F5EFE4" />
      <circle cx="20" cy="20" r="3" fill={color} opacity="0.5" />
    </svg>
  );
}

function CodexCard({ habit, index }: { habit: BloomedHabit; index: number }) {
  const color = SLOT_COLORS[index % SLOT_COLORS.length];
  return (
    <div className="bg-white/60 border border-bark/8 rounded-2xl px-4 py-3 flex items-center gap-3">
      <PressedFlowerSvg color={color} />
      <div className="flex-1 min-w-0">
        <p className="font-display italic text-bark text-[14px] leading-tight truncate">
          {habit.name}
        </p>
      </div>
      <span className="font-mono text-[9px] text-bark/40 whitespace-nowrap">
        {habit.streak} days
      </span>
    </div>
  );
}

export default function GardenPage() {
  const searchParams = useSearchParams();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [dayCount, setDayCount] = useState(0);
  const [bloomedHabits, setBloomedHabits] = useState<BloomedHabit[]>([]);

  useEffect(() => {
    const forced = searchParams.get("tour") === "1";
    const seen =
      typeof window !== "undefined" && localStorage.getItem(TOUR_KEY);
    if (forced || !seen) setShowTour(true);
  }, [searchParams]);

  function handleTourClose() {
    localStorage.setItem(TOUR_KEY, "1");
    setShowTour(false);
  }

  const loadGardenData = useCallback(async () => {
    initParse();
    const user = Parse.User.current();
    if (!user) return;

    try {
      const healingStartDateRaw = user.get("healingStartDate");
      if (!healingStartDateRaw) {
        setNeedsOnboarding(true);
        return;
      }
      setDayCount(computeDayCount(new Date(healingStartDateRaw)));

      // Load habits and their streaks for the Codex
      const ParseHabit = Parse.Object.extend("Habit");
      const habitQuery = new Parse.Query(ParseHabit);
      habitQuery.equalTo("user", user);
      habitQuery.equalTo("isActive", true);
      const habitResults = await habitQuery.find();

      const habitList: Habit[] = habitResults.map((h) => ({
        objectId: h.id,
        name: h.get("name") as string,
        category: h.get("category") as HabitCategory,
        icon: h.get("icon") as string,
        isActive: h.get("isActive") as boolean,
        createdAt: h.createdAt!,
        habitGroup: h.get("habitGroup") as string | undefined,
        lastCelebrated: (h.get("lastCelebrated") as number | undefined) ?? 0,
      }));

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const HabitCompletion = Parse.Object.extend("HabitCompletion");
      const completionQuery = new Parse.Query(HabitCompletion);
      completionQuery.equalTo("user", user);
      completionQuery.greaterThanOrEqualTo("completedDate", thirtyDaysAgo);
      completionQuery.limit(1000);
      const completions = await completionQuery.find();

      const bloomed: BloomedHabit[] = [];
      for (const habit of habitList) {
        const dates = completions
          .filter((c) => c.get("habitId") === habit.objectId)
          .map((c) => c.get("completedDate") as Date);
        const streak = computeStreak(dates);
        if (streak >= 7) {
          bloomed.push({ ...habit, streak });
        }
      }

      // Sort by streak descending so longest streaks show first
      bloomed.sort((a, b) => b.streak - a.streak);
      setBloomedHabits(bloomed);
    } catch {
      // silent fail
    }
  }, []);

  useEffect(() => {
    void loadGardenData();
  }, [loadGardenData]);

  function handleOnboardingComplete() {
    setNeedsOnboarding(false);
    void loadGardenData();
  }

  return (
    <>
      {needsOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}
      {showTour && !needsOnboarding && <GardenTour onClose={handleTourClose} />}
      <TopBar title="Garden" subtitle={`Day ${dayCount} of healing`} />
      <div className="space-y-2.5 pb-4">
        <PushPermission />
        <div className="px-0">
          <p className="text-[10px] uppercase tracking-widest text-muted px-2.5 mb-2 pt-2">
            Habit Flowers
          </p>
          <HabitGrid />
        </div>
        <div className="px-2.5">
          <BlossomGrove />
        </div>

        {/* Codex */}
        <div className="px-4 pb-6 mt-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[8px] uppercase tracking-[3px] text-bark/40">
              Codex
            </span>
            <div className="flex-1 h-px bg-bark/8" />
            <span className="font-mono text-[8px] text-bark/25">
              {bloomedHabits.length} pressed
            </span>
          </div>

          {bloomedHabits.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-bark/12 p-5 text-center">
              <p className="font-display italic text-bark/35 text-[15px]">
                Your first bloom is coming.
              </p>
              <p className="font-mono text-[9px] text-bark/22 mt-1 tracking-wide">
                Seven days of any habit
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {bloomedHabits.map((habit, i) => (
                <CodexCard key={habit.objectId} habit={habit} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
