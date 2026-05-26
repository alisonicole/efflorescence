import { SEASON_LABELS } from "@/lib/garden";
import type { Season } from "@/types";

export default function SeasonBadge({ season }: { season: Season }) {
  return (
    <span className="bg-white/85 backdrop-blur-sm rounded-pill px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-bark">
      {SEASON_LABELS[season]}
    </span>
  );
}
