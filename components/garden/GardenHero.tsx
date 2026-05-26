import Image from "next/image";
import type { Season, GardenState, Spiral } from "@/types";
import SeasonBadge from "./SeasonBadge";
import DayCounter from "./DayCounter";

// Map garden state to background image (season-matched where possible)
const BACKGROUND_IMAGES: Record<GardenState, string> = {
  dormant: "/images/landscape-01.jpg",
  stirring: "/images/landscape-02.jpg",
  tending: "/images/garden-01.jpg",
  blooming: "/images/garden-02.jpg",
};

// Map garden state to foreground/midground overlay image
const FOREGROUND_IMAGES: Record<GardenState, string> = {
  dormant: "/images/plant-01.jpg",
  stirring: "/images/plant-01.jpg",
  tending: "/images/garden-03.jpg",
  blooming: "/images/flower-01.jpg",
};

// Subtle tint overlay per spiral to hint at weather/mood
const SPIRAL_TINT: Record<string, string> = {
  the_clock: "bg-yellow-100/20",
  the_replay: "bg-blue-100/20",
  the_mirror: "bg-purple-100/20",
  the_what_if: "bg-blue-200/20",
  the_but_he: "bg-rose-100/20",
  actually_okay: "bg-yellow-50/10",
  i_dont_know: "bg-gray-100/20",
};

interface GardenHeroProps {
  season: Season;
  gardenState: GardenState;
  dayCount: number;
  todaySpiral?: Spiral;
}

export default function GardenHero({
  season,
  gardenState,
  dayCount,
  todaySpiral,
}: GardenHeroProps) {
  const tint = todaySpiral ? (SPIRAL_TINT[todaySpiral] ?? "") : "";

  return (
    <div className="mx-2.5 rounded-card overflow-hidden h-36 relative">
      {/* Background landscape */}
      <Image
        src={BACKGROUND_IMAGES[gardenState]}
        alt="Garden background"
        fill
        className="object-cover animate-shimmer"
        priority
      />

      {/* Midground garden scene */}
      <Image
        src={FOREGROUND_IMAGES[gardenState]}
        alt="Garden scene"
        fill
        className="object-cover mix-blend-multiply animate-sway"
      />

      {/* Weather tint overlay */}
      {tint && (
        <div
          className={`absolute inset-0 ${tint} transition-colors duration-1000`}
        />
      )}

      {/* Bottom gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

      {/* Season badge top-left */}
      <div className="absolute top-2.5 left-3">
        <SeasonBadge season={season} />
      </div>

      {/* Day counter bottom-right */}
      <div className="absolute bottom-2.5 right-3">
        <DayCounter days={dayCount} />
      </div>
    </div>
  );
}
