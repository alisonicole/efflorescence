"use client";

import { useEffect, useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import type { Spiral } from "@/types";
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

interface CheckInCardProps {
  onSpiralSelect: (spiral: Spiral) => void;
  initialSpiral?: Spiral;
}

export default function CheckInCard({
  onSpiralSelect,
  initialSpiral,
}: CheckInCardProps) {
  const [selected, setSelected] = useState<Spiral | undefined>(initialSpiral);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelected(initialSpiral);
  }, [initialSpiral]);

  async function handleSelect(spiral: Spiral) {
    if (saving) return;
    const prev = selected;
    setSaving(true);
    setSelected(spiral);
    onSpiralSelect(spiral);

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
      setSelected(prev);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-2.5 bg-white rounded-card p-3.5 shadow-sm">
      <p className="font-mono text-[9px] uppercase tracking-[3px] text-soil opacity-60 mb-1">
        Morning check-in
      </p>
      <p className="font-display text-base italic font-light text-bark mb-3">
        "How are you today?"
      </p>
      <div className="flex flex-wrap gap-1.5">
        {SPIRAL_OPTIONS.map((spiral) => (
          <SpiralChip
            key={spiral}
            spiral={spiral}
            selected={selected === spiral}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}
