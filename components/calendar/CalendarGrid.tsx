"use client";

import { useState } from "react";
import { dateKey, computeHeatLevel, monthDays } from "@/lib/calendar";
import DayDetailCard from "./DayDetailCard";
import type { Spiral, HabitCompletion, CheckIn, Habit } from "@/types";
import type { HeatLevel } from "@/lib/calendar";

const HEAT_CLASSES: Record<HeatLevel, string> = {
  0: "bg-stone-100",
  1: "bg-green-100",
  2: "bg-green-300",
  3: "bg-green-600",
};

const SPIRAL_DOT_COLORS: Record<Spiral, string> = {
  the_clock: "bg-amber-400",
  the_replay: "bg-orange-400",
  the_mirror: "bg-purple-300",
  the_what_if: "bg-blue-300",
  the_but_he: "bg-rose-300",
  actually_okay: "bg-green-400",
  i_dont_know: "bg-gray-300",
};

interface CalendarGridProps {
  year: number;
  month: number;
  completionsByDate: Record<string, number>;
  spiralsByDate: Record<string, Spiral>;
  completions: HabitCompletion[];
  checkIns: CheckIn[];
  habits: Habit[];
  totalHabits: number;
}

export default function CalendarGrid({
  year,
  month,
  completionsByDate,
  spiralsByDate,
  completions,
  checkIns,
  habits,
  totalHabits,
}: CalendarGridProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const days = monthDays(year, month);
  const firstDow = days[0].getDay();

  const selectedCheckIn = selected
    ? checkIns.find((c) => dateKey(new Date(c.date)) === selected)
    : undefined;
  const selectedCompletions = selected
    ? completions.filter((c) => dateKey(new Date(c.completedDate)) === selected)
    : [];

  return (
    <>
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} className="text-[8px] text-muted uppercase">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDow }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const key = dateKey(day);
          const heat = computeHeatLevel(
            completionsByDate[key] ?? 0,
            totalHabits,
          );
          const spiral = spiralsByDate[key];
          return (
            <button
              key={key}
              onClick={() => setSelected(key)}
              className={`relative aspect-square rounded flex items-center justify-center text-[9px] text-bark ${HEAT_CLASSES[heat]}`}
            >
              {day.getDate()}
              {spiral && (
                <span
                  className={`absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full ${SPIRAL_DOT_COLORS[spiral]}`}
                />
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <DayDetailCard
          date={new Date(selected)}
          completions={selectedCompletions}
          checkIn={selectedCheckIn}
          habits={habits}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
