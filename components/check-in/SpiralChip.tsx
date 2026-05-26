import type { Spiral } from "@/types";
import { SPIRAL_LABELS } from "@/types";

interface SpiralChipProps {
  spiral: Spiral;
  selected: boolean;
  onSelect: (spiral: Spiral) => void;
  onHover: (spiral: Spiral | null) => void;
}

export default function SpiralChip({
  spiral,
  selected,
  onSelect,
  onHover,
}: SpiralChipProps) {
  return (
    <button
      onClick={() => onSelect(spiral)}
      onMouseEnter={() => onHover(spiral)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(spiral)}
      onBlur={() => onHover(null)}
      className={`rounded-pill px-3 py-1.5 text-[11px] border transition-colors ${
        selected
          ? "bg-clay border-clay text-white"
          : "bg-petal border-border text-bark hover:border-clay"
      }`}
    >
      {SPIRAL_LABELS[spiral]}
    </button>
  );
}
