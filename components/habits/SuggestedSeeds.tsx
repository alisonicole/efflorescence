"use client";

import { useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";

const SEEDS = [
  { label: "sleep", category: "sleep", icon: "🌙" },
  { label: "fresh air", category: "fresh_air", icon: "🌸" },
  { label: "get ready", category: "get_dressed", icon: "🌱" },
  { label: "talk to someone", category: "talk", icon: "🌺" },
  { label: "something for you", category: "just_for_you", icon: "💮" },
] as const;

interface SuggestedSeedsProps {
  onAdded: () => void;
}

export default function SuggestedSeeds({ onAdded }: SuggestedSeedsProps) {
  const [adding, setAdding] = useState<string | null>(null);

  async function addSeed(category: string, label: string, icon: string) {
    if (adding) return;
    setAdding(category);
    initParse();
    const user = Parse.User.current();
    if (!user) {
      setAdding(null);
      return;
    }
    try {
      const ParseHabit = Parse.Object.extend("Habit");
      const habit = new ParseHabit();
      habit.set("user", user);
      habit.set("name", label);
      habit.set("category", category);
      habit.set("icon", icon);
      habit.set("isActive", true);
      habit.setACL(new Parse.ACL(user));
      await habit.save();
      onAdded();
    } catch {
      // silent
    } finally {
      setAdding(null);
    }
  }

  return (
    <div className="mx-2.5 mt-1">
      <p className="font-mono text-[8px] uppercase tracking-[2px] text-muted mb-2">
        Suggested seeds
      </p>
      <div className="flex flex-wrap gap-2">
        {SEEDS.map((seed) => (
          <button
            key={seed.category}
            onClick={() => void addSeed(seed.category, seed.label, seed.icon)}
            disabled={adding === seed.category}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-border text-bark text-xs font-mono tracking-wide disabled:opacity-40 active:scale-95 transition-transform shadow-sm"
          >
            <span>{seed.icon}</span>
            <span>{seed.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
