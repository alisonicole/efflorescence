"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import type { Spiral } from "@/types";
import { SPIRAL_LABELS, SPIRAL_DESCRIPTIONS } from "@/types";

const SPIRAL_OPTIONS: Spiral[] = [
  "actually_okay",
  "the_replay",
  "the_clock",
  "i_dont_know",
  "the_what_if",
  "the_mirror",
  "the_should_be",
];

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpiralSelect: (spiral: Spiral) => void;
  initialSpiral?: Spiral;
}

export default function CheckInModal({
  isOpen,
  onClose,
  onSpiralSelect,
  initialSpiral,
}: CheckInModalProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  function handleSelect(spiral: Spiral) {
    if (saving) return;
    onSpiralSelect(spiral);
    onClose();
    router.push("/journal");
    void saveCheckIn(spiral);
  }

  async function saveCheckIn(spiral: Spiral) {
    setSaving(true);
    initParse();
    const user = Parse.User.current();
    if (!user) {
      setSaving(false);
      return;
    }
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
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-app bg-cream rounded-t-2xl px-5 pt-6 pb-10 animate-slide-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-8 h-0.5 rounded-full bg-bark/15 mx-auto mb-5" />
        <p className="font-mono text-[8px] uppercase tracking-[3px] text-soil opacity-50 mb-1">
          Check in
        </p>
        <p className="font-display font-light italic text-[22px] text-bark tracking-tight mb-5">
          How are you today?
        </p>

        <div className="flex flex-col gap-2">
          {SPIRAL_OPTIONS.map((spiral) => (
            <button
              key={spiral}
              onClick={() => handleSelect(spiral)}
              disabled={saving}
              className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all active:scale-[0.99] ${
                initialSpiral === spiral
                  ? "bg-bark text-cream border-bark"
                  : "bg-white border-border hover:border-clay/40"
              }`}
            >
              <p
                className={`font-display italic text-[15px] leading-snug mb-0.5 ${
                  initialSpiral === spiral ? "text-cream" : "text-bark"
                }`}
              >
                {SPIRAL_LABELS[spiral]}
              </p>
              <p
                className={`font-mono text-[9px] leading-relaxed ${
                  initialSpiral === spiral ? "text-cream/70" : "text-bark/50"
                }`}
              >
                {SPIRAL_DESCRIPTIONS[spiral]}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
