# Journal Tab Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collapse the journal section from six separate routes into one page with four inline tabs: Diary, Full Picture, Rewrite Room, and The Why.

**Architecture:** `/journal/page.tsx` becomes a tab shell with `activeTab` state only. Each tab is a dedicated client component in `components/journal/tabs/`. All writing, fetching, and sub-states happen inside each tab component with no navigation away. Six sub-routes are deleted.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Parse (backend), Vitest (tests)

---

## File Structure

**Create:**

- `components/journal/tabs/DiaryTab.tsx` - inline write form + entry list
- `components/journal/tabs/FullPictureTab.tsx` - thin wrapper around FullPicture
- `components/journal/tabs/RewriteTab.tsx` - history-first rewrite room with inline two-pass form
- `components/journal/tabs/WhyTab.tsx` - dark prompt card + why entries list

**Modify:**

- `components/journal/EntryList.tsx:9-12` - add `refreshKey?: number` prop and `"the_why"` to excludeTypes union
- `app/(app)/journal/page.tsx` - replace entire file with 4-tab shell

**Delete:**

- `app/(app)/journal/new/page.tsx`
- `app/(app)/journal/rewrite/page.tsx`
- `app/(app)/journal/receipts/page.tsx`
- `app/(app)/journal/the-why/page.tsx`
- `app/(app)/journal/the-why/new/page.tsx`
- `app/(app)/journal/the-why/full-picture/page.tsx`
- `components/journal/RewriteRoom.tsx`

---

### Task 1: Update EntryList to support refreshKey and the_why exclusion

**Files:**

- Modify: `components/journal/EntryList.tsx`

- [ ] **Step 1: Update the props interface and filtering cast**

Replace the file content:

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import type { JournalEntry } from "@/types";
import EntryCard from "./EntryCard";

type ExcludableType = "standard" | "rewrite" | "receipts" | "the_why";

interface EntryListProps {
  excludeTypes?: Array<ExcludableType>;
  refreshKey?: number;
}

export default function EntryList({
  excludeTypes,
  refreshKey,
}: EntryListProps) {
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
                (e.entryType ?? "standard") as ExcludableType,
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
  }, [loadEntries, refreshKey]);

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
```

- [ ] **Step 2: Verify TypeScript is clean**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Run existing tests to confirm no regressions**

Run: `npx vitest run`
Expected: all tests pass

- [ ] **Step 4: Commit**

```bash
git add components/journal/EntryList.tsx
git commit -m "feat(journal): add refreshKey prop and the_why exclusion to EntryList"
```

---

### Task 2: Create DiaryTab

**Files:**

- Create: `components/journal/tabs/DiaryTab.tsx`

Context: `EntryEditor` lives at `components/journal/EntryEditor.tsx`. It accepts `prompt: string`, `spiralContext?: Spiral`, and `onSaved: () => void`. It already has `px-2.5` padding internally. Passing an empty string for `prompt` hides the prompt block.

- [ ] **Step 1: Create the tab component**

Create `components/journal/tabs/DiaryTab.tsx`:

```tsx
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
```

- [ ] **Step 2: Verify TypeScript is clean**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/journal/tabs/DiaryTab.tsx
git commit -m "feat(journal): add DiaryTab component"
```

---

### Task 3: Create FullPictureTab

**Files:**

- Create: `components/journal/tabs/FullPictureTab.tsx`

Context: `FullPicture` at `components/journal/FullPicture.tsx` is a self-contained client component that loads its own data. It takes no props.

- [ ] **Step 1: Create the tab component**

Create `components/journal/tabs/FullPictureTab.tsx`:

```tsx
import FullPicture from "@/components/journal/FullPicture";

export default function FullPictureTab() {
  return (
    <div className="pt-2 pb-4 px-2.5">
      <FullPicture />
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript is clean**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/journal/tabs/FullPictureTab.tsx
git commit -m "feat(journal): add FullPictureTab component"
```

---

### Task 4: Create RewriteTab

**Files:**

- Create: `components/journal/tabs/RewriteTab.tsx`

Context: `PROMPTS` in `lib/prompts.ts` is `Record<Spiral, string[]>`. `PROMPTS["the_but_he"][0]` is the pass-two prompt for The But He. `PROMPTS["the_what_if"][0]` is the pass-two prompt for The What If. Existing rewrite entries in Parse have `entryType: "rewrite"`, `spiralContext`, `pass1Content`, and `content` (pass two text).

- [ ] **Step 1: Create the tab component**

Create `components/journal/tabs/RewriteTab.tsx`:

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import { PROMPTS } from "@/lib/prompts";

type RewriteSpiral = "the_but_he" | "the_what_if";

interface RewriteEntry {
  objectId: string;
  spiral: RewriteSpiral;
  pass1Content: string;
  content: string;
  createdAt: Date;
}

const SPIRAL_LABELS: Record<RewriteSpiral, string> = {
  the_but_he: "The But He",
  the_what_if: "The What If",
};

