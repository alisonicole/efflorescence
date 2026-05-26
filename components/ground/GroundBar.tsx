"use client";

import { useState } from "react";
import GroundModal from "./GroundModal";

interface GroundBarProps {
  onTendGarden: () => void;
}

export default function GroundBar({ onTendGarden }: GroundBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mx-2.5 bg-white rounded-card px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-clay flex-shrink-0" />
          <div>
            <p className="text-[11px] font-medium text-bark">
              Come here first.
            </p>
            <p className="font-mono text-[9px] text-soil opacity-60">
              Just ten minutes.
            </p>
          </div>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="text-[11px] text-clay border border-clay/40 rounded-pill px-3 py-1 hover:bg-clay/5"
        >
          ground
        </button>
      </div>

      {open && (
        <GroundModal
          onClose={() => setOpen(false)}
          onTendGarden={onTendGarden}
        />
      )}
    </>
  );
}
