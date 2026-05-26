"use client";

import { useCallback, useEffect, useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import { groupCompletionsByDate, groupCheckInsByDate } from "@/lib/calendar";
import TopBar from "@/components/layout/TopBar";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import type {
  HabitCompletion,
  CheckIn,
  Habit,
  HabitCategory,
  Spiral,
} from "@/types";

export default function CalendarPage() {
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    initParse();
    const user = Parse.User.current();
    if (!user) return;

    try {
      const [completionResults, checkInResults, habitResults] =
        await Promise.all([
          new Parse.Query("HabitCompletion")
            .equalTo("user", user)
            .limit(2000)
            .find(),
          new Parse.Query("CheckIn").equalTo("user", user).limit(2000).find(),
          new Parse.Query("Habit")
            .equalTo("user", user)
            .equalTo("isActive", true)
            .find(),
        ]);

      setCompletions(
        completionResults.map((r) => ({
          objectId: r.id,
          habitId: r.get("habitId") as string,
          completedDate: r.get("completedDate") as Date,
        })),
      );
      setCheckIns(
        checkInResults.map((r) => ({
          objectId: r.id,
          date: r.get("date") as Date,
          spiral: r.get("spiral") as Spiral,
          createdAt: r.createdAt!,
        })),
      );
      setHabits(
        habitResults.map((r) => ({
          objectId: r.id,
          name: r.get("name") as string,
          category: r.get("category") as HabitCategory,
          icon: r.get("icon") as string,
          isActive: true,
          createdAt: r.createdAt!,
        })),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    const now = new Date();
    if (viewYear === now.getFullYear() && viewMonth === now.getMonth()) return;
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const completionsByDate = groupCompletionsByDate(completions);
  const spiralsByDate = groupCheckInsByDate(checkIns);
  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <TopBar title="your journey" subtitle={monthLabel} />
      <div className="pt-2 pb-4 px-2.5">
        {loading ? (
          <p className="font-mono text-[9px] text-muted">Loading...</p>
        ) : (
          <>
            <div className="flex justify-between items-center mb-3">
              <button onClick={prevMonth} className="text-sm text-muted px-2">
                ‹
              </button>
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted">
                {monthLabel}
              </span>
              <button onClick={nextMonth} className="text-sm text-muted px-2">
                ›
              </button>
            </div>
            <CalendarGrid
              year={viewYear}
              month={viewMonth}
              completionsByDate={completionsByDate}
              spiralsByDate={spiralsByDate}
              completions={completions}
              checkIns={checkIns}
              habits={habits}
              totalHabits={habits.length}
            />
          </>
        )}
      </div>
    </>
  );
}
