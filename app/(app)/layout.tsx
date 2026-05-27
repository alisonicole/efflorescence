"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import BottomNav from "@/components/layout/BottomNav";
import DailyCheckIn from "@/components/check-in/DailyCheckIn";
import GroundModal from "@/components/ground/GroundModal";

const DAILY_KEY = "dailyCheckIn";

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [dailyOpen, setDailyOpen] = useState(false);
  const [groundOpen, setGroundOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/signin");
  }, [user, loading, router]);

  // Show the daily check-in once per calendar day.
  useEffect(() => {
    if (loading || !user) return;
    const last = localStorage.getItem(DAILY_KEY);
    if (last !== todayStamp()) setDailyOpen(true);
  }, [loading, user]);

  function handleDailyClose() {
    localStorage.setItem(DAILY_KEY, todayStamp());
    setDailyOpen(false);
  }

  if (loading || !user) return null;

  return (
    <div className="app-shell pb-16">
      {children}
      <BottomNav onGround={() => setGroundOpen(true)} />

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
        />
      )}
    </div>
  );
}
