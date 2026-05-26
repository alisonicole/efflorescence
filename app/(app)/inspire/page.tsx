"use client";

import { useCallback, useEffect, useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import { computeDayCount } from "@/lib/garden";
import TopBar from "@/components/layout/TopBar";
import InspireFeed from "@/components/inspire/InspireFeed";
import type { Spiral } from "@/types";

export default function InspirePage() {
  const [todaySpiral, setTodaySpiral] = useState<Spiral | undefined>();
  const [dayCount, setDayCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    initParse();
    const user = Parse.User.current();
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    try {
      const [checkInResult, userData] = await Promise.all([
        new Parse.Query("CheckIn")
          .equalTo("user", user)
          .greaterThanOrEqualTo("date", today)
          .lessThan("date", tomorrow)
          .first(),
        user.fetch(),
      ]);

      if (checkInResult) {
        setTodaySpiral(checkInResult.get("spiral") as Spiral);
      }

      const startDate = userData.get("healingStartDate") as Date | undefined;
      if (startDate) setDayCount(computeDayCount(new Date(startDate)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <TopBar title="inspire" subtitle="for where you are right now" />
      <div className="pt-2 pb-4 px-2.5">
        {loading ? (
          <p className="font-mono text-[9px] text-muted">Loading...</p>
        ) : (
          <InspireFeed spiral={todaySpiral} dayCount={dayCount} />
        )}
      </div>
    </>
  );
}
