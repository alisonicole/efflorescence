"use client";

import { useState } from "react";
import CrisisModal from "./CrisisModal";

interface CrisisBarProps {
  onTendGarden: () => void;
}

export default function CrisisBar({ onTendGarden }: CrisisBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mx-2.5 bg-white rounded-card px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-clay flex-shrink-0" />
          <div>
            <p className="text-[11px] font-medium text-bark">
              Need a soft redirect?
            </p>
            <p className="text-[10px] text-muted">Come here first.</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="text-[11px] text-clay border border-clay/40 rounded-pill px-3 py-1 hover:bg-clay/5"
        >
          crisis mode
        </button>
      </div>

      {open && (
        <CrisisModal
          onClose={() => setOpen(false)}
          onTendGarden={onTendGarden}
        />
      )}
    </>
  );
}
