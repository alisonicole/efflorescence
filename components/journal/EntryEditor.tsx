"use client";

import { useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import type { Spiral } from "@/types";

interface EntryEditorProps {
  prompt: string;
  spiralContext?: Spiral;
  onSaved: () => void;
}

export default function EntryEditor({
  prompt,
  spiralContext,
  onSaved,
}: EntryEditorProps) {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!content.trim() || saving) return;
    setSaving(true);
    initParse();
    const user = Parse.User.current();
    if (!user) {
      setSaving(false);
      return;
    }

    let saved = false;
    try {
      const ParseEntry = Parse.Object.extend("JournalEntry");
      const entry = new ParseEntry();
      entry.set("user", user);
      entry.set("content", content.trim());
      entry.set("prompt", prompt);
      if (spiralContext) entry.set("spiralContext", spiralContext);
      entry.setACL(new Parse.ACL(user));
      await entry.save();
      saved = true;
    } finally {
      setSaving(false);
    }
    if (saved) {
      setContent("");
      onSaved();
    }
  }

  return (
    <div className="px-2.5 space-y-3">
      {prompt && (
        <div className="bg-white rounded-card p-4 border-l-2 border-clay/40">
          <p className="text-xs text-muted italic">{prompt}</p>
        </div>
      )}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write whatever wants to come out."
        rows={8}
        className="w-full bg-white rounded-card p-4 text-sm text-bark placeholder:text-muted/60 border border-border focus:outline-none focus:border-clay/40 resize-none leading-relaxed"
        autoFocus
      />
      <button
        onClick={handleSave}
        disabled={!content.trim() || saving}
        className="w-full bg-bark text-cream rounded-card py-3 text-sm font-medium disabled:opacity-40"
      >
        {saving ? "Saving..." : "Plant this entry"}
      </button>
    </div>
  );
}
