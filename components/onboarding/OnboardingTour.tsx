"use client";

import { useState } from "react";

export const TOUR_KEY = "onboardingTour_v2";

interface Slide {
  tab: string | null;
  emoji: string;
  heading: string;
  body: string;
  action: string | null;
}

const SLIDES: Slide[] = [
  {
    tab: null,
    emoji: "🌱",
    heading: "Welcome to efflorescence.",
    body: "A quick walk-through of what's here and how to use it. Takes about a minute.",
    action: null,
  },
  {
    tab: "HOME",
    emoji: "💬",
    heading: "Your commitments.",
    body: "The scrolling band at the top holds the reasons you started. On your hardest days, this is what you see first.",
    action: "Tap the band when it's empty to plant your first commitment.",
  },
  {
    tab: "HOME",
    emoji: "✍️",
    heading: "Today's prompt.",
    body: "Every day has a reflection question. Your answer goes straight to your journal as a leaf on your tree.",
    action: "Tap the prompt card to write your first entry.",
  },
  {
    tab: "HOME",
    emoji: "🤍",
    heading: "When it gets hard.",
    body: "The button at the bottom of home gives you grounding support - whether you want to reach out to them or you're stuck in your head.",
    action: "You never have to be okay to open this.",
  },
  {
    tab: "GARDEN",
    emoji: "🌸",
    heading: "Your habit flowers.",
    body: "Each flower is a habit you're building. Tap it every day to log your completion. Streaks bloom the flower through 7 stages.",
    action: "Tap + to add your first habit. Come back to water it daily.",
  },
  {
    tab: "GARDEN",
    emoji: "🫙",
    heading: "The gratitude jar.",
    body: "Drop in small moments: a good song, a walk, a text from a friend. Tap the jar to pull one out when you forget there were good parts.",
    action: "Add your first pebble today.",
  },
  {
    tab: "JOURNAL",
    emoji: "🌳",
    heading: "Your journal tree.",
    body: "Every entry grows a leaf. You can literally watch your healing take shape over time. Tap any leaf to read back.",
    action: "One line counts. Write anything.",
  },
  {
    tab: "INSPIRE",
    emoji: "💡",
    heading: "Your daily feed.",
    body: "Cards are matched to the thought pattern you name in your morning check-in. The more specific you are, the better the feed.",
    action: "Check in each morning for a personalized set of cards.",
  },
  {
    tab: "DAILY CHECK-IN",
    emoji: "☀️",
    heading: "The check-in shapes everything.",
    body: "It appears automatically when you open the app each morning. 30 seconds. You name what's happening in your head right now - that one choice personalizes your prompts, your inspire feed, and your whole day.",
    action: "It will be waiting for you tomorrow morning.",
  },
];

interface Props {
  onClose: () => void;
}

export default function OnboardingTour({ onClose }: Props) {
  const [idx, setIdx] = useState(0);

  const slide = SLIDES[idx];
  const isLast = idx === SLIDES.length - 1;
  const isFirst = idx === 0;

  function next() {
    if (isLast) {
      onClose();
    } else {
      setIdx(idx + 1);
    }
  }

  function back() {
    if (!isFirst) setIdx(idx - 1);
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-[#1A0D06] animate-slide-up">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <span className="font-display italic text-cream/30 text-[17px] tracking-tight">
          efflorescence
        </span>
        <button
          onClick={onClose}
          className="font-mono text-[9px] uppercase tracking-widest text-cream/25 py-1 px-2"
        >
          Skip
        </button>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        {slide.tab && (
          <span className="font-mono text-[8px] uppercase tracking-[3px] text-cream/30 border border-cream/15 rounded-full px-3 py-1 mb-6">
            {slide.tab}
          </span>
        )}

        <div className="text-[64px] leading-none mb-7">{slide.emoji}</div>

        <h2 className="font-display italic text-cream text-[25px] leading-tight tracking-tight mb-4 max-w-[300px]">
          {slide.heading}
        </h2>

        <p className="text-[13px] text-cream/55 leading-relaxed max-w-[280px]">
          {slide.body}
        </p>

        {slide.action && (
          <div className="mt-6 bg-cream/[0.07] rounded-card px-4 py-3.5 max-w-[280px] w-full">
            <p className="font-mono text-[8px] uppercase tracking-[2px] text-cream/35 mb-1.5">
              Do this
            </p>
            <p className="text-xs text-cream/65 leading-relaxed">
              {slide.action}
            </p>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="px-6 pb-10 pt-2">
        {/* Progress dots */}
        <div className="flex justify-center items-center gap-1.5 mb-6">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === idx
                  ? "w-4 h-[5px] bg-cream/60"
                  : i < idx
                    ? "w-[5px] h-[5px] bg-cream/30"
                    : "w-[5px] h-[5px] bg-cream/15"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-full bg-cream text-bark rounded-card py-3.5 text-sm font-medium"
        >
          {isLast ? "Let's begin" : "Next"}
        </button>

        {!isFirst && (
          <button
            onClick={back}
            className="w-full mt-3 font-mono text-[9px] uppercase tracking-widest text-cream/25 py-2"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}
