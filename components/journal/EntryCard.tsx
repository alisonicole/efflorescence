"use client";

import { useState } from "react";
import type { JournalEntry } from "@/types";

function firstSentence(text: string): string {
  const match = text.match(/^.+?[.!?](?:\s|$)/);
  return match ? match[0].trim() : text.slice(0, 120).trim();
}

export default function EntryCard({ entry }: { entry: JournalEntry }) {
  const full = entry.content ?? "";
  const preview = firstSentence(full);
  const hasMore = full.length > preview.length;
  const [expanded, setExpanded] = useState(false);

  const date = new Date(entry.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-card p-4 shadow-sm">
      <p className="text-[10px] uppercase tracking-widest text-muted mb-1">
        {date}
      </p>
      {entry.prompt && (
        <p className="text-[11px] italic text-muted border-l-2 border-border pl-2 mb-2">
          {entry.prompt}
        </p>
      )}
      <p className="text-sm text-bark leading-relaxed">
        {expanded ? full : preview}
      </p>
      {hasMore && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-2 flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-muted/60 hover:text-muted transition-colors"
        >
          <span>{expanded ? "Show less" : "Read more"}</span>
          <span
            className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          >
            ▾
          </span>
        </button>
      )}
    </div>
  );
}
