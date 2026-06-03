"use client";

import { useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import type { HabitCategory } from "@/types";

interface StarterPack {
  id: string;
  name: string;
  tagline: string;
  habits: { category: HabitCategory; name: string; icon: string }[];
}

const STARTER_PACKS: StarterPack[] = [
  {
    id: "recommended",
    name: "Recommended",
    tagline: "A gentle start",
    habits: [
      { category: "journal", name: "journal", icon: "🪷" },
      { category: "move_body", name: "move", icon: "🌻" },
      { category: "sleep", name: "sleep", icon: "🌙" },
      { category: "eat_water", name: "drink water", icon: "🍵" },
      { category: "fresh_air", name: "fresh air", icon: "🌸" },
      { category: "get_dressed", name: "get ready", icon: "🌱" },
      { category: "talk", name: "talk to someone", icon: "🌺" },
      { category: "just_for_you", name: "something for you", icon: "💮" },
    ],
  },
  {
    id: "letting_go",
    name: "Letting Go",
    tagline: "After a relationship",
    habits: [
      { category: "no_contact", name: "no contact", icon: "🌿" },
      { category: "no_stalking", name: "didn't look", icon: "🌼" },
      { category: "no_old_photos", name: "let the past be", icon: "🪻" },
    ],
  },
  {
    id: "anxiety",
    name: "Quieting Anxiety",
    tagline: "For the racing mind",
    habits: [
      { category: "fresh_air", name: "fresh air", icon: "🌸" },
      { category: "move_body", name: "move", icon: "🌻" },
      { category: "sleep", name: "sleep", icon: "🌙" },
      { category: "eat_water", name: "drink water", icon: "🍵" },
      { category: "journal", name: "journal", icon: "🪷" },
      { category: "talk", name: "talk to someone", icon: "🌺" },
    ],
  },
  {
    id: "depression",
    name: "Coming Back",
    tagline: "For heavy days",
    habits: [
      { category: "get_dressed", name: "get dressed", icon: "🌱" },
      { category: "fresh_air", name: "fresh air", icon: "🌸" },
      { category: "move_body", name: "move", icon: "🌻" },
      { category: "talk", name: "talk to someone", icon: "🌺" },
      { category: "just_for_you", name: "something for you", icon: "💮" },
      { category: "journal", name: "journal", icon: "🪷" },
    ],
  },
];

interface OnboardingModalProps {
  onComplete: () => void;
}

type Step = 1 | 2 | 3;

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const today = new Date().toISOString().split("T")[0];
  const [step, setStep] = useState<Step>(1);
  const [startDate, setStartDate] = useState(today);
  const [selectedPack, setSelectedPack] = useState<string>("recommended");
  const [receiptsText, setReceiptsText] = useState("");
  const [saving, setSaving] = useState(false);

  const progressPct = step === 1 ? 33 : step === 2 ? 66 : 100;

  async function handleStep1() {
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
      setStep(2);
    } finally {
      setSaving(false);
    }
  }

  async function handleStep2() {
    setSaving(true);
    initParse();
    const user = Parse.User.current();
    if (!user) {
      setSaving(false);
      return;
    }
    try {
      const pack = STARTER_PACKS.find((p) => p.id === selectedPack);
      if (pack) {
        const ParseHabit = Parse.Object.extend("Habit");
        const habits = pack.habits.map((h) => {
          const habit = new ParseHabit();
          habit.set("user", user);
          habit.set("name", h.name);
          habit.set("category", h.category);
          habit.set("icon", h.icon);
          habit.set("isActive", true);
          habit.setACL(new Parse.ACL(user));
          return habit;
        });
        await Parse.Object.saveAll(habits);
        user.set("habitsSeeded", true);
        await user.save();
      }
      setStep(3);
    } finally {
      setSaving(false);
    }
  }

  async function handleComplete() {
    setSaving(true);
    initParse();
    const user = Parse.User.current();
    if (user && receiptsText.trim()) {
      try {
        const ParseEntry = Parse.Object.extend("JournalEntry");
        const entry = new ParseEntry();
        entry.set("user", user);
        entry.set("content", receiptsText.trim());
        entry.set("prompt", "What brought you here. In your own words.");
        entry.set("entryType", "receipts");
        entry.setACL(new Parse.ACL(user));
        await entry.save();
      } catch {
        /* best-effort */
      }
    }
    setSaving(false);
    onComplete();
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-5">
      <div className="w-full max-w-app bg-cream rounded-2xl overflow-hidden shadow-xl">
        {/* Progress bar */}
        <div className="h-1 bg-border">
          <div
            className="h-full bg-bark rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="p-7">
          {/* Step counter */}
          <p className="font-mono text-[7px] uppercase tracking-[2.5px] text-muted mb-6 text-center">
            Step {step} of 3
          </p>

          {/* ── Step 1: Healing start date ── */}
          {step === 1 && (
            <div className="text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h2 className="font-display italic text-[22px] text-bark mb-2">
                You made it here.
              </h2>
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted mb-6 leading-relaxed">
                That&apos;s enough.
              </p>
              <p className="font-mono text-[8px] uppercase tracking-[2px] text-muted mb-2 text-left">
                When did this chapter begin?
              </p>
              <input
                type="date"
                value={startDate}
                max={today}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-border rounded-xl px-4 py-3 text-sm text-bark bg-white mb-6 text-center focus:outline-none focus:border-clay/40"
              />
              <button
                onClick={() => void handleStep1()}
                disabled={saving}
                className="w-full bg-bark text-cream rounded-xl py-3 text-sm font-medium disabled:opacity-50 transition-opacity"
              >
                {saving ? "Planting..." : "Plant my first seed →"}
              </button>
            </div>
          )}

          {/* ── Step 2: Starter pack ── */}
          {step === 2 && (
            <div>
              <h2 className="font-display italic text-[22px] text-bark mb-1">
                Choose your garden.
              </h2>
              <p className="font-mono text-[8px] uppercase tracking-[2px] text-muted mb-4">
                You can always add or remove habits later
              </p>

              <div className="space-y-2.5 max-h-[52vh] overflow-y-auto pr-0.5 mb-4">
                {STARTER_PACKS.map((pack) => (
                  <button
                    key={pack.id}
                    onClick={() => setSelectedPack(pack.id)}
                    className={`w-full text-left rounded-xl border p-4 transition-all ${
                      selectedPack === pack.id
                        ? "bg-bark/[0.05] border-bark"
                        : "bg-white border-border hover:border-clay/30"
                    }`}
                  >
                    <div className="flex items-baseline gap-2 mb-2">
                      <p className="font-display italic text-[15px] text-bark">
                        {pack.name}
                      </p>
                      <p className="font-mono text-[7px] uppercase tracking-widest text-muted">
                        {pack.tagline}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {pack.habits.map((h) => (
                        <span
                          key={h.category}
                          className="text-[11px] bg-cream border border-border rounded-full px-2.5 py-0.5 text-bark/70"
                        >
                          {h.icon} {h.name}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => void handleStep2()}
                disabled={saving}
                className="w-full bg-bark text-cream rounded-xl py-3 text-sm font-medium disabled:opacity-50 mb-2 transition-opacity"
              >
                {saving ? "Planting..." : "Grow this garden →"}
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-full text-[10px] text-muted py-1.5"
              >
                Start with none, I&apos;ll add my own
              </button>
            </div>
          )}

          {/* ── Step 3: What happened ── */}
          {step === 3 && (
            <div>
              <p className="font-mono text-[8px] uppercase tracking-widest text-muted mb-1">
                Just for you
              </p>
              <h2 className="font-display italic text-[22px] text-bark mb-1">
                Before we begin...
              </h2>
              <p className="font-mono text-[9px] text-muted leading-relaxed mb-4">
                What brought you here? No one will see this.
              </p>
              <textarea
                value={receiptsText}
                onChange={(e) => setReceiptsText(e.target.value)}
                placeholder="Write whatever feels true right now."
                rows={5}
                className="w-full border border-border rounded-xl px-4 py-3 text-sm text-bark bg-white mb-3 resize-none leading-relaxed focus:outline-none focus:border-clay/40"
              />
              <button
                onClick={() => void handleComplete()}
                disabled={saving}
                className="w-full bg-bark text-cream rounded-xl py-3 text-sm font-medium disabled:opacity-50 mb-2 transition-opacity"
              >
                {saving ? "Sealing..." : "Seal it & begin"}
              </button>
              <button
                onClick={() => {
                  if (!saving) onComplete();
                }}
                className="w-full text-[10px] text-muted py-1.5"
              >
                Skip for now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
