"use client";

import { useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import type { Spiral } from "@/types";
import { SPIRAL_LABELS, SPIRAL_DESCRIPTIONS } from "@/types";
import SpiralChip from "./SpiralChip";

const SPIRAL_OPTIONS: Spiral[] = [
  "actually_okay",
  "the_replay",
  "the_clock",
  "i_dont_know",
  "the_what_if",
  "the_mirror",
  "the_but_he",
];

const NAV_OPTIONS = [
  {
    icon: "🏡",
    label: "Tend my garden",
    sub: "Water your flowers",
    action: "garden" as const,
  },
  {
    icon: "✏️",
    label: "Write in my journal",
    sub: "Get it out of your head",
    action: "journal" as const,
  },
  {
    icon: "🌸",
    label: "Find some inspiration",
    sub: "Something to hold onto",
    action: "inspire" as const,
  },
  {
    icon: "🌿",
    label: "Ground myself",
    sub: "Breathing, or just a moment",
    action: "ground" as const,
  },
  {
    icon: "○",
    label: "Just look around",
    sub: "No agenda today",
    action: "skip" as const,
  },
];

interface DailyCheckInProps {
  onNavigate: (path: string) => void;
  onGround: () => void;
  onClose: () => void;
}

export default function DailyCheckIn({
  onNavigate,
  onGround,
  onClose,
}: DailyCheckInProps) {
  const [step, setStep] = useState<"spiral" | "intent">("spiral");
  const [hovered, setHovered] = useState<Spiral | null>(null);
  const [selected, setSelected] = useState<Spiral | null>(null);

  async function handleSpiralSelect(spiral: Spiral) {
    setSelected(spiral);
    setStep("intent");
    await saveCheckIn(spiral);
  }

  async function saveCheckIn(spiral: Spiral) {
    initParse();
    const user = Parse.User.current();
    if (!user) return;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const CheckIn = Parse.Object.extend("CheckIn");
      const query = new Parse.Query(CheckIn);
      query.equalTo("user", user);
      query.greaterThanOrEqualTo("date", today);
      query.lessThan("date", tomorrow);
      const existing = await query.first();
      if (existing) {
        existing.set("spiral", spiral);
        await existing.save();
      } else {
        const checkIn = new CheckIn();
        checkIn.set("user", user);
        checkIn.set("date", new Date());
        checkIn.set("spiral", spiral);
        checkIn.setACL(new Parse.ACL(user));
        await checkIn.save();
      }
    } catch {
      /* best-effort */
    }
  }

  function handleNavOption(action: (typeof NAV_OPTIONS)[number]["action"]) {
    if (action === "ground") {
      onClose();
      onGround();
    } else if (action === "skip") {
      onClose();
    } else {
      onNavigate(`/${action}`);
      onClose();
    }
  }

  const previewSpiral = hovered ?? selected;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-app bg-cream rounded-t-2xl px-5 pt-6 pb-10 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-8 h-0.5 rounded-full bg-bark/15 mx-auto mb-5" />

        {/* Step indicators */}
        <div className="flex justify-center gap-1.5 mb-5">
          <div
            className={`h-1 rounded-full transition-all duration-300 ${step === "spiral" ? "w-4 bg-bark/60" : "w-1.5 bg-bark/30"}`}
          />
          <div
            className={`h-1 rounded-full transition-all duration-300 ${step === "intent" ? "w-4 bg-bark/60" : "w-1.5 bg-bark/20"}`}
          />
        </div>

        {step === "spiral" && (
          <>
            <p className="font-mono text-[8px] uppercase tracking-[3px] text-soil opacity-50 mb-1">
              Morning check-in
            </p>
            <p className="font-display font-light italic text-[22px] text-bark tracking-tight mb-4">
              How are you today?
            </p>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {SPIRAL_OPTIONS.map((spiral) => (
                <SpiralChip
                  key={spiral}
                  spiral={spiral}
                  selected={selected === spiral}
                  onSelect={handleSpiralSelect}
                  onHover={setHovered}
                />
              ))}
            </div>

            <div className="min-h-[28px]">
              {previewSpiral && (
                <p className="font-mono text-[9px] text-soil opacity-60 leading-relaxed">
                  {SPIRAL_DESCRIPTIONS[previewSpiral]}
                </p>
              )}
            </div>
          </>
        )}

        {step === "intent" && (
          <>
            <p className="font-mono text-[8px] uppercase tracking-[3px] text-soil opacity-50 mb-1">
              Good morning
            </p>
            <p className="font-display font-light italic text-[22px] text-bark tracking-tight mb-5">
              What do you need today?
            </p>

            <div className="flex flex-col gap-2">
              {NAV_OPTIONS.map((opt) => (
                <button
                  key={opt.action}
                  onClick={() => handleNavOption(opt.action)}
                  className="w-full text-left flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-bark/[0.04] border border-bark/8 active:scale-[0.99] transition-transform"
                >
                  <span className="text-xl w-7 text-center flex-shrink-0">
                    {opt.icon}
                  </span>
                  <div>
                    <p className="text-[13px] text-bark font-normal leading-tight mb-0.5">
                      {opt.label}
                    </p>
                    <p className="text-[11px] text-bark/40 font-light leading-snug">
                      {opt.sub}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
