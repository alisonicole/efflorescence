"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PlantASeedButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function navigate(path: string) {
    setOpen(false);
    router.push(path);
  }

  return (
    <>
      {/* Pill button — bottom-left of garden canvas */}
      <button
        onClick={() => setOpen(true)}
        className="absolute bottom-10 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream/90 backdrop-blur-sm border border-bark/10 transition-opacity hover:opacity-80 active:scale-95"
      >
        <span className="font-mono text-[9px] uppercase tracking-[2.5px] text-bark/70">
          plant a seed
        </span>
      </button>

      {/* Bottom sheet */}
      {open && (
        <>
          {/* Scrim */}
          <div
            className="fixed inset-0 bg-bark/30 z-40 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />

          {/* Sheet */}
          <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
            <div className="bg-cream rounded-t-2xl px-5 pt-6 pb-10 max-w-lg mx-auto">
              {/* Handle */}
              <div className="w-8 h-0.5 rounded-full bg-bark/15 mx-auto mb-6" />

              {/* Header */}
              <p className="font-display font-light italic text-[22px] text-bark tracking-tight mb-5">
                What would you like to plant?
              </p>

              <div className="flex flex-col gap-2.5">
                {/* Card 1 — Gratitude */}
                <button
                  onClick={() => navigate("/journal")}
                  className="w-full text-left flex items-start gap-3.5 p-4 rounded-xl bg-bark/[0.04] border border-bark/8 active:scale-[0.99] transition-transform"
                >
                  <span className="text-xl mt-0.5">🌱</span>
                  <div>
                    <p className="text-[14px] text-bark font-normal leading-tight mb-0.5">
                      Gratitude entry
                    </p>
                    <p className="text-[12px] text-bark/45 font-light leading-snug">
                      Something you're holding onto
                    </p>
                  </div>
                </button>

                {/* Card 2 — Rewrite Room */}
                <button
                  onClick={() => navigate("/journal")}
                  className="w-full text-left flex items-start gap-3.5 p-4 rounded-xl border active:scale-[0.99] transition-transform"
                  style={{
                    background: "rgba(61,43,31,0.07)",
                    borderColor: "rgba(61,43,31,0.08)",
                    borderLeftWidth: 3,
                    borderLeftColor: "#C97A6E",
                  }}
                >
                  <span className="text-xl mt-0.5">🌿</span>
                  <div>
                    <p className="text-[14px] text-bark font-normal leading-tight mb-0.5">
                      Rewrite Room
                    </p>
                    <p className="text-[12px] text-bark/45 font-light leading-snug">
                      The full version of a memory
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
