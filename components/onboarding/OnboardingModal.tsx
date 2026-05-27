"use client";

import { useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import { seedDefaultHabits } from "@/lib/default-habits";

interface OnboardingModalProps {
  onComplete: () => void;
}

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const today = new Date().toISOString().split("T")[0];
  const [step, setStep] = useState<1 | 2>(1);
  const [startDate, setStartDate] = useState(today);
  const [receiptsText, setReceiptsText] = useState("");
  const [saving, setSaving] = useState(false);

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

      await seedDefaultHabits(user);
      setStep(2);
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
        entry.set("prompt", "Why it ended. In your words.");
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
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-6">
      <div className="w-full max-w-app bg-cream rounded-card p-8 text-center">
        {step === 1 && (
          <>
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
              onClick={handleStep1}
              disabled={saving}
              className="w-full bg-bark text-cream rounded-card py-3 text-sm font-medium disabled:opacity-50"
            >
              {saving ? "Planting..." : "Plant my garden"}
            </button>
          </>
        )}

        {step === 2 && (
          <div>
            <div className="text-2xl mb-4">🌱</div>
            <h2 className="font-display text-lg italic text-bark mb-2">
              Before we plant your first seed --
            </h2>
            <p className="text-xs text-muted mb-4 text-left">
              Would you like to write down what happened? You'll want this
              later. Can be skipped.
            </p>
            <textarea
              value={receiptsText}
              onChange={(e) => setReceiptsText(e.target.value)}
              placeholder="Write whatever feels true right now."
              rows={5}
              className="w-full border border-border rounded-card px-4 py-3 text-sm text-bark bg-white mb-3 resize-none leading-relaxed focus:outline-none focus:border-clay/40"
            />
            <button
              onClick={handleComplete}
              disabled={saving}
              className="w-full bg-bark text-cream rounded-card py-3 text-sm font-medium disabled:opacity-50 mb-2"
            >
              {saving ? "Planting..." : "Seal it & begin"}
            </button>
            <button
              onClick={() => {
                if (!saving) onComplete();
              }}
              className="w-full text-xs text-muted py-2"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
