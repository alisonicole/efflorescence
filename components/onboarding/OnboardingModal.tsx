"use client";

import { useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import { DEFAULT_HABITS } from "@/types";

interface OnboardingModalProps {
  onComplete: () => void;
}

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [saving, setSaving] = useState(false);

  async function handlePlant() {
    setSaving(true);
    initParse();
    const user = Parse.User.current();
    if (!user) {
      setSaving(false);
      return;
    }

    try {
      user.set("healingStartDate", new Date(`${startDate}T00:00:00`));
      await user.save();

      const ParseHabit = Parse.Object.extend("Habit");
      const saves = DEFAULT_HABITS.map((h) => {
        const habit = new ParseHabit();
        habit.set("user", user);
        habit.set("name", h.name);
        habit.set("category", h.category);
        habit.set("icon", h.icon);
        habit.set("isActive", true);
        habit.setACL(new Parse.ACL(user));
        return habit.save();
      });
      await Promise.all(saves);
      onComplete();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-6">
      <div className="w-full max-w-app bg-cream rounded-card p-8 text-center">
        <div className="text-4xl mb-4">🌱</div>
        <h2 className="font-serif text-xl text-bark mb-2">
          When did this healing begin?
        </h2>
        <p className="text-xs text-muted mb-6">
          We'll track how far you've come from here.
        </p>

        <input
          type="date"
          value={startDate}
          max={today}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full border border-border rounded-card px-4 py-3 text-sm text-bark bg-white mb-6 text-center"
        />

        <button
          onClick={handlePlant}
          disabled={saving}
          className="w-full bg-bark text-cream rounded-card py-3 text-sm font-medium disabled:opacity-50"
        >
          {saving ? "Planting..." : "Plant my garden"}
        </button>
      </div>
    </div>
  );
}
