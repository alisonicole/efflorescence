"use client";

interface DailyCheckInProps {
  onNavigate: (path: string) => void;
  onGround: () => void;
  onClose: () => void;
}

const OPTIONS = [
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

export default function DailyCheckIn({
  onNavigate,
  onGround,
  onClose,
}: DailyCheckInProps) {
  function handleOption(action: (typeof OPTIONS)[number]["action"]) {
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

        <p className="font-mono text-[8px] uppercase tracking-[3px] text-soil opacity-50 mb-1">
          Good morning
        </p>
        <p className="font-display font-light italic text-[22px] text-bark tracking-tight mb-5">
          What do you need today?
        </p>

        <div className="flex flex-col gap-2">
          {OPTIONS.map((opt) => (
            <button
              key={opt.action}
              onClick={() => handleOption(opt.action)}
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
      </div>
    </div>
  );
}