export default function RewriteTab() {
  const [selectedSpiral, setSelectedSpiral] =
    useState<RewriteSpiral>("the_but_he");
  const [pass, setPass] = useState<1 | 2>(1);
  const [pass1Text, setPass1Text] = useState("");
  const [pass2Text, setPass2Text] = useState("");
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<RewriteEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadHistory = useCallback(async () => {
    initParse();
    const user = Parse.User.current();
    if (!user) {
      setLoadingHistory(false);
      return;
    }
    try {
      const query = new Parse.Query("JournalEntry");
      query.equalTo("user", user);
      query.equalTo("entryType", "rewrite");
      query.descending("createdAt");
      const results = await query.find();
      setHistory(
        results.map((r) => ({
          objectId: r.id,
          spiral: r.get("spiralContext") as RewriteSpiral,
          pass1Content: (r.get("pass1Content") as string) ?? "",
          content: r.get("content") as string,
          createdAt: r.createdAt!,
        })),
      );
    } catch {
      // silent
    } finally {
      setLoadingHistory(false);
    }
  }, [refreshKey]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  async function handleComplete() {
    if (!pass2Text.trim() || saving) return;
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
      entry.set("content", pass2Text.trim());
      entry.set("pass1Content", pass1Text.trim());
      entry.set("prompt", PROMPTS[selectedSpiral][0]);
      entry.set("spiralContext", selectedSpiral);
      entry.set("entryType", "rewrite");
      entry.setACL(new Parse.ACL(user));
      await entry.save();
      setPass1Text("");
      setPass2Text("");
      setPass(1);
      setRefreshKey((k) => k + 1);
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="pb-4">
      {/* New rewrite form */}
      <div className="mx-2.5 mb-4 bg-white rounded-card p-4 border border-border shadow-sm">
        <p className="font-mono text-[9px] uppercase tracking-[3px] text-soil opacity-60 mb-3">
          New rewrite
        </p>
        <div className="flex gap-2 mb-4">
          {(["the_but_he", "the_what_if"] as RewriteSpiral[]).map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSpiral(s)}
              className={`flex-1 py-2 text-[9px] font-mono tracking-widest uppercase rounded-full border transition-colors ${
                selectedSpiral === s
                  ? "bg-bark text-cream border-bark"
                  : "bg-transparent text-muted border-border"
              }`}
            >
              {SPIRAL_LABELS[s]}
            </button>
          ))}
        </div>

        {pass === 1 ? (
          <>
            <p className="font-mono text-[9px] uppercase tracking-[3px] text-soil opacity-60 mb-1">
              Pass one
            </p>
            <p className="font-display text-sm italic font-light text-bark mb-3">
              &quot;Write the version you keep replaying.&quot;
            </p>
            <textarea
              value={pass1Text}
              onChange={(e) => setPass1Text(e.target.value)}
              placeholder="Write whatever comes. No editing."
              rows={6}
              className="w-full bg-stone-50 rounded-card p-3 text-sm text-bark placeholder:text-muted/60 focus:outline-none resize-none leading-relaxed"
            />
            <button
              onClick={() => setPass(2)}
              disabled={!pass1Text.trim()}
              className="mt-3 w-full bg-bark text-cream rounded-card py-2.5 text-sm font-medium disabled:opacity-40"
            >
              Next
            </button>
          </>
        ) : (
          <>
            <p className="font-mono text-[9px] uppercase tracking-[3px] text-soil opacity-60 mb-1">
              Pass two
            </p>
            <p className="font-display text-sm italic font-light text-bark mb-3">
              &quot;Now write the part you&apos;ve been leaving out.&quot;
            </p>
            <div className="bg-stone-50 rounded-card p-3 border-l-2 border-clay/40 mb-3">
              <p className="text-xs text-muted italic">
                {PROMPTS[selectedSpiral][0]}
              </p>
            </div>
            <textarea
              value={pass2Text}
              onChange={(e) => setPass2Text(e.target.value)}
              placeholder="The full version."
              rows={6}
              className="w-full bg-stone-50 rounded-card p-3 text-sm text-bark placeholder:text-muted/60 focus:outline-none resize-none leading-relaxed"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setPass(1)}
                className="px-4 py-2.5 text-sm text-muted border border-border rounded-card"
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                disabled={!pass2Text.trim() || saving}
                className="flex-1 bg-bark text-cream rounded-card py-2.5 text-sm font-medium disabled:opacity-40"
              >
                {saving ? "Saving..." : "Complete"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* History */}
      <p className="font-mono text-[9px] uppercase tracking-[3px] text-soil opacity-60 mx-2.5 mb-3">
        Past rewrites
      </p>
      {loadingHistory && (
        <p className="text-xs text-muted px-2.5">Loading...</p>
      )}
      {!loadingHistory && history.length === 0 && (
        <div className="mx-2.5 py-6 text-center">
          <p className="font-display text-base italic font-light text-bark">
            Two passes. Full truth.
          </p>
        </div>
      )}
      <div className="space-y-2.5 px-2.5">
        {history.map((entry) => (
          <div
            key={entry.objectId}
            className="bg-white rounded-card p-4 shadow-sm"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="font-mono text-[8px] uppercase tracking-widest bg-bark/10 text-bark px-2 py-1 rounded-full">
                {SPIRAL_LABELS[entry.spiral] ?? entry.spiral}
              </span>
              <span className="font-mono text-[9px] text-muted">
                {entry.createdAt.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted mb-1">
              Pass one
            </p>
            <p className="text-sm text-bark leading-relaxed mb-3 line-clamp-3">
              {entry.pass1Content}
            </p>
            <hr className="border-border mb-3" />
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted mb-1">
              Pass two
            </p>
            <p className="text-sm text-bark leading-relaxed line-clamp-3">
              {entry.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript is clean**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/journal/tabs/RewriteTab.tsx
git commit -m "feat(journal): add RewriteTab with history-first inline rewrite flow"
```

---

### Task 5: Create WhyTab

**Files:**

- Create: `components/journal/tabs/WhyTab.tsx`

Context: `WhyEntryCard` at `components/journal/WhyEntryCard.tsx` takes `entry: WhyEntry` (has `objectId`, `content`, `createdAt`). It uses `isLocked` and `hoursUntilLock` from `lib/the-why.ts` to show a sealed/editable state. Existing receipts entries have `entryType: "receipts"` - query for both `"the_why"` and `"receipts"` using Parse `containedIn`.

- [ ] **Step 1: Create the tab component**

Create `components/journal/tabs/WhyTab.tsx`:

```tsx
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
  }, [refreshKey]);

  useEffect(() => {
    void load();
  }, [load]);

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
```

- [ ] **Step 2: Verify TypeScript is clean**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/journal/tabs/WhyTab.tsx
git commit -m "feat(journal): add WhyTab with inline write form and receipts + the_why history"
```

---

### Task 6: Rewrite /journal/page.tsx as 4-tab shell

**Files:**

- Modify: `app/(app)/journal/page.tsx`

Context: The current page.tsx has 2 tabs ("garden" and "rewrite") and loads `todaySpiral` and `rewriteCount` from Parse. All of that is replaced. The four tabs are Diary, Full Picture, Rewrite Room, The Why. Each tab component handles its own data. Tab label font size is `text-[8.5px]` to fit four labels in the strip.

- [ ] **Step 1: Replace the entire file**

```tsx
"use client";

import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import DiaryTab from "@/components/journal/tabs/DiaryTab";
import FullPictureTab from "@/components/journal/tabs/FullPictureTab";
import RewriteTab from "@/components/journal/tabs/RewriteTab";
import WhyTab from "@/components/journal/tabs/WhyTab";

type JournalTab = "diary" | "full_picture" | "rewrite" | "why";

const TABS: { id: JournalTab; label: string }[] = [
  { id: "diary", label: "Diary" },
  { id: "full_picture", label: "Full Picture" },
  { id: "rewrite", label: "Rewrite Room" },
  { id: "why", label: "The Why" },
];

export default function JournalPage() {
  const [activeTab, setActiveTab] = useState<JournalTab>("diary");

  return (
    <>
      <TopBar title="journal" subtitle="Your entries" />
      <div className="px-2.5 pt-2 pb-3">
        <div className="flex rounded-card overflow-hidden border border-border">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-[8.5px] font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-bark text-cream"
                  : "bg-white text-bark"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {activeTab === "diary" && <DiaryTab />}
      {activeTab === "full_picture" && <FullPictureTab />}
      {activeTab === "rewrite" && <RewriteTab />}
      {activeTab === "why" && <WhyTab />}
    </>
  );
}
```

- [ ] **Step 2: Verify TypeScript is clean**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Run existing tests**

Run: `npx vitest run`
Expected: all tests pass

- [ ] **Step 4: Commit**

```bash
git add "app/(app)/journal/page.tsx"
git commit -m "feat(journal): replace 2-tab shell with 4-tab inline journal"
```

---

### Task 7: Delete sub-routes and RewriteRoom component

**Files:**

- Delete: `app/(app)/journal/new/page.tsx` and directory
- Delete: `app/(app)/journal/rewrite/page.tsx` and directory
- Delete: `app/(app)/journal/receipts/page.tsx` and directory
- Delete: `app/(app)/journal/the-why/` (entire directory tree)
- Delete: `components/journal/RewriteRoom.tsx`

- [ ] **Step 1: Delete sub-route files**

```bash
rm -rf "app/(app)/journal/new"
rm -rf "app/(app)/journal/rewrite"
rm -rf "app/(app)/journal/receipts"
rm -rf "app/(app)/journal/the-why"
rm "components/journal/RewriteRoom.tsx"
```

- [ ] **Step 2: Verify nothing else imports these files**

```bash
grep -r "RewriteRoom\|journal/new\|journal/rewrite\|journal/receipts\|journal/the-why" --include="*.tsx" --include="*.ts" . | grep -v node_modules | grep -v ".next"
```

Expected: no output (nothing imports the deleted files). If any results appear, update those files to remove the import.

- [ ] **Step 3: Verify TypeScript is clean**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Run existing tests**

Run: `npx vitest run`
Expected: all tests pass

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore(journal): delete sub-routes and RewriteRoom component"
```
