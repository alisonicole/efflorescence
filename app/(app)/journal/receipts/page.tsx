"use client";

import { useCallback, useEffect, useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import TopBar from "@/components/layout/TopBar";

type ReceiptsState = "loading" | "empty" | "editable" | "locked";

export default function ReceiptsPage() {
  const [state, setState] = useState<ReceiptsState>("loading");
  const [text, setText] = useState("");
  const [existingEntry, setExistingEntry] = useState<Parse.Object | null>(null);
  const [saving, setSaving] = useState(false);
  const [hoursLeft, setHoursLeft] = useState(48);

  const loadReceipts = useCallback(async () => {
    initParse();
    const user = Parse.User.current();
    if (!user) return;
    try {
      const query = new Parse.Query("JournalEntry");
      query.equalTo("user", user);
      query.equalTo("entryType", "receipts");
      query.limit(1);
      const entry = await query.first();
      if (!entry) {
        setState("empty");
        return;
      }
      const created = entry.createdAt!;
      const msSince = Date.now() - created.getTime();
      const hours48 = 48 * 60 * 60 * 1000;
      setText(entry.get("content") as string);
      setExistingEntry(entry);
      if (msSince < hours48) {
        const remaining = Math.ceil((hours48 - msSince) / (60 * 60 * 1000));
        setHoursLeft(remaining);
        setState("editable");
      } else {
        setState("locked");
      }
    } catch {
      setState("empty");
    }
  }, []);

  useEffect(() => {
    void loadReceipts();
  }, [loadReceipts]);

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
      if (existingEntry) {
        existingEntry.set("content", text.trim());
        await existingEntry.save();
      } else {
        const ParseEntry = Parse.Object.extend("JournalEntry");
        const entry = new ParseEntry();
        entry.set("user", user);
        entry.set("content", text.trim());
        entry.set("prompt", "Why it ended. In your words.");
        entry.set("entryType", "receipts");
        entry.setACL(new Parse.ACL(user));
        await entry.save();
      }
      void loadReceipts();
    } catch {
      /* silent */
    } finally {
      setSaving(false);
    }
  }

  const subtitle =
    state === "locked"
      ? "Sealed. Your words, when you need them."
      : state === "editable"
        ? `Editable for ${hoursLeft} more hours`
        : "Write it down. You'll want this later.";

  return (
    <>
      <TopBar title="the receipts" subtitle={subtitle} />
      <div className="pt-2 pb-4 px-2.5 space-y-3">
        {state === "loading" && (
          <p className="font-mono text-[9px] text-muted">Loading...</p>
        )}

        {(state === "empty" || state === "editable") && (
          <>
            {state === "empty" && (
              <p className="font-display text-base italic font-light text-bark">
                "Write down what happened. You'll want this record."
              </p>
            )}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write whatever is true."
              rows={12}
              className="w-full bg-white rounded-card p-4 text-sm text-bark placeholder:text-muted/60 border border-border focus:outline-none focus:border-clay/40 resize-none leading-relaxed"
              autoFocus={state === "empty"}
            />
            <button
              onClick={handleSave}
              disabled={!text.trim() || saving}
              className="w-full bg-bark text-cream rounded-card py-3 text-sm font-medium disabled:opacity-40"
            >
              {saving
                ? "Saving..."
                : state === "editable"
                  ? "Save changes"
                  : "Seal it"}
            </button>
          </>
        )}

        {state === "locked" && (
          <div className="bg-white rounded-card p-4 border border-border">
            <p className="font-mono text-[9px] uppercase tracking-[3px] text-soil opacity-60 mb-3">
              Sealed -{" "}
              {existingEntry?.createdAt?.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="text-sm text-bark leading-relaxed whitespace-pre-wrap">
              {text}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
