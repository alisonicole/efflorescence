"use client";

import { useState, useEffect } from "react";

export const TOUR_KEY = "onboardingTour_v3";

interface Slide {
  tab: string;
  emoji: string;
  heading: string;
  body: string;
  action: string | null;
}

const SLIDES: Slide[] = [
  {
    tab: "Welcome",
    emoji: "🌿",
    heading: "This is your greenhouse.",
    body: "The flowers are yours. The mess is part of it. It takes about two minutes to see how it works.",
    action: null,
  },
  {
    tab: "Home",
    emoji: "🏡",
    heading: "Your greenhouse lives here.",
    body: "Every habit you track grows something. The seed pots are new ones. The flowers have been showing up.",
    action: null,
  },
  {
    tab: "Home",
    emoji: "✍️",
    heading: "Every day there's one question.",
    body: "You can answer it here, or let it sit. No grade. No streak broken if you skip it.",
    action: null,
  },
  {
    tab: "Home",
    emoji: "🫂",
    heading: "Right now feels hard.",
    body: "If you're having a moment — about to text him, stuck in a loop — this is the button. It's not therapy. It's just somewhere to go.",
    action: null,
  },
  {
    tab: "Garden",
    emoji: "🌱",
    heading: "Habits live here.",
    body: "Each habit you track becomes a plant. Tap to log today. It starts as a mystery seed — you won't know what it becomes until day 7.",
    action: "Tap a habit to log it",
  },
  {
    tab: "Garden",
    emoji: "🪨",
    heading: "Small things go here.",
    body: "Not profound. Not polished. Just something. Drop a pebble when you notice anything worth keeping.",
    action: "Drop a gratitude pebble",
  },
  {
    tab: "Journal",
    emoji: "🌀",
    heading: "Pick one thought pattern.",
    body: "The Clock. The Replay. The Mirror. The What If. The Should Be. Actually Okay. I Don't Know. One of these sounds like your head right now.",
    action: "Select your spiral",
  },
  {
    tab: "Journal",
    emoji: "🌳",
    heading: "Your entries become this.",
    body: "It starts small. It gets weird and specific and yours. Every journal entry is a branch.",
    action: null,
  },
  {
    tab: "Inspire",
    emoji: "💌",
    heading: "This feed matches where you are.",
    body: "Not an algorithm. Just a match to your spiral. The cards that feel written for you probably were — someone has been in that same loop.",
    action: null,
  },
  {
    tab: "Ground",
    emoji: "🫙",
    heading: "This one's different.",
    body: "Not a tab — a ritual. The center button. Open it when you need to land somewhere. The gratitude jar is in here.",
    action: null,
  },
  {
    tab: "Seeds",
    emoji: "🌸",
    heading: "Day 7 is a moment.",
    body: "When a habit hits 7 days in a row, the seed hatches. You'll meet your plant for the first time. Each one is different.",
    action: null,
  },
  {
    tab: "Ready",
    emoji: "✨",
    heading: "That's the whole thing.",
    body: "It works better if you use it, but it won't punish you if you don't. Come back tomorrow. Or tonight. Whatever you need.",
    action: null,
  },
];

interface Props {
  onClose: () => void;
}

export default function OnboardingTour({ onClose }: Props) {
  const [idx, setIdx] = useState(0);
  // Controls the fade-out animation when advancing slides
  const [transitioning, setTransitioning] = useState(false);
  // Tracks the currently rendered slide index (lags `idx` during transition)
  const [visibleIdx, setVisibleIdx] = useState(0);

  const slide = SLIDES[visibleIdx];
  const isLast = idx === SLIDES.length - 1;
  const isFirst = idx === 0;

  // When idx changes, fade out then swap the rendered slide
  useEffect(() => {
    if (idx === visibleIdx) return;
    setTransitioning(true);
    const timer = setTimeout(() => {
      setVisibleIdx(idx);
      setTransitioning(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [idx, visibleIdx]);

  function next() {
    if (isLast) {
      onClose();
    } else {
      setIdx((prev) => prev + 1);
    }
  }

  function back() {
    if (!isFirst) setIdx((prev) => prev - 1);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "rgba(22,12,5,0.96)" }}
    >
      {/* Slide content - fades during transition */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-8 text-center transition-opacity duration-150"
        style={{ opacity: transitioning ? 0 : 1 }}
      >
        {/* Tab pill badge */}
        <span className="font-mono text-[8px] uppercase tracking-[3px] text-cream/30 border border-cream/15 rounded-full px-3 py-1 mb-6">
          {slide.tab}
        </span>

        {/* Emoji */}
        <div className="leading-none mb-7" style={{ fontSize: 48 }}>
          {slide.emoji}
        </div>

        {/* Heading */}
        <h2 className="font-display italic text-cream text-[24px] leading-tight tracking-tight mb-4 max-w-[300px]">
          {slide.heading}
        </h2>

        {/* Body */}
        <p
          className="text-cream/70 max-w-[280px]"
          style={{ fontSize: 13, lineHeight: 1.65 }}
        >
          {slide.body}
        </p>

        {/* Optional action box */}
        {slide.action && (
          <div
            className="mt-6 rounded-lg max-w-[280px] w-full"
            style={{
              background: "rgba(245,239,228,0.08)",
              border: "1px dashed rgba(245,239,228,0.2)",
              padding: "10px 14px",
            }}
          >
            <p
              className="font-display italic text-cream/60"
              style={{ fontSize: 13 }}
            >
              {slide.action}
            </p>
          </div>
        )}
      </div>

      {/* Bottom nav area */}
      <div className="px-6 pb-10 pt-2">
        {/* Progress dots */}
        <div className="flex justify-center items-center gap-1.5 mb-8">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                height: 5,
                width: i === idx ? 20 : 5,
                background:
                  i === idx
                    ? "rgba(245,239,228,0.6)"
                    : i < idx
                      ? "rgba(245,239,228,0.3)"
                      : "rgba(245,239,228,0.15)",
              }}
            />
          ))}
        </div>

        {/* Back | Next row */}
        <div className="flex items-center justify-between">
          {/* Back button - hidden on first slide but kept for layout spacing */}
          <button
            onClick={back}
            className="text-cream/40 transition-opacity"
            style={{
              fontSize: 13,
              opacity: isFirst ? 0 : 1,
              pointerEvents: isFirst ? "none" : "auto",
            }}
          >
            &larr; Back
          </button>

          {/* Next / Let's begin button */}
          <button
            onClick={next}
            className="text-cream font-medium"
            style={{ fontSize: 13 }}
          >
            {isLast ? "Let's begin" : "Next →"}
          </button>
        </div>

        {/* Skip tour */}
        <div className="flex justify-center mt-4">
          <button
            onClick={onClose}
            className="text-cream/25"
            style={{ fontSize: 12 }}
          >
            Skip tour
          </button>
        </div>
      </div>
    </div>
  );
}
