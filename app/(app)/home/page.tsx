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
import GardenScene from "@/components/garden/GardenScene";

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

        {/* Garden */}
        <div className="pt-3">
          <GardenScene habits={habits} streaks={streaks} showLabels={false} />
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
