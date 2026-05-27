"use client";

import { useState } from "react";

interface GardenTourProps {
  onClose: () => void;
}

// Mini inline SVG for a given growth stage, used in the tour progression row.
function StageSvg({
  stage,
  color = "#8FB5A0",
}: {
  stage: number;
  color?: string;
}) {
  const PETAL_ANGLES: Record<number, number[]> = {
    4: [0, 180],
    5: [0, 90, 180, 270],
    6: [0, 60, 120, 180, 240, 300],
    7: [0, 45, 90, 135, 180, 225, 270, 315],
  };

  return (
    <svg
      width="40"
      height="54"
      viewBox="0 0 56 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {stage === 0 && (
        <>
          <ellipse
            cx="28"
            cy="69"
            rx="13"
            ry="3.5"
            fill="#C4A882"
            opacity="0.55"
          />
          <ellipse
            cx="28"
            cy="66"
            rx="3.5"
            ry="2.5"
            fill={color}
            opacity="0.65"
          />
        </>
      )}
      {stage === 1 && (
        <>
          <line
            x1="28"
            y1="56"
            x2="28"
            y2="72"
            stroke="#4A6741"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <ellipse
            cx="21"
            cy="54"
            rx="7"
            ry="3.2"
            fill="#7A9E6E"
            opacity="0.8"
            transform="rotate(-30 21 54)"
          />
          <ellipse
            cx="35"
            cy="54"
            rx="7"
            ry="3.2"
            fill="#7A9E6E"
            opacity="0.8"
            transform="rotate(30 35 54)"
          />
        </>
      )}
      {stage === 3 && (
        <>
          <line
            x1="28"
            y1="38"
            x2="28"
            y2="72"
            stroke="#4A6741"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <ellipse
            cx="21"
            cy="58"
            rx="7"
            ry="3.5"
            fill="#7A9E6E"
            opacity="0.65"
            transform="rotate(-35 21 58)"
          />
          <ellipse cx="28" cy="26" rx="6" ry="11" fill={color} opacity="0.45" />
          <ellipse cx="28" cy="27" rx="4" ry="8" fill={color} opacity="0.7" />
          <ellipse
            cx="22"
            cy="36"
            rx="3.5"
            ry="6"
            fill="#4A6741"
            opacity="0.55"
            transform="rotate(-20 22 36)"
          />
          <ellipse
            cx="34"
            cy="36"
            rx="3.5"
            ry="6"
            fill="#4A6741"
            opacity="0.55"
            transform="rotate(20 34 36)"
          />
        </>
      )}
      {stage >= 4 && (
        <>
          <line
            x1="28"
            y1="38"
            x2="28"
            y2="72"
            stroke="#4A6741"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <ellipse
            cx="21"
            cy="58"
            rx="7"
            ry="3.5"
            fill="#7A9E6E"
            opacity="0.65"
            transform="rotate(-35 21 58)"
          />
          {(PETAL_ANGLES[stage] ?? PETAL_ANGLES[7]).map((angle) => (
            <ellipse
              key={angle}
              cx="28"
              cy="17"
              rx="4.5"
              ry="8"
              fill={color}
              opacity="0.82"
              transform={`rotate(${angle} 28 28)`}
            />
          ))}
          <circle cx="28" cy="28" r={stage === 7 ? 7 : 5} fill="#F5EFE4" />
          <circle
            cx="28"
            cy="28"
            r={stage === 7 ? 5 : 3.5}
            fill={color}
            opacity="0.55"
          />
          <circle cx="28" cy="28" r="2.5" fill={color} opacity="0.9" />
        </>
      )}
    </svg>
  );
}

const STAGES = [
  { stage: 0, label: "day 0", sublabel: "seed" },
  { stage: 1, label: "day 1", sublabel: "sprout" },
  { stage: 3, label: "day 3", sublabel: "budding" },
  { stage: 5, label: "day 5", sublabel: "blooming" },
  { stage: 7, label: "day 7", sublabel: "full bloom" },
];

const SLIDE_COLORS = ["#8FB5A0", "#E8C547", "#C97A8A", "#9B8DB5", "#D4B483"];

