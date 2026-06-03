"use client";

import { useCallback, useEffect, useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import type { JournalEntry } from "@/types";
import EntryEditor from "@/components/journal/EntryEditor";
import JournalTree from "@/components/journal/JournalTree";
import EntryCard from "@/components/journal/EntryCard";

const DIARY_EXCLUDE_TYPES = ["rewrite", "receipts", "the_why"];

export default function DiaryTab({
  initialPrompt = "",
}: {
  initialPrompt?: string;
}) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchive, setShowArchive] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadEntries = useCallback(async () => {
    initParse();
    const user = Parse.User.current();
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const ParseEntry = Parse.Object.extend("JournalEntry");
      const query = new Parse.Query(ParseEntry);
      query.equalTo("user", user);
      query.descending("createdAt");
      query.limit(200);
      const results = await query.find();

      const mapped: JournalEntry[] = results
        .map((e) => ({
          objectId: e.id,
          content: e.get("content") as string,
          prompt: (e.get("prompt") as string) ?? "",
          spiralContext: e.get("spiralContext"),
          entryType: e.get("entryType"),
          createdAt: e.createdAt!,
        }))
        .filter(
          (e) => !DIARY_EXCLUDE_TYPES.includes(e.entryType ?? "standard"),
        );

      setEntries(mapped);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEntries();
  }, [loadEntries, refreshKey]);

  return (
    <div className="space-y-2.5 pb-4">
      <EntryEditor
        prompt={initialPrompt}
        onSaved={() => {
          setRefreshKey((k) => k + 1);
          setShowArchive(false);
        }}
      />

      {loading ? (
        <p className="text-xs text-muted px-2.5 py-4 text-center">
          Growing your tree...
        </p>
      ) : showArchive ? (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-2.5">
            <span className="font-mono text-[8px] uppercase tracking-[2.5px] text-bark/60">
              All entries
            </span>
            <button
              onClick={() => setShowArchive(false)}
              className="font-mono text-[8px] uppercase tracking-[2px] text-bark/40 hover:text-bark/70 transition-colors"
            >
              Back to tree
            </button>
          </div>
          {entries.length === 0 ? (
            <p className="text-xs text-muted px-2.5 py-4 text-center">
              Nothing here yet. Your first entry is waiting.
            </p>
          ) : (
            entries.map((entry) => (
              <EntryCard key={entry.objectId} entry={entry} />
            ))
          )}
        </div>
      ) : (
        <JournalTree
          entries={entries}
          onShowArchive={() => setShowArchive(true)}
        />
      )}
    </div>
  );
}
