"use client";

import { useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import type { Habit } from "@/types";

interface HabitCardProps {
  habit: Habit;
  streak: number;
  completedToday: boolean;
  onToggle: (habitId: string, completed: boolean) => void;
}

export default function HabitCard({
  habit,
  streak,
  completedToday,
  onToggle,
}: HabitCardProps) {
  const [saving, setSaving] = useState(false);

  async function handleTap() {
    if (saving) return;
    setSaving(true);
    initParse();
    const user = Parse.User.current();
    if (!user) {
      setSaving(false);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const HabitCompletion = Parse.Object.extend("HabitCompletion");

    try {
      if (completedToday) {
        const query = new Parse.Query(HabitCompletion);
        query.equalTo("user", user);
        query.equalTo("habitId", habit.objectId);
        query.greaterThanOrEqualTo("completedDate", today);
        query.lessThan("completedDate", tomorrow);
        const existing = await query.first();
        if (existing) await existing.destroy();
        onToggle(habit.objectId, false);
      } else {
        const completion = new HabitCompletion();
        completion.set("user", user);
        completion.set("habitId", habit.objectId);
        completion.set("completedDate", new Date());
        completion.setACL(new Parse.ACL(user));
        await completion.save();
        onToggle(habit.objectId, true);
      }
    } finally {
      setSaving(false);
    }
  }

  const streakLabel =
    habit.category === "no_contact" ? `${streak} days` : `${streak} day streak`;

  return (
    <button
      onClick={handleTap}
      disabled={saving}
      className={`bg-white rounded-card p-2.5 text-left relative border-t-2 transition-colors ${
        completedToday ? "border-moss" : "border-border"
      }`}
    >
      <div
        className={`absolute top-2 right-2 w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
          completedToday ? "bg-moss border-moss text-white" : "border-border"
        }`}
      >
        {completedToday && "✓"}
      </div>
      <div className="text-xl mb-1">{habit.icon}</div>
      <div className="text-[11px] font-medium text-bark pr-6">{habit.name}</div>
      <div className="text-[10px] text-muted">{streakLabel}</div>
    </button>
  );
}
