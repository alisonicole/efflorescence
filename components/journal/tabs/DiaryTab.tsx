"use client";

import { useState } from "react";
import EntryEditor from "@/components/journal/EntryEditor";
import EntryList from "@/components/journal/EntryList";

type ExcludableType = "standard" | "rewrite" | "receipts" | "the_why";

const DIARY_EXCLUDE_TYPES: ExcludableType[] = [
  "rewrite",
  "receipts",
  "the_why",
];

export default function DiaryTab({
  initialPrompt = "",
}: {
  initialPrompt?: string;
}) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-2.5 pb-4">
      <EntryEditor
        prompt={initialPrompt}
        onSaved={() => setRefreshKey((k) => k + 1)}
      />
      <EntryList excludeTypes={DIARY_EXCLUDE_TYPES} refreshKey={refreshKey} />
    </div>
  );
}
