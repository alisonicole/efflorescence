"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CrisisPath = "none" | "breathing";

interface CrisisModalProps {
  onClose: () => void;
  onTendGarden: () => void;
}

export default function CrisisModal({
  onClose,
  onTendGarden,
}: CrisisModalProps) {
  const router = useRouter();
  const [path, setPath] = useState<CrisisPath>("none");
  const [secondsLeft, setSecondsLeft] = useState(600);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">(
    "inhale",
  );

  useEffect(() => {
    if (path !== "breathing") return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [path]);

  useEffect(() => {
    if (path !== "breathing") return;
    const phases: Array<{
      phase: "inhale" | "hold" | "exhale";
      duration: number;
    }> = [
      { phase: "inhale", duration: 4000 },
      { phase: "hold", duration: 7000 },
      { phase: "exhale", duration: 8000 },
    ];
    let idx = 0;
    let timeoutId: ReturnType<typeof setTimeout>;
    let cancelled = false;
    function advance() {
      if (cancelled) return;
      setBreathPhase(phases[idx].phase);
      timeoutId = setTimeout(() => {
        idx = (idx + 1) % phases.length;
        advance();
      }, phases[idx].duration);
    }
    advance();
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [path]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-app bg-cream rounded-t-2xl p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {path === "none" && (
          <>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-clay" />
              <h2 className="font-serif text-lg text-bark">
                Need a soft redirect?
              </h2>
            </div>
            <p className="text-xs text-muted mb-6">Come here first.</p>

            <button
              onClick={() => {
                onTendGarden();
                onClose();
              }}
              className="w-full text-left p-4 bg-white rounded-card mb-2 shadow-sm"
            >
              <div className="text-sm font-medium text-bark">
                Tend your garden
              </div>
              <div className="text-xs text-muted">
                Do one small thing. It helps.
              </div>
            </button>

            <button
              onClick={() => {
                router.push("/journal/receipts");
                onClose();
              }}
              className="w-full text-left p-4 bg-white rounded-card mb-2 shadow-sm"
            >
              <div className="text-sm font-medium text-bark">
                Open The Receipts
              </div>
              <div className="text-xs text-muted">
                Read what you wrote. Remember why.
              </div>
            </button>

            <button
              onClick={() => setPath("breathing")}
              className="w-full text-left p-4 bg-white rounded-card shadow-sm"
            >
              <div className="text-sm font-medium text-bark">
                Give it 10 minutes
              </div>
              <div className="text-xs text-muted">
                Guided breathing, then check in.
              </div>
            </button>
          </>
        )}

        {path === "breathing" && (
          <div className="text-center py-4">
            <div className="text-5xl mb-4">
              {breathPhase === "inhale"
                ? "🌬"
                : breathPhase === "hold"
                  ? "🌿"
                  : "💨"}
            </div>
            <p className="font-serif text-2xl text-bark mb-1 capitalize">
              {breathPhase}
            </p>
            <p className="text-xs text-muted mb-8">
              {breathPhase === "inhale"
                ? "4 counts"
                : breathPhase === "hold"
                  ? "7 counts"
                  : "8 counts"}
            </p>
            <p className="text-xs text-muted">
              {minutes}:{String(seconds).padStart(2, "0")} left
            </p>
            <button
              onClick={onClose}
              className="mt-6 text-xs text-muted underline"
            >
              I'm okay now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
