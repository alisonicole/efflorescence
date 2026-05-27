"use client";

import { useCallback, useEffect, useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import WhyEntryCard from "@/components/journal/WhyEntryCard";
import type { WhyEntry } from "@/types";

export default function WhyTab() {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [entries, setEntries] = useState<WhyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const load = useCallback(async () => {
    initParse();
    const user = Parse.User.current();
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const query = new Parse.Query("JournalEntry");
      query.equalTo("user", user);
      query.containedIn("entryType", ["the_why", "receipts"]);
      query.ascending("createdAt");
      query.limit(50);
      const results = await query.find();
      setEntries(
        results.map((r) => ({
          objectId: r.id,
          content: r.get("content") as string,
          createdAt: r.createdAt!,
        })),
      );
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  async function handleSave() {
    if (!text.trim() || saving) return;
    setSaving(true);
    initParse();
    const user = Parse.User.current();
    if (!user) {
      setSaving(false);
      return;
    }
    try {
      const ParseEntry = Parse.Object.extend("JournalEntry");
      const entry = new ParseEntry();
      entry.set("user", user);
      entry.set("content", text.trim());
      entry.set("prompt", "Why it ended. In your words.");
      entry.set("entryType", "the_why");
      entry.setACL(new Parse.ACL(user));
      await entry.save();
      setText("");
      setRefreshKey((k) => k + 1);
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="pb-4">
      <div className="mx-2.5 mb-4 bg-bark text-cream rounded-card p-4">
        <p className="font-mono text-[9px] uppercase tracking-[3px] opacity-50 mb-1">
          Why it ended
        </p>
        <p className="font-display text-base italic font-light mb-3">
          &quot;Write it down. You&apos;ll want this record.&quot;
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="In your own words..."
          rows={5}
          className="w-full bg-white/10 rounded-card p-3 text-sm text-cream placeholder:text-cream/40 focus:outline-none resize-none leading-relaxed"
        />
        <button
          onClick={handleSave}
          disabled={!text.trim() || saving}
          className="mt-2 w-full bg-cream text-bark rounded-card py-2.5 text-sm font-medium disabled:opacity-40"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {loading && <p className="text-xs text-muted px-2.5">Loading...</p>}
      {!loading && entries.length === 0 && (
        <p className="text-xs text-muted px-2.5 py-4 text-center">
          Nothing here yet.
        </p>
      )}
      <div className="space-y-2.5 px-2.5">
        {entries.map((entry) => (
          <WhyEntryCard key={entry.objectId} entry={entry} />
        ))}
      </div>
    </div>
  );
}
