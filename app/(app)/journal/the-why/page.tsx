"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import TopBar from "@/components/layout/TopBar";
import WhyEntryCard from "@/components/journal/WhyEntryCard";
import type { WhyEntry } from "@/types";

export default function TheWhyPage() {
  const [entries, setEntries] = useState<WhyEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    initParse();
    const user = Parse.User.current();
    if (!user) return;
    const query = new Parse.Query("JournalEntry");
    query.equalTo("user", user);
    query.equalTo("entryType", "the_why");
    query.ascending("createdAt");
    const results = await query.find();
    setEntries(
      results.map((r) => ({
        objectId: r.id,
        content: r.get("content") as string,
        createdAt: r.createdAt!,
      })),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <TopBar
        title="the why"
        subtitle="your words, over time"
        action={
          <Link
            href="/journal/the-why/new"
            className="text-xs text-bark underline"
          >
            + new
          </Link>
        }
      />
      <div className="pt-2 pb-4 px-2.5 space-y-3">
        {loading && (
          <p className="font-mono text-[9px] text-muted">Loading...</p>
        )}
        {!loading && entries.length === 0 && (
          <>
            <p className="font-display text-base italic font-light text-bark">
              &quot;Write down what happened. You&apos;ll want this
              record.&quot;
            </p>
            <Link
              href="/journal/the-why/new"
              className="block w-full bg-bark text-cream rounded-card py-3 text-sm font-medium text-center"
            >
              Write your first entry
            </Link>
          </>
        )}
        {entries.map((entry) => (
          <WhyEntryCard key={entry.objectId} entry={entry} />
        ))}
        {entries.length > 0 && (
          <Link
            href="/journal/the-why/full-picture"
            className="block w-full border border-border text-bark rounded-card py-3 text-sm font-medium text-center"
          >
            The Full Picture
          </Link>
        )}
      </div>
    </>
  );
}
