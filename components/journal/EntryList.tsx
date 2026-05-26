"use client";

import { useCallback, useEffect, useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import type { JournalEntry } from "@/types";
import EntryCard from "./EntryCard";

interface EntryListProps {
  excludeTypes?: Array<"standard" | "rewrite" | "receipts">;
}

export default function EntryList({ excludeTypes }: EntryListProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

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
      query.limit(50);
      const results = await query.find();

      const mapped: JournalEntry[] = results.map((e) => ({
        objectId: e.id,
        content: e.get("content"),
        prompt: e.get("prompt") ?? "",
        spiralContext: e.get("spiralContext"),
        entryType: e.get("entryType"),
        createdAt: e.createdAt!,
      }));

      const filtered = excludeTypes
        ? mapped.filter(
            (e) =>
              !excludeTypes.includes(
                (e.entryType ?? "standard") as
                  | "standard"
                  | "rewrite"
                  | "receipts",
              ),
          )
        : mapped;

      setEntries(filtered);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, [excludeTypes]);

  useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  if (loading)
    return <p className="text-xs text-muted px-2.5">Loading entries...</p>;
  if (entries.length === 0)
    return (
      <p className="text-xs text-muted px-2.5 py-4 text-center">
        Nothing here yet. Your first entry is waiting.
      </p>
    );

  return (
    <div className="space-y-2.5 px-2.5">
      {entries.map((entry) => (
        <EntryCard key={entry.objectId} entry={entry} />
      ))}
    </div>
  );
}
