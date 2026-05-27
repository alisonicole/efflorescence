"use client";

import { useState } from "react";
import EntryEditor from "@/components/journal/EntryEditor";
import EntryList from "@/components/journal/EntryList";

export default function DiaryTab() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-2.5 pb-4">
      <EntryEditor prompt="" onSaved={() => setRefreshKey((k) => k + 1)} />
      <EntryList
        excludeTypes={["rewrite", "receipts", "the_why"]}
        refreshKey={refreshKey}
      />
    </div>
  );
}
