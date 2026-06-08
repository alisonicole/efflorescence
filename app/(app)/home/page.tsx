"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import { computeStreak, computeDayCount } from "@/lib/garden";
import { getPrompt } from "@/lib/prompts";
import { useAuth } from "@/context/AuthContext";
import type { Habit, HabitCategory, Spiral } from "@/types";
import { SPIRAL_LABELS } from "@/types";

const GROUNDING_PROMPTS = [
  "Name three things you can see right now.",
  "Take three slow breaths. What do you notice?",
  "What does your body need right now?",
  "One thing that's true and solid in your life right now.",
  "You've been here before. What got you through?",
];

function getGreeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getWeekKey(): string {
  const d = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(
    ((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7,
  );
  return `weeklyRitual-${d.getFullYear()}-${week}`;
}

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [bannerItems, setBannerItems] = useState<string[]>([]);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [showBannerPrompt, setShowBannerPrompt] = useState(false);
  const [bannerInput, setBannerInput] = useState("");
  const [habits, setHabits] = useState<Habit[]>([]);
  const [streaks, setStreaks] = useState<Record<string, number>>({});
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set());
  const [dayCount, setDayCount] = useState(0);
  const [todayPrompt, setTodayPrompt] = useState<string>("");
  const [todaySpiralLabel, setTodaySpiralLabel] = useState<string>("");
  const [commitments, setCommitments] = useState<string[]>([]);

  // Hard moment sheet
  const [showHardMoment, setShowHardMoment] = useState(false);
  const [hardMomentText, setHardMomentText] = useState("");
  const [savingHardMoment, setSavingHardMoment] = useState(false);
  const [hardMomentGroundingIdx] = useState(() =>
    Math.floor(Math.random() * GROUNDING_PROMPTS.length),
  );
  const [hardMomentPath, setHardMomentPath] = useState<
    "select" | "reach_out" | "spiral" | null
  >(null);
  const [receiptsEntry, setReceiptsEntry] = useState<string | null>(null);

  // Weekly ritual
  const dow = new Date().getDay();
  const isWeeklyRitualDay = dow === 0 || dow === 1;
  const weeklyDone =
    typeof window !== "undefined" && !!localStorage.getItem(getWeekKey());
  const [showWeeklyRitual, setShowWeeklyRitual] = useState(
    isWeeklyRitualDay && !weeklyDone,
  );
  const [weeklyText, setWeeklyText] = useState("");
  const [savingWeekly, setSavingWeekly] = useState(false);

  const hour = new Date().getHours();
  const firstName =
    (user?.get("name") as string | undefined)?.split(" ")[0] ?? "";

  const load = useCallback(async () => {
    initParse();
    const u = Parse.User.current();
    if (!u) return;

    try {
      const entryQuery = new Parse.Query("JournalEntry");
      entryQuery.equalTo("user", u);
      entryQuery.containedIn("entryType", ["the_why", "affirmation"]);
      entryQuery.descending("createdAt");
      entryQuery.limit(50);
      const entries = await entryQuery.find();
      const texts = entries
        .map((e) => e.get("content") as string)
        .filter(Boolean);
      setBannerItems(texts);
      const seen = localStorage.getItem("bannerPromptSeen");
      if (!seen && texts.length === 0) setShowBannerPrompt(true);
      setCommitments(
        entries
          .filter((e) => e.get("entryType") === "the_why")
          .map((e) => e.get("content") as string)
          .filter(Boolean),
      );

      const today0 = new Date();
      today0.setHours(0, 0, 0, 0);
      const tomorrow0 = new Date(today0);
      tomorrow0.setDate(tomorrow0.getDate() + 1);
      const checkIn = await new Parse.Query("CheckIn")
        .equalTo("user", u)
        .greaterThanOrEqualTo("date", today0)
        .lessThan("date", tomorrow0)
        .first();
      const spiral = checkIn ? (checkIn.get("spiral") as Spiral) : undefined;
      setTodayPrompt(getPrompt(spiral));
      if (spiral) setTodaySpiralLabel(SPIRAL_LABELS[spiral] ?? "");

      const ParseHabit = Parse.Object.extend("Habit");
      const habitQuery = new Parse.Query(ParseHabit);
      habitQuery.equalTo("user", u);
      habitQuery.equalTo("isActive", true);
      const habitResults = await habitQuery.find();
      const habitList: Habit[] = habitResults.map((h) => ({
        objectId: h.id,
        name: h.get("name") as string,
        category: h.get("category") as HabitCategory,
        icon: h.get("icon") as string,
        isActive: h.get("isActive") as boolean,
        createdAt: h.createdAt!,
        habitGroup: h.get("habitGroup") as string | undefined,
      }));
      setHabits(habitList);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const tomorrowStart = new Date(todayStart);
      tomorrowStart.setDate(tomorrowStart.getDate() + 1);

      const HabitCompletion = Parse.Object.extend("HabitCompletion");
      const completionQuery = new Parse.Query(HabitCompletion);
      completionQuery.equalTo("user", u);
      completionQuery.greaterThanOrEqualTo("completedDate", thirtyDaysAgo);
      completionQuery.limit(1000);
      const completions = await completionQuery.find();

      const todaySet = new Set<string>();
      const streakMap: Record<string, number> = {};
      for (const habit of habitList) {
        const dates = completions
          .filter((c) => c.get("habitId") === habit.objectId)
          .map((c) => c.get("completedDate") as Date);
        const isTodayDone = dates.some((d) => {
          const dd = new Date(d);
          dd.setHours(0, 0, 0, 0);
          return (
            dd.getTime() >= todayStart.getTime() &&
            dd.getTime() < tomorrowStart.getTime()
          );
        });
        if (isTodayDone) todaySet.add(habit.objectId);
        streakMap[habit.objectId] = computeStreak(dates);
      }
      setCompletedToday(todaySet);
      setStreaks(streakMap);

      await u.fetch();
      const startDate = u.get("healingStartDate") as Date | undefined;
      if (startDate) setDayCount(computeDayCount(new Date(startDate)));
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveHardMoment() {
    if (!hardMomentText.trim() || savingHardMoment) return;
    setSavingHardMoment(true);
    initParse();
    const u = Parse.User.current();
    if (!u) {
      setSavingHardMoment(false);
      return;
    }
    try {
      const Entry = Parse.Object.extend("JournalEntry");
      const e = new Entry();
      e.set("user", u);
      e.set("content", hardMomentText.trim());
      e.set("prompt", "What's happening right now?");
      e.setACL(new Parse.ACL(u));
      await e.save();
      setHardMomentText("");
      setShowHardMoment(false);
    } finally {
      setSavingHardMoment(false);
    }
  }

  async function loadReceipts() {
    initParse();
    const u = Parse.User.current();
    if (!u) return;
    try {
      const query = new Parse.Query("JournalEntry");
      query.equalTo("user", u);
      query.equalTo("entryType", "receipts");
      query.descending("createdAt");
      const result = await query.first();
      if (result) setReceiptsEntry(result.get("content") as string);
    } catch {
      /* silent */
    }
  }

  async function saveBannerCommitment() {
    if (!bannerInput.trim()) return;
    initParse();
    const u = Parse.User.current();
    if (!u) return;
    try {
      const Entry = Parse.Object.extend("JournalEntry");
      const e = new Entry();
      e.set("user", u);
      e.set("content", bannerInput.trim());
      e.set("entryType", "the_why");
      e.setACL(new Parse.ACL(u));
      await e.save();
      localStorage.setItem("bannerPromptSeen", "1");
      setBannerInput("");
      setShowBannerPrompt(false);
      void load();
    } catch {
      /* silent */
    }
  }

  async function saveWeeklyRitual() {
    if (!weeklyText.trim() || savingWeekly) return;
    setSavingWeekly(true);
    initParse();
    const u = Parse.User.current();
    if (!u) {
      setSavingWeekly(false);
      return;
    }
    try {
      const Entry = Parse.Object.extend("JournalEntry");
      const e = new Entry();
      e.set("user", u);
      e.set("content", weeklyText.trim());
      e.set("entryType", "weekly_reflection");
      e.set(
        "prompt",
        dow === 0
          ? "What do you want to release before Monday?"
          : "What do you want to tend to this week?",
      );
      e.setACL(new Parse.ACL(u));
      await e.save();
      localStorage.setItem(getWeekKey(), "1");
      setWeeklyText("");
      setShowWeeklyRitual(false);
    } finally {
      setSavingWeekly(false);
    }
  }

  const weeklyPrompt =
    dow === 0
      ? "What do you want to release before Monday?"
      : "What do you want to tend to this week?";
  const weeklyLabel = dow === 0 ? "Close your week" : "Set your week";
  const randomCommitment =
    commitments[Math.floor(Math.random() * commitments.length)] ?? "";

  const whatsGrown =
    dayCount > 0 || habits.length > 0
      ? `You've been here ${dayCount} ${dayCount === 1 ? "day" : "days"}. Your garden has ${habits.length} ${habits.length === 1 ? "flower" : "flowers"}.${todaySpiralLabel ? ` The spiral you're in today is ${todaySpiralLabel}.` : ""}`
      : "Your garden is just beginning. Every day you tend it, something grows.";

  return (
    <>
      {/* Dark header */}
      <div className="bg-bark">
        <div className="px-5 pt-7">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[3px] text-cream/45 mb-1">
                {getGreeting(hour)}
              </p>
              <p className="font-display italic text-cream text-[26px] leading-tight">
                {firstName ? `${firstName}.` : "welcome."}
              </p>
            </div>
            {dayCount > 0 && (
              <span className="font-mono text-[7px] uppercase tracking-[2px] text-cream/30 bg-white/[0.07] border border-white/10 rounded-full px-3 py-1.5 mt-1 whitespace-nowrap">
                Day {dayCount}
              </span>
            )}
          </div>

          {/* Commitment band */}
          <div
            className="border-t border-cream/10 py-4 cursor-pointer"
            onClick={() =>
              bannerItems.length > 0 &&
              setBannerIdx((i) => (i + 1) % bannerItems.length)
            }
          >
            {bannerItems.length === 0 ? (
              showBannerPrompt ? (
                <div onClick={(e) => e.stopPropagation()}>
                  <p className="font-mono text-[8px] uppercase tracking-widest text-cream/40 mb-3">
                    What do you want to remember on your hardest days?
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={bannerInput}
                      onChange={(e) => setBannerInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && void saveBannerCommitment()
                      }
                      placeholder="I am committed to..."
                      className="flex-1 bg-cream/10 rounded-card px-3 py-2 text-xs text-cream placeholder:text-cream/30 focus:outline-none border border-cream/20"
                    />
                    <button
                      onClick={() => void saveBannerCommitment()}
                      disabled={!bannerInput.trim()}
                      className="bg-cream text-bark rounded-card px-3 py-2 text-xs font-medium disabled:opacity-40"
                    >
                      Plant it
                    </button>
                  </div>
                </div>
              ) : (
                <p className="font-display italic text-cream/30 text-sm">
                  Add a commitment to begin.
                </p>
              )
            ) : (
              <>
                <p className="font-display italic text-cream/70 text-[15px] leading-relaxed">
                  &ldquo;{bannerItems[bannerIdx]}&rdquo;
                </p>
                {bannerItems.length > 1 && (
                  <p className="font-mono text-[6.5px] uppercase tracking-[1.5px] text-cream/20 mt-2">
                    Tap to cycle &middot; {bannerItems.length} commitments
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2.5 pb-24">
        {/* Weekly ritual card */}
        {showWeeklyRitual && (
          <div className="mx-2.5 bg-white rounded-card border border-border p-4 shadow-sm mt-2.5">
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-[8px] uppercase tracking-widest text-muted">
                {weeklyLabel}
              </p>
              <button
                onClick={() => setShowWeeklyRitual(false)}
                className="text-muted text-xs"
              >
                ✕
              </button>
            </div>
            <p className="font-display italic text-bark text-sm mb-3">
              {weeklyPrompt}
            </p>
            <textarea
              value={weeklyText}
              onChange={(e) => setWeeklyText(e.target.value)}
              rows={3}
              placeholder="Write freely..."
              className="w-full bg-cream rounded-card p-3 text-sm text-bark placeholder:text-muted/50 border border-border focus:outline-none focus:border-clay/40 resize-none leading-relaxed mb-2"
            />
            <button
              onClick={() => void saveWeeklyRitual()}
              disabled={!weeklyText.trim() || savingWeekly}
              className="w-full bg-bark text-cream rounded-card py-2 text-xs font-medium disabled:opacity-40"
            >
              {savingWeekly ? "Saving..." : "Seal it"}
            </button>
          </div>
        )}

        {/* Elevation greenhouse hero illustration */}
        <div className="relative overflow-hidden" style={{ height: 420 }}>
          <svg
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
            viewBox="0 0 390 420"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a4cae0" />
                <stop offset="30%" stopColor="#c2dae8" />
                <stop offset="60%" stopColor="#d8e8cc" />
                <stop offset="100%" stopColor="#f0e8d4" />
              </linearGradient>
              {/* Glass panel shimmer */}
              <linearGradient id="glass-l" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="white" stopOpacity="0.22" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="glass-r" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="white" stopOpacity="0.22" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect width="390" height="420" fill="url(#sky1)" />

            {/* Subtle clouds */}
            <ellipse
              cx="110"
              cy="42"
              rx="52"
              ry="18"
              fill="white"
              opacity="0.28"
            />
            <ellipse
              cx="148"
              cy="36"
              rx="36"
              ry="14"
              fill="white"
              opacity="0.22"
            />
            <ellipse
              cx="268"
              cy="48"
              rx="44"
              ry="17"
              fill="white"
              opacity="0.26"
            />
            <ellipse
              cx="308"
              cy="40"
              rx="30"
              ry="12"
              fill="white"
              opacity="0.2"
            />

            {/* Glass panel shimmer left and right */}
            <rect x="0" y="0" width="60" height="420" fill="url(#glass-l)" />
            <rect x="330" y="0" width="60" height="420" fill="url(#glass-r)" />

            {/* Arch frame - 6 nested ribs */}
            {/* Arch 1 outermost */}
            <path
              d="M 4 420 Q 4 12 195 12 Q 386 12 386 420"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Arch 2 */}
            <path
              d="M 36 420 Q 36 50 195 50 Q 354 50 354 420"
              stroke="rgba(255,255,255,0.72)"
              strokeWidth="4"
              fill="none"
            />
            {/* Arch 3 */}
            <path
              d="M 68 420 Q 68 88 195 88 Q 322 88 322 420"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="3"
              fill="none"
            />
            {/* Arch 4 */}
            <path
              d="M 100 420 Q 100 124 195 124 Q 290 124 290 420"
              stroke="rgba(255,255,255,0.38)"
              strokeWidth="2.2"
              fill="none"
            />
            {/* Arch 5 */}
            <path
              d="M 128 420 Q 128 154 195 154 Q 262 154 262 420"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.6"
              fill="none"
            />
            {/* Arch 6 deep */}
            <path
              d="M 152 420 Q 152 178 195 178 Q 238 178 238 420"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              fill="none"
            />

            {/* Ridge beam */}
            <line
              x1="195"
              y1="12"
              x2="195"
              y2="420"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="2.8"
            />

            {/* Horizontal glazing bars (symmetric) */}
            <path
              d="M 36 310 Q 195 294 354 310"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="1.2"
              fill="none"
            />
            <path
              d="M 68 264 Q 195 250 322 264"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M 14 364 Q 195 346 376 364"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
              fill="none"
            />

            {/* Symmetric wall vines - left edge only */}
            <path
              d="M 6 420 C 5 365 8 315 4 265 C 2 228 6 190 8 148 C 10 112 6 76 10 44"
              stroke="rgba(65,105,48,0.7)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <ellipse
              cx="7"
              cy="388"
              rx="14"
              ry="7"
              fill="rgba(80,125,55,0.65)"
              transform="rotate(-28 7 388)"
            />
            <ellipse
              cx="5"
              cy="345"
              rx="13"
              ry="7"
              fill="rgba(85,132,60,0.6)"
              transform="rotate(20 5 345)"
            />
            <ellipse
              cx="7"
              cy="302"
              rx="14"
              ry="7"
              fill="rgba(80,125,55,0.58)"
              transform="rotate(-25 7 302)"
            />
            <ellipse
              cx="5"
              cy="258"
              rx="12"
              ry="6.5"
              fill="rgba(85,132,60,0.55)"
              transform="rotate(18 5 258)"
            />
            <ellipse
              cx="8"
              cy="215"
              rx="13"
              ry="7"
              fill="rgba(80,125,55,0.52)"
              transform="rotate(-22 8 215)"
            />
            <ellipse
              cx="6"
              cy="172"
              rx="12"
              ry="6"
              fill="rgba(85,132,60,0.48)"
              transform="rotate(25 6 172)"
            />
            <ellipse
              cx="9"
              cy="128"
              rx="11"
              ry="6"
              fill="rgba(78,120,52,0.44)"
              transform="rotate(-18 9 128)"
            />
            <ellipse
              cx="7"
              cy="88"
              rx="11"
              ry="5.5"
              fill="rgba(85,132,60,0.4)"
              transform="rotate(20 7 88)"
            />

            {/* Symmetric wall vines - right edge only */}
            <path
              d="M 384 420 C 385 365 382 315 386 265 C 388 228 384 190 382 148 C 380 112 384 76 380 44"
              stroke="rgba(65,105,48,0.7)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <ellipse
              cx="383"
              cy="388"
              rx="14"
              ry="7"
              fill="rgba(80,125,55,0.65)"
              transform="rotate(28 383 388)"
            />
            <ellipse
              cx="385"
              cy="345"
              rx="13"
              ry="7"
              fill="rgba(85,132,60,0.6)"
              transform="rotate(-20 385 345)"
            />
            <ellipse
              cx="383"
              cy="302"
              rx="14"
              ry="7"
              fill="rgba(80,125,55,0.58)"
              transform="rotate(25 383 302)"
            />
            <ellipse
              cx="385"
              cy="258"
              rx="12"
              ry="6.5"
              fill="rgba(85,132,60,0.55)"
              transform="rotate(-18 385 258)"
            />
            <ellipse
              cx="382"
              cy="215"
              rx="13"
              ry="7"
              fill="rgba(80,125,55,0.52)"
              transform="rotate(22 382 215)"
            />
            <ellipse
              cx="384"
              cy="172"
              rx="12"
              ry="6"
              fill="rgba(85,132,60,0.48)"
              transform="rotate(-25 384 172)"
            />
            <ellipse
              cx="381"
              cy="128"
              rx="11"
              ry="6"
              fill="rgba(78,120,52,0.44)"
              transform="rotate(18 381 128)"
            />
            <ellipse
              cx="383"
              cy="88"
              rx="11"
              ry="5.5"
              fill="rgba(85,132,60,0.4)"
              transform="rotate(-20 383 88)"
            />

            {/* Potting bench (centered, receding) */}
            {/* Bench top */}
            <path
              d="M 118 264 L 272 264 L 268 256 L 122 256 Z"
              fill="rgba(158,108,58,0.68)"
            />
            <line
              x1="125"
              y1="258"
              x2="265"
              y2="258"
              stroke="rgba(115,75,35,0.2)"
              strokeWidth="0.8"
            />
            <line
              x1="128"
              y1="260"
              x2="262"
              y2="260"
              stroke="rgba(115,75,35,0.16)"
              strokeWidth="0.6"
            />
            <rect
              x="118"
              y="264"
              width="154"
              height="5"
              fill="rgba(135,88,45,0.6)"
            />
            <rect
              x="124"
              y="269"
              width="8"
              height="38"
              rx="2"
              fill="rgba(122,80,40,0.58)"
            />
            <rect
              x="258"
              y="269"
              width="8"
              height="38"
              rx="2"
              fill="rgba(122,80,40,0.58)"
            />
            <rect
              x="120"
              y="302"
              width="152"
              height="5"
              rx="1.5"
              fill="rgba(140,95,50,0.45)"
            />

            {/* Seed pot 1: crack only */}
            <path
              d="M 136 256 Q 146 270 156 256 L 154 245 L 138 245 Z"
              fill="rgba(190,146,94,0.82)"
            />
            <ellipse
              cx="146"
              cy="245"
              rx="10"
              ry="3.8"
              fill="rgba(206,160,106,0.65)"
            />
            <ellipse
              cx="146"
              cy="243"
              rx="8"
              ry="3"
              fill="rgba(85,58,28,0.7)"
            />
            <line
              x1="146"
              y1="242"
              x2="146"
              y2="239"
              stroke="rgba(90,148,66,0.5)"
              strokeWidth="1.2"
            />

            {/* Seed pot 2: two leaves */}
            <path
              d="M 172 256 Q 183 270 194 256 L 192 245 L 174 245 Z"
              fill="rgba(190,146,94,0.82)"
            />
            <ellipse
              cx="183"
              cy="245"
              rx="11"
              ry="4"
              fill="rgba(206,160,106,0.65)"
            />
            <ellipse
              cx="183"
              cy="243"
              rx="9"
              ry="3"
              fill="rgba(82,55,26,0.7)"
            />
            <line
              x1="183"
              y1="242"
              x2="183"
              y2="228"
              stroke="rgba(86,140,62,0.82)"
              strokeWidth="1.8"
            />
            <ellipse
              cx="177"
              cy="232"
              rx="7"
              ry="3.8"
              fill="rgba(108,168,76,0.75)"
              transform="rotate(-28 177 232)"
            />
            <ellipse
              cx="189"
              cy="231"
              rx="7"
              ry="3.8"
              fill="rgba(108,168,76,0.7)"
              transform="rotate(28 189 231)"
            />
            <ellipse
              cx="183"
              cy="226"
              rx="3.5"
              ry="2.2"
              fill="rgba(120,180,86,0.65)"
            />

            {/* Seed pot 3: taller sprout */}
            <path
              d="M 210 256 Q 222 270 234 256 L 232 245 L 212 245 Z"
              fill="rgba(190,146,94,0.82)"
            />
            <ellipse
              cx="222"
              cy="245"
              rx="12"
              ry="4"
              fill="rgba(206,160,106,0.65)"
            />
            <ellipse
              cx="222"
              cy="243"
              rx="10"
              ry="3"
              fill="rgba(82,55,26,0.7)"
            />
            <line
              x1="222"
              y1="242"
              x2="221"
              y2="221"
              stroke="rgba(86,140,62,0.82)"
              strokeWidth="1.8"
            />
            <ellipse
              cx="213"
              cy="234"
              rx="8"
              ry="4.2"
              fill="rgba(108,168,76,0.72)"
              transform="rotate(-30 213 234)"
            />
            <ellipse
              cx="231"
              cy="233"
              rx="8"
              ry="4.2"
              fill="rgba(108,168,76,0.68)"
              transform="rotate(30 231 233)"
            />
            <ellipse
              cx="214"
              cy="227"
              rx="6"
              ry="3.5"
              fill="rgba(118,178,84,0.62)"
              transform="rotate(-18 214 227)"
            />
            <ellipse
              cx="230"
              cy="226"
              rx="6"
              ry="3.5"
              fill="rgba(118,178,84,0.58)"
              transform="rotate(18 230 226)"
            />
            <ellipse
              cx="221"
              cy="220"
              rx="3"
              ry="2"
              fill="rgba(128,188,94,0.58)"
            />

            {/* Floor plants in terra cotta pots - symmetric, 2 each side */}
            {/* Far left */}
            <g transform="translate(52,342)">
              <circle cx="0" cy="-22" r="10" fill="rgba(201,122,110,0.86)" />
              <circle cx="-9" cy="-33" r="8.5" fill="rgba(201,122,110,0.78)" />
              <circle cx="9" cy="-33" r="8.5" fill="rgba(201,122,110,0.78)" />
              <circle cx="-13" cy="-21" r="8" fill="rgba(201,122,110,0.75)" />
              <circle cx="13" cy="-21" r="8" fill="rgba(201,122,110,0.75)" />
              <circle cx="0" cy="-22" r="6" fill="rgba(235,182,172,0.9)" />
              <circle cx="0" cy="-22" r="2.8" fill="rgba(160,82,72,0.88)" />
              <line
                x1="0"
                y1="-11"
                x2="0"
                y2="1"
                stroke="rgba(78,128,58,0.7)"
                strokeWidth="2.8"
              />
              <ellipse
                cx="-11"
                cy="-5"
                rx="9"
                ry="5"
                fill="rgba(92,142,70,0.6)"
                transform="rotate(-22 -11 -5)"
              />
              <path
                d="M -13 1 L -10 26 L 10 26 L 13 1 Z"
                fill="rgba(182,112,62,0.85)"
              />
              <ellipse
                cx="0"
                cy="1"
                rx="13"
                ry="5"
                fill="rgba(208,138,80,0.78)"
              />
              <ellipse
                cx="0"
                cy="0"
                rx="11"
                ry="3.8"
                fill="rgba(75,50,24,0.7)"
              />
              <ellipse
                cx="0"
                cy="26"
                rx="10"
                ry="3.2"
                fill="rgba(155,90,48,0.68)"
              />
            </g>
            {/* Near left */}
            <g transform="translate(138,350)">
              <circle cx="0" cy="-18" r="9" fill="rgba(122,158,110,0.86)" />
              <circle cx="0" cy="-28" r="7.5" fill="rgba(122,158,110,0.78)" />
              <circle cx="10" cy="-23" r="7.5" fill="rgba(122,158,110,0.78)" />
              <circle cx="10" cy="-13" r="7.5" fill="rgba(122,158,110,0.75)" />
              <circle cx="-10" cy="-23" r="7.5" fill="rgba(122,158,110,0.75)" />
              <circle cx="-10" cy="-13" r="7.5" fill="rgba(122,158,110,0.72)" />
              <circle cx="0" cy="-18" r="5.5" fill="rgba(168,215,148,0.9)" />
              <circle cx="0" cy="-18" r="2.5" fill="rgba(62,102,50,0.88)" />
              <line
                x1="0"
                y1="-8"
                x2="0"
                y2="1"
                stroke="rgba(78,128,58,0.7)"
                strokeWidth="2.8"
              />
              <path
                d="M -13 1 L -10 26 L 10 26 L 13 1 Z"
                fill="rgba(182,112,62,0.85)"
              />
              <ellipse
                cx="0"
                cy="1"
                rx="13"
                ry="5"
                fill="rgba(208,138,80,0.78)"
              />
              <ellipse
                cx="0"
                cy="0"
                rx="11"
                ry="3.8"
                fill="rgba(75,50,24,0.7)"
              />
              <ellipse
                cx="0"
                cy="26"
                rx="10"
                ry="3.2"
                fill="rgba(155,90,48,0.68)"
              />
            </g>
            {/* Near right */}
            <g transform="translate(252,350)">
              <circle cx="0" cy="-18" r="9" fill="rgba(185,148,90,0.86)" />
              <circle cx="0" cy="-28" r="7.5" fill="rgba(185,148,90,0.78)" />
              <circle cx="10" cy="-23" r="7.5" fill="rgba(185,148,90,0.78)" />
              <circle cx="10" cy="-13" r="7.5" fill="rgba(185,148,90,0.75)" />
              <circle cx="-10" cy="-23" r="7.5" fill="rgba(185,148,90,0.75)" />
              <circle cx="-10" cy="-13" r="7.5" fill="rgba(185,148,90,0.72)" />
              <circle cx="0" cy="-18" r="5.5" fill="rgba(228,198,138,0.9)" />
              <circle cx="0" cy="-18" r="2.5" fill="rgba(120,85,38,0.88)" />
              <line
                x1="0"
                y1="-8"
                x2="0"
                y2="1"
                stroke="rgba(78,128,58,0.7)"
                strokeWidth="2.8"
              />
              <path
                d="M -13 1 L -10 26 L 10 26 L 13 1 Z"
                fill="rgba(182,112,62,0.85)"
              />
              <ellipse
                cx="0"
                cy="1"
                rx="13"
                ry="5"
                fill="rgba(208,138,80,0.78)"
              />
              <ellipse
                cx="0"
                cy="0"
                rx="11"
                ry="3.8"
                fill="rgba(75,50,24,0.7)"
              />
              <ellipse
                cx="0"
                cy="26"
                rx="10"
                ry="3.2"
                fill="rgba(155,90,48,0.68)"
              />
            </g>
            {/* Far right */}
            <g transform="translate(338,342)">
              <circle cx="0" cy="-22" r="10" fill="rgba(160,130,108,0.86)" />
              <circle cx="-9" cy="-33" r="8.5" fill="rgba(160,130,108,0.78)" />
              <circle cx="9" cy="-33" r="8.5" fill="rgba(160,130,108,0.78)" />
              <circle cx="-13" cy="-21" r="8" fill="rgba(160,130,108,0.75)" />
              <circle cx="13" cy="-21" r="8" fill="rgba(160,130,108,0.75)" />
              <circle cx="0" cy="-22" r="6" fill="rgba(208,188,158,0.9)" />
              <circle cx="0" cy="-22" r="2.8" fill="rgba(100,78,55,0.88)" />
              <line
                x1="0"
                y1="-11"
                x2="0"
                y2="1"
                stroke="rgba(78,128,58,0.7)"
                strokeWidth="2.8"
              />
              <ellipse
                cx="11"
                cy="-5"
                rx="9"
                ry="5"
                fill="rgba(92,142,70,0.6)"
                transform="rotate(22 11 -5)"
              />
              <path
                d="M -13 1 L -10 26 L 10 26 L 13 1 Z"
                fill="rgba(182,112,62,0.85)"
              />
              <ellipse
                cx="0"
                cy="1"
                rx="13"
                ry="5"
                fill="rgba(208,138,80,0.78)"
              />
              <ellipse
                cx="0"
                cy="0"
                rx="11"
                ry="3.8"
                fill="rgba(75,50,24,0.7)"
              />
              <ellipse
                cx="0"
                cy="26"
                rx="10"
                ry="3.2"
                fill="rgba(155,90,48,0.68)"
              />
            </g>

            {/* Floor scatter blooms */}
            <circle cx="16" cy="406" r="6.5" fill="rgba(215,148,152,0.78)" />
            <circle cx="28" cy="396" r="5" fill="rgba(225,158,158,0.72)" />
            <circle cx="8" cy="412" r="4.5" fill="rgba(210,138,142,0.7)" />
            <circle cx="374" cy="406" r="6.5" fill="rgba(215,148,152,0.78)" />
            <circle cx="362" cy="396" r="5" fill="rgba(225,158,158,0.72)" />
            <circle cx="382" cy="412" r="4.5" fill="rgba(210,138,142,0.7)" />
            <ellipse
              cx="22"
              cy="418"
              rx="28"
              ry="10"
              fill="rgba(75,120,52,0.38)"
            />
            <ellipse
              cx="368"
              cy="416"
              rx="28"
              ry="10"
              fill="rgba(75,120,52,0.38)"
            />
          </svg>
        </div>

        {/* What's grown */}
        <div className="mx-2.5 bg-white rounded-card border border-border p-4 shadow-sm">
          <p className="font-mono text-[7.5px] uppercase tracking-[2.5px] text-muted mb-2">
            What&apos;s grown
          </p>
          <p className="font-display italic text-bark text-sm leading-relaxed">
            {whatsGrown}
          </p>
        </div>

        {/* Today's prompt */}
        {todayPrompt && (
          <div
            className="mx-2.5 rounded-card p-4"
            style={{ background: "linear-gradient(135deg, #f5ede0, #dcebd0)" }}
          >
            <p className="font-mono text-[7.5px] uppercase tracking-[2.5px] text-bark/50 mb-2">
              Today&apos;s prompt
            </p>
            <p className="font-display italic text-bark text-sm leading-relaxed mb-3">
              {todayPrompt}
            </p>
            <button
              onClick={() =>
                router.push(
                  `/journal?prompt=${encodeURIComponent(todayPrompt)}`,
                )
              }
              className="font-mono text-[7.5px] uppercase tracking-[2px] text-bark/50"
            >
              Write →
            </button>
          </div>
        )}

        {/* Right now feels hard */}
        <button
          onClick={() => {
            setShowHardMoment(true);
            setHardMomentPath("select");
          }}
          className="mx-2.5 w-[calc(100%-1.25rem)] bg-bark/[0.04] border border-dashed border-bark/15 rounded-card px-4 py-[15px] flex items-center justify-between active:scale-[0.98] transition-transform"
        >
          <span className="font-display italic text-bark/60 text-sm">
            Right now feels hard
          </span>
          <span className="text-bark/20 text-lg">→</span>
        </button>
      </div>

      {/* Hard moment bottom sheet */}
      {showHardMoment && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
          onClick={() => {
            setShowHardMoment(false);
            setHardMomentPath(null);
            setReceiptsEntry(null);
          }}
        >
          <div
            className="w-full max-w-app bg-cream rounded-t-2xl p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-8 h-0.5 rounded-full bg-bark/15 mx-auto mb-5" />

            {hardMomentPath === "select" && (
              <>
                <p className="font-display italic text-bark text-[18px] mb-5 leading-snug">
                  What&apos;s happening right now?
                </p>
                <div className="space-y-2">
                  {[
                    {
                      label: "I want to reach out to them",
                      path: "reach_out",
                    },
                    {
                      label: "I'm looking at their photos or profile",
                      path: "reach_out",
                    },
                    { label: "I'm stuck in a thought loop", path: "spiral" },
                    {
                      label: "I just feel bad and don't know why",
                      path: "spiral",
                    },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => {
                        setHardMomentPath(opt.path as "reach_out" | "spiral");
                        if (opt.path === "reach_out") void loadReceipts();
                      }}
                      className="w-full text-left bg-white border border-border rounded-card px-4 py-3 text-sm text-bark active:scale-[0.98] transition-transform"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setShowHardMoment(false);
                    setHardMomentPath(null);
                    setReceiptsEntry(null);
                  }}
                  className="mt-4 w-full text-xs text-muted py-2"
                >
                  Close
                </button>
              </>
            )}

            {hardMomentPath === "reach_out" && (
              <>
                {receiptsEntry ? (
                  <div className="bg-bark rounded-card p-4 mb-4">
                    <p className="font-mono text-[7px] uppercase tracking-widest text-cream/50 mb-1">
                      You wrote this when you were clear
                    </p>
                    <p className="font-display italic text-cream text-sm leading-relaxed">
                      {receiptsEntry}
                    </p>
                  </div>
                ) : (
                  <div className="bg-bark/8 rounded-card p-4 mb-4">
                    <p className="text-sm text-bark/60 leading-relaxed">
                      You haven&apos;t written your receipts yet. Head to
                      Journal &gt; Commitments when you&apos;re ready.
                    </p>
                  </div>
                )}
                <p className="text-sm text-bark/70 leading-relaxed mb-4">
                  The urge to reach out is the brain seeking the dopamine hit
                  it&apos;s come to expect. It will pass in about 20 minutes.
                  You don&apos;t have to act on it.
                </p>
                <textarea
                  value={hardMomentText}
                  onChange={(e) => setHardMomentText(e.target.value)}
                  placeholder="What are you really missing right now?"
                  rows={3}
                  autoFocus
                  className="w-full bg-white rounded-card p-4 text-sm text-bark placeholder:text-muted/50 border border-border focus:outline-none focus:border-clay/40 resize-none leading-relaxed mb-3"
                />
                <button
                  onClick={() => void saveHardMoment()}
                  disabled={!hardMomentText.trim() || savingHardMoment}
                  className="w-full bg-bark text-cream rounded-card py-3 text-sm font-medium disabled:opacity-40 mb-2"
                >
                  {savingHardMoment ? "Writing..." : "Write through it"}
                </button>
                <button
                  onClick={() => {
                    setShowHardMoment(false);
                    setHardMomentPath(null);
                    setReceiptsEntry(null);
                  }}
                  className="w-full text-xs text-muted py-2"
                >
                  Close
                </button>
              </>
            )}

            {hardMomentPath === "spiral" && (
              <>
                {randomCommitment && (
                  <div className="bg-bark rounded-card p-4 mb-4">
                    <p className="font-mono text-[7px] uppercase tracking-widest text-cream/50 mb-1">
                      You wrote this when you were clear
                    </p>
                    <p className="font-display italic text-cream text-sm leading-relaxed">
                      {randomCommitment}
                    </p>
                  </div>
                )}
                <p className="font-display italic text-bark text-sm mb-4 leading-relaxed">
                  {GROUNDING_PROMPTS[hardMomentGroundingIdx]}
                </p>
                <textarea
                  value={hardMomentText}
                  onChange={(e) => setHardMomentText(e.target.value)}
                  placeholder="What's happening right now?"
                  rows={4}
                  autoFocus
                  className="w-full bg-white rounded-card p-4 text-sm text-bark placeholder:text-muted/50 border border-border focus:outline-none focus:border-clay/40 resize-none leading-relaxed mb-3"
                />
                <button
                  onClick={() => void saveHardMoment()}
                  disabled={!hardMomentText.trim() || savingHardMoment}
                  className="w-full bg-bark text-cream rounded-card py-3 text-sm font-medium disabled:opacity-40 mb-2"
                >
                  {savingHardMoment ? "Writing..." : "Write through it"}
                </button>
                <button
                  onClick={() => {
                    setShowHardMoment(false);
                    setHardMomentPath(null);
                    setReceiptsEntry(null);
                  }}
                  className="w-full text-xs text-muted py-2"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
