"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";

interface Affirmation {
  objectId: string;
  content: string;
  createdAt: Date;
}

export default function AffirmationsTab() {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [entries, setEntries] = useState<Affirmation[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredIdx, setFeaturedIdx] = useState(0);
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
      query.equalTo("entryType", "affirmation");
      query.descending("createdAt");
      query.limit(100);
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

  useEffect(() => {
    if (entries.length > 0) {
      setFeaturedIdx(Math.floor(Math.random() * entries.length));
    }
  }, [entries.length]);

  const featured = useMemo(
    () => (entries.length > 0 ? entries[featuredIdx % entries.length] : null),
    [entries, featuredIdx],
  );

  function shuffle() {
    if (entries.length < 2) return;
    setFeaturedIdx((i) => (i + 1) % entries.length);
  }

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
      entry.set("entryType", "affirmation");
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
      {/* Featured affirmation */}
      {featured && (
        <button
          onClick={shuffle}
          className="mx-2.5 mb-4 w-[calc(100%-20px)] bg-bark text-cream rounded-card p-5 text-left"
        >
          <p className="font-mono text-[9px] uppercase tracking-[3px] opacity-50 mb-2">
            Your affirmation
          </p>
          <p className="font-display text-lg italic font-light leading-snug">
            &ldquo;{featured.content}&rdquo;
          </p>
          {entries.length > 1 && (
            <p className="mt-3 font-mono text-[8px] uppercase tracking-widest opacity-30">
              Tap to see another
            </p>
          )}
        </button>
      )}

      {!featured && !loading && (
        <div className="mx-2.5 mb-4 bg-bark/8 rounded-card p-5 text-center">
          <p className="font-display text-base italic text-muted">
            Add your first affirmation below.
          </p>
        </div>
      )}

      {/* Add new */}
      <div className="mx-2.5 mb-4 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void handleSave();
          }}
          placeholder="I am..."
          className="flex-1 bg-white rounded-card px-4 py-3 text-sm text-bark placeholder:text-muted/60 border border-border focus:outline-none focus:border-clay/40"
        />
        <button
          onClick={handleSave}
          disabled={!text.trim() || saving}
          className="bg-bark text-cream rounded-card px-4 py-3 text-sm font-medium disabled:opacity-40 whitespace-nowrap"
        >
          {saving ? "..." : "Add"}
        </button>
      </div>

      {/* Library */}
      {loading && (
        <p className="font-mono text-[9px] text-muted px-2.5">Loading...</p>
      )}
      {!loading && entries.length > 0 && (
        <div className="space-y-2 px-2.5">
          <p className="font-mono text-[9px] uppercase tracking-widest text-muted mb-2">
            Your library ({entries.length})
          </p>
          {entries.map((entry) => (
            <div
              key={entry.objectId}
              className="bg-white rounded-card px-4 py-3 shadow-sm border border-border"
            >
              <p className="text-sm text-bark leading-relaxed">
                {entry.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
