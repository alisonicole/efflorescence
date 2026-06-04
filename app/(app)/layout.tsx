"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GroundContext } from "@/context/GroundContext";
import BottomNav from "@/components/layout/BottomNav";
import DailyCheckIn from "@/components/check-in/DailyCheckIn";
import GroundModal from "@/components/ground/GroundModal";
import OnboardingTour, {
  TOUR_KEY,
} from "@/components/onboarding/OnboardingTour";

const DAILY_KEY = "dailyCheckIn";

function todayStamp() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [dailyOpen, setDailyOpen] = useState(false);
  const [groundOpen, setGroundOpen] = useState(false);
  const [checkInFromGround, setCheckInFromGround] = useState(false);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/signin");
  }, [user, loading, router]);

  // Show the onboarding tour for all users who haven't seen this version.
  useEffect(() => {
    if (loading || !user) return;
    const seen = localStorage.getItem(TOUR_KEY);
    if (!seen) setShowTour(true);
  }, [loading, user]);

  // Show the daily check-in once per calendar day (after tour).
  useEffect(() => {
    if (loading || !user || showTour) return;
    const last = localStorage.getItem(DAILY_KEY);
    if (last !== todayStamp()) setDailyOpen(true);
  }, [loading, user, showTour]);

  function handleTourClose() {
    localStorage.setItem(TOUR_KEY, "1");
    setShowTour(false);
  }

  function handleDailyClose() {
    localStorage.setItem(DAILY_KEY, todayStamp());
    setDailyOpen(false);
  }

  if (loading || !user) return null;

  return (
    <GroundContext.Provider value={{ openGround: () => setGroundOpen(true) }}>
      <div className="app-shell pb-16">
        <div className="sticky top-0 z-30 bg-bark px-5 py-2.5 flex items-center justify-center border-b border-cream/15">
          <span className="font-display italic text-cream/70 text-[19px] tracking-tight">
            efflorescence
          </span>
        </div>
        {children}
        <BottomNav onGround={() => setGroundOpen(true)} />

        {showTour && <OnboardingTour onClose={handleTourClose} />}

        {dailyOpen && (
          <DailyCheckIn
            onNavigate={(path) => router.push(path)}
            onGround={() => setGroundOpen(true)}
            onClose={handleDailyClose}
          />
        )}

        {groundOpen && (
          <GroundModal
            onClose={() => setGroundOpen(false)}
            onTendGarden={() => router.push("/garden")}
            onCheckIn={() => {
              setGroundOpen(false);
              setCheckInFromGround(true);
            }}
          />
        )}

        {checkInFromGround && (
          <DailyCheckIn
            onNavigate={(path) => router.push(path)}
            onGround={() => {
              setCheckInFromGround(false);
              setGroundOpen(true);
            }}
            onClose={() => setCheckInFromGround(false)}
          />
        )}
      </div>
    </GroundContext.Provider>
  );
}
