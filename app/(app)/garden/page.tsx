"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import {
  computeDayCount,
  computeSeason,
  computeGardenState,
} from "@/lib/garden";
import type { Spiral, GardenState, Season } from "@/types";

import TopBar from "@/components/layout/TopBar";
import GardenHero from "@/components/garden/GardenHero";
import CheckInCard from "@/components/check-in/CheckInCard";
import HabitGrid from "@/components/habits/HabitGrid";
import CrisisBar from "@/components/crisis/CrisisBar";
import OnboardingModal from "@/components/onboarding/OnboardingModal";

export default function GardenPage() {
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [todaySpiral, setTodaySpiral] = useState<Spiral | undefined>(undefined);
  const [dayCount, setDayCount] = useState(0);
  const [season, setSeason] = useState<Season>("late_autumn");
  const [gardenState, setGardenState] = useState<GardenState>("tending");

  const habitsRef = useRef<HTMLDivElement>(null);

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

      const healingStartDate = new Date(healingStartDateRaw);
      const count = computeDayCount(healingStartDate);
      setDayCount(count);
      setSeason(computeSeason(count));

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const checkInQuery = new Parse.Query("CheckIn");
      checkInQuery.equalTo("user", user);
      checkInQuery.greaterThanOrEqualTo("date", today);
      checkInQuery.lessThan("date", tomorrow);
      checkInQuery.limit(1);
      const checkIn = await checkInQuery.first();
      if (checkIn) setTodaySpiral(checkIn.get("spiral") as Spiral);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const habitCompletionQuery = new Parse.Query("HabitCompletion");
      habitCompletionQuery.equalTo("user", user);
      habitCompletionQuery.greaterThanOrEqualTo("completedDate", sevenDaysAgo);
      const completions = await habitCompletionQuery.find();
      setGardenState(computeGardenState(completions.length));
    } catch {
      // Silent fail - garden shows default state
    }
  }, []);

  useEffect(() => {
    void loadGardenData();
  }, [loadGardenData]);

  function handleOnboardingComplete() {
    setNeedsOnboarding(false);
    void loadGardenData();
  }

  function scrollToHabits() {
    habitsRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      {needsOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}
      <TopBar title="efflorescence" subtitle={`Day ${dayCount} of healing`} />
      <div className="space-y-2.5 pb-4">
        <GardenHero
          season={season}
          gardenState={gardenState}
          dayCount={dayCount}
          todaySpiral={todaySpiral}
        />
        <CheckInCard
          onSpiralSelect={setTodaySpiral}
          initialSpiral={todaySpiral}
        />
        <div ref={habitsRef}>
          <p className="text-[10px] uppercase tracking-widest text-muted px-2.5 mb-2">
            Tending today
          </p>
          <HabitGrid />
        </div>
        <CrisisBar onTendGarden={scrollToHabits} />
      </div>
    </>
  );
}
