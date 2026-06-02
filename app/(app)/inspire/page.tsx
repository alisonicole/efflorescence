"use client";

import { useCallback, useEffect, useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import { computeDayCount } from "@/lib/garden";
import TopBar from "@/components/layout/TopBar";
import InspireFeed from "@/components/inspire/InspireFeed";
import TheScience from "@/components/inspire/TheScience";
import type { Spiral } from "@/types";

type InspireTab = "for_you" | "the_science";

export default function InspirePage() {
  const [activeTab, setActiveTab] = useState<InspireTab>("for_you");
  const [todaySpiral, setTodaySpiral] = useState<Spiral | undefined>();
  const [dayCount, setDayCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    initParse();
    const user = Parse.User.current();
    if (!user) {
      setLoading(false);
      return;
    }

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
    } catch {
      // silent fail — feed will show empty state
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
      <div className="px-2.5 pt-2 pb-3">
        <div className="flex rounded-card overflow-hidden border border-border">
          {(
            [
              { id: "for_you", label: "For You" },
              { id: "the_science", label: "The Science" },
            ] as { id: InspireTab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-[8.5px] font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-bark text-cream"
                  : "bg-white text-bark"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "for_you" && (
        <div className="pt-0 pb-4 px-2.5">
          {loading ? (
            <p className="font-mono text-[9px] text-muted">Loading...</p>
          ) : (
            <InspireFeed spiral={todaySpiral} dayCount={dayCount} />
          )}
        </div>
      )}

      {activeTab === "the_science" && <TheScience />}
    </>
  );
}
