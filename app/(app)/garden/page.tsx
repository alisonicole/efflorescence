"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import GardenTour from "@/components/garden/GardenTour";
import HabitGrid from "@/components/habits/HabitGrid";
import OnboardingModal from "@/components/onboarding/OnboardingModal";
import BlossomGrove from "@/components/garden/BlossomGrove";

const TOUR_KEY = "gardenTourSeen";

export default function GardenPage() {
  const searchParams = useSearchParams();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [todaySpiral, setTodaySpiral] = useState<Spiral | undefined>(undefined);
  const [dayCount, setDayCount] = useState(0);
  const [season, setSeason] = useState<Season>("late_autumn");
  const [gardenState, setGardenState] = useState<GardenState>("tending");

  const habitsRef = useRef<HTMLDivElement>(null);

  // Show tour on first visit or when explicitly requested via ?tour=1.
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
      // Silent fail — garden shows default state.
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
      <TopBar title="efflorescence" subtitle={`Day ${dayCount} of healing`} />
      <div className="space-y-2.5 pb-4">
        <GardenHero
          season={season}
          gardenState={gardenState}
          dayCount={dayCount}
          todaySpiral={todaySpiral}
        />
        <div ref={habitsRef}>
          <p className="text-[10px] uppercase tracking-widest text-muted px-2.5 mb-2">
            Tending today
          </p>
          <HabitGrid />
        </div>
        <div className="px-2.5">
          <BlossomGrove />
        </div>
      </div>
    </>
  );
}
