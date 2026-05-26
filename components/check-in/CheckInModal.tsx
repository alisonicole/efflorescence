"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import type { Spiral } from "@/types";
import { SPIRAL_DESCRIPTIONS } from "@/types";
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
  const [hovered, setHovered] = useState<Spiral | null>(null);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  function handleSelect(spiral: Spiral) {
    if (saving) return;
    onSpiralSelect(spiral);
    onClose();
    router.push(`/journal/new?spiral=${spiral}`);
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

  const previewSpiral = hovered ?? initialSpiral;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-app bg-cream rounded-t-2xl p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-mono text-[9px] uppercase tracking-[3px] text-soil opacity-60 mb-1">
          Morning check-in
        </p>
        <p className="font-display text-lg italic font-light text-bark mb-4">
          "How are you today?"
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {SPIRAL_OPTIONS.map((spiral) => (
            <SpiralChip
              key={spiral}
              spiral={spiral}
              selected={initialSpiral === spiral}
              onSelect={handleSelect}
              onHover={setHovered}
            />
          ))}
        </div>
        <div className="min-h-[28px]">
          {previewSpiral && (
            <p className="font-mono text-[9px] text-soil opacity-70 leading-relaxed">
              {SPIRAL_DESCRIPTIONS[previewSpiral]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
