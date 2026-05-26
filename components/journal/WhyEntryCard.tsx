import { isLocked, hoursUntilLock } from "@/lib/the-why";
import type { WhyEntry } from "@/types";

interface WhyEntryCardProps {
  entry: WhyEntry;
}

export default function WhyEntryCard({ entry }: WhyEntryCardProps) {
  const locked = isLocked(entry.createdAt);
  const hours = hoursUntilLock(entry.createdAt);

  return (
    <div className="bg-white rounded-card p-4 border border-border">
      <p className="font-mono text-[9px] uppercase tracking-[3px] text-soil opacity-60 mb-3">
        {locked
          ? "Sealed"
          : `Editable for ${hours} more ${hours === 1 ? "hour" : "hours"}`}
        {" — "}
        {entry.createdAt.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>
      <p className="text-sm text-bark leading-relaxed whitespace-pre-wrap">
        {entry.content}
      </p>
    </div>
  );
}
