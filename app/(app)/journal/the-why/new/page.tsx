"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import TopBar from "@/components/layout/TopBar";

export default function NewWhyPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

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
      router.push("/journal/the-why");
    } catch {
      setSaving(false);
    }
  }

  return (
    <>
      <TopBar title="the why" subtitle="Write whatever is true." />
      <div className="pt-2 pb-4 px-2.5 space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write whatever is true."
          rows={14}
          className="w-full bg-white rounded-card p-4 text-sm text-bark placeholder:text-muted/60 border border-border focus:outline-none focus:border-clay/40 resize-none leading-relaxed"
          autoFocus
        />
        <button
          onClick={handleSave}
          disabled={!text.trim() || saving}
          className="w-full bg-bark text-cream rounded-card py-3 text-sm font-medium disabled:opacity-40"
        >
          {saving ? "Saving..." : "Seal it"}
        </button>
      </div>
    </>
  );
}