const SLIDES = [
  {
    title: "Your garden grows with you.",
    body: "Every habit is a flower. Tend to it each day and watch it bloom. This is your space to heal, slowly and visibly.",
    cta: "Show me how",
  },
  {
    title: "Seven days to full bloom.",
    body: "Each tap waters your flower. It grows through seven stages — from a seed in the dirt to a fully open bloom.",
    cta: "Got it",
    showProgression: true,
  },
  {
    title: "Miss a day, it wilts.",
    body: "That's okay. A wilted flower can always grow back. Just start again tomorrow — the streak resets, not your progress.",
    cta: "I understand",
    showWilting: true,
  },
  {
    title: "It's yours to tend.",
    body: "Check in each morning, water your flowers, write in your journal. There's no right pace — just showing up.",
    cta: "Start tending",
  },
];

export default function GardenTour({ onClose }: GardenTourProps) {
  const [slide, setSlide] = useState(0);
  const current = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;

  function advance() {
    if (isLast) {
      onClose();
    } else {
      setSlide((s) => s + 1);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
      <div className="w-full max-w-app bg-cream rounded-t-2xl px-6 pt-6 pb-10 animate-slide-up">
        {/* Pip indicators */}
        <div className="flex justify-center gap-1.5 mb-6">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === slide ? "w-4 bg-bark/60" : "w-1.5 bg-bark/20"
              }`}
            />
          ))}
        </div>

        <h2 className="font-display text-xl italic font-light text-bark mb-2 leading-snug">
          {current.title}
        </h2>
        <p className="font-mono text-[10px] text-soil opacity-70 leading-relaxed mb-6">
          {current.body}
        </p>

        {/* Flower progression — slide 2 */}
        {current.showProgression && (
          <div className="flex justify-between items-end mb-6 px-1">
            {STAGES.map(({ stage, label, sublabel }, i) => (
              <div key={stage} className="flex flex-col items-center gap-1">
                <StageSvg stage={stage} color={SLIDE_COLORS[i]} />
                <span className="font-mono text-[7px] text-bark/50 uppercase tracking-wider">
                  {label}
                </span>
                <span className="font-mono text-[7px] text-bark/35 italic">
                  {sublabel}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Wilting illustration — slide 3 */}
        {current.showWilting && (
          <div className="flex justify-center mb-6">
            <div className="flex flex-col items-center gap-1 opacity-60">
              <svg
                width="40"
                height="54"
                viewBox="0 0 56 76"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M28 72 C28 58 31 48 38 36"
                  stroke="#4A6741"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <ellipse
                  cx="22"
                  cy="58"
                  rx="7"
                  ry="3.5"
                  fill="#7A9E6E"
                  opacity="0.5"
                  transform="rotate(-35 22 58)"
                />
                <ellipse
                  cx="40"
                  cy="26"
                  rx="6"
                  ry="11"
                  fill="#9B8DB5"
                  opacity="0.3"
                  transform="rotate(22 40 26)"
                />
                <ellipse
                  cx="40"
                  cy="27"
                  rx="4"
                  ry="8"
                  fill="#9B8DB5"
                  opacity="0.45"
                  transform="rotate(22 40 27)"
                />
                <ellipse
                  cx="34"
                  cy="35"
                  rx="3.5"
                  ry="6"
                  fill="#4A6741"
                  opacity="0.4"
                  transform="rotate(8 34 35)"
                />
                <ellipse
                  cx="44"
                  cy="37"
                  rx="3.5"
                  ry="6"
                  fill="#4A6741"
                  opacity="0.4"
                  transform="rotate(32 44 37)"
                />
              </svg>
              <span className="font-mono text-[8px] text-bark/40 italic">
                wilted
              </span>
            </div>
            <div className="flex items-center px-6 text-bark/30 text-lg">→</div>
            <div className="flex flex-col items-center gap-1">
              <StageSvg stage={1} color="#7A9E6E" />
              <span className="font-mono text-[8px] text-bark/40 italic">
                grows back
              </span>
            </div>
          </div>
        )}

        <button
          onClick={advance}
          className="w-full bg-bark text-cream rounded-card py-3 text-sm font-medium"
        >
          {current.cta}
        </button>

        {!isLast && (
          <button
            onClick={onClose}
            className="w-full text-[10px] text-muted py-2 mt-1"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
