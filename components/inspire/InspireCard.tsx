import type { InspireItem } from "@/types";

interface InspireCardProps {
  item: InspireItem;
  isMilestone?: boolean;
}

export default function InspireCard({ item, isMilestone }: InspireCardProps) {
  return (
    <div
      className={`bg-white rounded-card p-4 border shadow-sm ${isMilestone ? "border-clay/40" : "border-border"}`}
    >
      {isMilestone && (
        <p className="font-mono text-[8px] uppercase tracking-[3px] text-clay mb-2">
          milestone
        </p>
      )}
      {item.type === "science" && !isMilestone && (
        <p className="font-mono text-[8px] uppercase tracking-[3px] text-soil opacity-60 mb-2">
          the science
        </p>
      )}
      {item.title && (
        <p className="font-serif text-base text-bark mb-2 leading-snug">
          {item.title}
        </p>
      )}
      <p className="text-sm text-bark leading-relaxed whitespace-pre-wrap">
        {item.body}
      </p>
    </div>
  );
}
