import { SPIRAL_LABELS } from "@/types";
import type { Spiral, HabitCompletion, CheckIn } from "@/types";

interface DayDetailCardProps {
  date: Date;
  completions: HabitCompletion[];
  checkIn: CheckIn | undefined;
  onClose: () => void;
}

export default function DayDetailCard({
  date,
  completions,
  checkIn,
  onClose,
}: DayDetailCardProps) {
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-app bg-cream rounded-t-2xl p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-mono text-[9px] uppercase tracking-[3px] text-soil opacity-60 mb-4">
          {date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>

        {checkIn && (
          <div className="mb-4">
            <p className="text-[9px] uppercase tracking-wider text-muted mb-1">
              Spiral
            </p>
            <p className="text-sm text-bark">{SPIRAL_LABELS[checkIn.spiral]}</p>
          </div>
        )}

        {completions.length > 0 ? (
          <div className="mb-4">
            <p className="text-[9px] uppercase tracking-wider text-muted mb-2">
              Habits completed
            </p>
            <ul className="space-y-1">
              {completions.map((c) => (
                <li key={c.objectId} className="text-sm text-bark">
                  {c.habitId}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-muted mb-4">No habits logged this day.</p>
        )}

        <button
          onClick={onClose}
          className="w-full border border-border rounded-card py-2 text-sm text-muted"
        >
          Close
        </button>
      </div>
    </div>
  );
}
