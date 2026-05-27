"use client";

import { useEffect, useState } from "react";
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

interface CheckInCardProps {
  onSpiralSelect: (spiral: Spiral) => void;
  initialSpiral?: Spiral;
}

export default function CheckInCard({
  onSpiralSelect,
  initialSpiral,
}: CheckInCardProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Spiral | undefined>(initialSpiral);
  const [hovered, setHovered] = useState<Spiral | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelected(initialSpiral);
  }, [initialSpiral]);

  function handleSelect(spiral: Spiral) {
    if (saving) return;
    setSelected(spiral);
    onSpiralSelect(spiral);
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
      // best-effort save; navigation already happened
    } finally {
      setSaving(false);
    }
  }

  const previewSpiral = hovered ?? selected;

  return (
    <div className="mx-2.5 bg-white rounded-card p-3.5 shadow-sm">
      <p className="font-mono text-[9px] uppercase tracking-[3px] text-soil opacity-60 mb-1">
        Morning check-in
      </p>
      <p className="font-display text-base italic font-light text-bark mb-3">
        "How are you today?"
      </p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {SPIRAL_OPTIONS.map((spiral) => (
          <SpiralChip
            key={spiral}
            spiral={spiral}
            selected={selected === spiral}
            onSelect={handleSelect}
            onHover={setHovered}
          />
        ))}
      </div>

      {/* Description preview */}
      <div className="min-h-[28px]">
        {previewSpiral && (
          <p className="font-mono text-[9px] text-soil opacity-70 leading-relaxed transition-opacity duration-150">
            {SPIRAL_DESCRIPTIONS[previewSpiral]}
          </p>
        )}
      </div>
    </div>
  );
}
