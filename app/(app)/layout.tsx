"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import BottomNav from "@/components/layout/BottomNav";
import CheckInModal from "@/components/check-in/CheckInModal";
import GroundModal from "@/components/ground/GroundModal";
import type { Spiral } from "@/types";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [groundOpen, setGroundOpen] = useState(false);
  const [todaySpiral, setTodaySpiral] = useState<Spiral | undefined>();

  useEffect(() => {
    if (!loading && !user) router.replace("/signin");
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div className="app-shell pb-16">
      {children}
      <BottomNav onGround={() => setGroundOpen(true)} />
      <CheckInModal
        isOpen={checkInOpen}
        onClose={() => setCheckInOpen(false)}
        onSpiralSelect={setTodaySpiral}
        initialSpiral={todaySpiral}
      />
      {groundOpen && (
        <GroundModal
          onClose={() => setGroundOpen(false)}
          onTendGarden={() => router.push("/habits")}
        />
      )}
    </div>
  );
}
