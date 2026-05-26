import { SEASON_LABELS } from "@/lib/garden";
import type { Season } from "@/types";

export default function SeasonBadge({ season }: { season: Season }) {
  return (
    <span className="bg-white/85 backdrop-blur-sm rounded-pill px-3 py-1 font-mono text-[9px] uppercase tracking-[3px] text-bark">
      {SEASON_LABELS[season]}
    </span>
  );
}
