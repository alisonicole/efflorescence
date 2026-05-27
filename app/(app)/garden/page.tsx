"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import { computeDayCount } from "@/lib/garden";
import type { Spiral } from "@/types";

import TopBar from "@/components/layout/TopBar";
import GardenTour from "@/components/garden/GardenTour";
import HabitGrid from "@/components/habits/HabitGrid";
import OnboardingModal from "@/components/onboarding/OnboardingModal";
import BlossomGrove from "@/components/garden/BlossomGrove";

const TOUR_KEY = "gardenTourSeen";

export default function GardenPage() {
  const searchParams = useSearchParams();
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [dayCount, setDayCount] = useState(0);

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
      <TopBar title="efflorescence" subtitle={`Day ${dayCount} of healing`} />
      <div className="space-y-2.5 pb-4">
        <div className="px-0">
          <p className="text-[10px] uppercase tracking-widest text-muted px-2.5 mb-2 pt-2">
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
