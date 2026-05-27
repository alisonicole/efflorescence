# Journal Tab Restructure Design

## Goal

Collapse the journal section from six separate routes into one page with four inline tabs: Diary, Full Picture, Rewrite Room, and The Why. Everything happens in-page with no navigation away.

## Architecture

`/journal/page.tsx` is the tab shell, owning only `activeTab` state. Each tab is a dedicated client component in `components/journal/tabs/`: `DiaryTab`, `FullPictureTab`, `RewriteTab`, `WhyTab`. Each tab manages its own data loading, write forms, and sub-states. The existing leaf components (`EntryEditor`, `EntryList`, `FullPicture`, `RewriteRoom`, `WhyEntryCard`) are reused or lightly adapted.

**Routes deleted:**

- `app/(app)/journal/new/`
- `app/(app)/journal/rewrite/`
- `app/(app)/journal/receipts/`
- `app/(app)/journal/the-why/`
- `app/(app)/journal/the-why/new/`
- `app/(app)/journal/the-why/full-picture/`

## Tab: Diary

Always shows an inline write area at the top (textarea + "Plant this entry" button). Below it, a chronological list of standard entries fetched from Parse (`entryType` is undefined/null, excludes `rewrite`, `receipts`, and `the_why`). Saving a new entry re-fetches the list in place. No navigation. `EntryList.excludeTypes` is extended to also accept `"the_why"` as a valid value.

Uses: `EntryEditor` (already accepts `onSaved` callback). `EntryList` is reused with a `refreshKey: number` prop added - DiaryTab increments `refreshKey` on save, which triggers a re-fetch inside EntryList.

## Tab: Full Picture

Renders `<FullPicture />` unchanged. No changes to the component needed.

## Tab: Rewrite Room

History-first layout (Option C from mockup).

**Top section - new rewrite form:**

- Two spiral chips: "The But He" / "The What If" (one always selected)
- Pass one: textarea + "Next" button
- Pass two (shown after Next): textarea + "Complete" button
- Completing saves the entry, resets to pass one, and refreshes the history list below

**Bottom section - past rewrites:**

- Section label: "Past rewrites"
- Each entry card shows: spiral tag, date, pass one text, divider, pass two text
- If no rewrites yet, show empty state: italic prompt "Two passes. Full truth." and sub-label

Uses: inline state in `RewriteTab` (not the existing `RewriteRoom` component, which is designed for navigation flow). The existing `RewriteRoom` component is deleted along with the sub-route.

## Tab: The Why

**Top section - dark prompt card:**

- Always-visible write area inside a dark (`bg-bark`) card
- Label: "Why it ended"
- Quote: "Write it down. You'll want this record."
- Textarea with light-on-dark styling + Save button
- Saved entries get `entryType: "the_why"`

**Bottom section - entry list:**

- Section label: "Your entries"
- Chronological list of entries with `entryType: "the_why"` OR `entryType: "receipts"` (existing receipts data surfaces here)
- Each entry: date label + body text, rendered via `WhyEntryCard`

Uses: `WhyEntryCard` unchanged.

## Data

No schema changes. All existing Parse classes and entry types are reused as-is. Receipts entries (`entryType: "receipts"`) are surfaced in The Why tab by querying for both types.

## Tab strip

Four equal-width buttons: Diary, Full Picture, Rewrite Room, The Why. Active tab: `bg-bark text-cream`. Inactive: `bg-white text-bark`. Existing two-tab strip pattern extended to four tabs. Font size reduced to `text-[8.5px]` to fit four labels.
