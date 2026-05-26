"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import type { Spiral } from "@/types";
import { SPIRAL_LABELS } from "@/types";
import TopBar from "@/components/layout/TopBar";
import EntryList from "@/components/journal/EntryList";

type JournalTab = "garden" | "rewrite";

const REWRITE_SPIRALS: Spiral[] = ["the_but_he", "the_what_if"];

export default function JournalPage() {
  const [activeTab, setActiveTab] = useState<JournalTab>("garden");
  const [todaySpiral, setTodaySpiral] = useState<Spiral | undefined>();
  const [rewriteCount, setRewriteCount] = useState(0);

  const loadData = useCallback(async () => {
    initParse();
    const user = Parse.User.current();
    if (!user) return;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const checkInQuery = new Parse.Query("CheckIn");
      checkInQuery.equalTo("user", user);
      checkInQuery.greaterThanOrEqualTo("date", today);
      checkInQuery.lessThan("date", tomorrow);
      checkInQuery.limit(1);
      const checkIn = await checkInQuery.first();
      if (checkIn) setTodaySpiral(checkIn.get("spiral") as Spiral);

      const rewriteQuery = new Parse.Query("JournalEntry");
      rewriteQuery.equalTo("user", user);
      rewriteQuery.equalTo("entryType", "rewrite");
      const count = await rewriteQuery.count();
      setRewriteCount(count);
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const showRewritePrompt =
    todaySpiral && REWRITE_SPIRALS.includes(todaySpiral);

  return (
    <>
      <TopBar title="journal" subtitle="Your entries" />

      <div className="px-2.5 pt-2 pb-3">
        <div className="flex rounded-card overflow-hidden border border-border">
          <button
            onClick={() => setActiveTab("garden")}
            className={`flex-1 py-2.5 text-[11px] font-medium transition-colors ${
              activeTab === "garden"
                ? "bg-bark text-cream"
                : "bg-white text-bark"
            }`}
          >
            Garden
          </button>
          <button
            onClick={() => setActiveTab("rewrite")}
            className={`flex-1 py-2.5 text-[11px] font-medium transition-colors ${
              activeTab === "rewrite"
                ? "bg-bark text-cream"
                : "bg-white text-bark"
            }`}
          >
            Rewrite Room
          </button>
        </div>
      </div>

      {activeTab === "garden" && (
        <div className="space-y-2.5 pb-4">
          {showRewritePrompt && todaySpiral && (
            <div className="mx-2.5 bg-bark text-cream rounded-card p-4">
              <p className="font-mono text-[9px] uppercase tracking-widest opacity-60 mb-1">
                Today's spiral
              </p>
              <p className="font-display text-base italic mb-3">
                {SPIRAL_LABELS[todaySpiral]} - this one has two sides.
              </p>
              <Link
                href={`/journal/rewrite?spiral=${todaySpiral}`}
                className="block w-full bg-cream text-bark rounded-card py-2.5 text-sm text-center font-medium"
              >
                Enter the Rewrite Room
              </Link>
            </div>
          )}
          <div className="px-2.5">
            <Link
              href="/journal/new"
              className="block w-full bg-bark text-cream rounded-card py-3 text-sm text-center font-medium"
            >
              + New entry
            </Link>
          </div>
          <EntryList excludeTypes={["rewrite", "receipts"]} />
        </div>
      )}

      {activeTab === "rewrite" && (
        <div className="space-y-2.5 pb-4 px-2.5">
          <p className="font-mono text-[9px] uppercase tracking-[3px] text-soil opacity-60">
            {rewriteCount === 0
              ? "No rewrites yet"
              : `You have completed ${rewriteCount} rewrite${rewriteCount === 1 ? "" : "s"}.`}
          </p>

          <Link
            href="/journal/rewrite?spiral=the_but_he"
            className="block bg-white rounded-card p-4 shadow-sm"
          >
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted mb-1">
              The But He
            </p>
            <p className="text-sm text-bark">I love someone who hurt me.</p>
          </Link>

          <Link
            href="/journal/rewrite?spiral=the_what_if"
            className="block bg-white rounded-card p-4 shadow-sm"
          >
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted mb-1">
              The What If
            </p>
            <p className="text-sm text-bark">Maybe he was the one.</p>
          </Link>

          <Link
            href="/journal/receipts"
            className="block bg-white rounded-card p-4 shadow-sm border border-border/60"
          >
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted mb-1">
              The Receipts
            </p>
            <p className="text-sm text-bark">Why it ended. In your words.</p>
          </Link>
        </div>
      )}
    </>
  );
}
