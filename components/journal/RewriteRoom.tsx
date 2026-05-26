"use client";

import { useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import { PROMPTS } from "@/lib/prompts";
import type { Spiral } from "@/types";

type RewriteSpiral = "the_but_he" | "the_what_if";

interface RewriteRoomProps {
  spiral: RewriteSpiral;
  onComplete: () => void;
}

export default function RewriteRoom({ spiral, onComplete }: RewriteRoomProps) {
  const [pass, setPass] = useState<1 | 2>(1);
  const [pass1Text, setPass1Text] = useState("");
  const [pass2Text, setPass2Text] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const pass2Prompt = PROMPTS[spiral][0];

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
      entry.set("prompt", pass2Prompt);
      entry.set("spiralContext", spiral);
      entry.set("entryType", "rewrite");
      entry.setACL(new Parse.ACL(user));
      await entry.save();
      setDone(true);
      setTimeout(() => onComplete(), 2500);
    } catch {
      /* silent */
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <div className="px-2.5 py-8 text-center">
        <p className="font-display text-xl italic text-bark mb-2">
          A rare plant appeared in your garden.
        </p>
        <p className="font-mono text-[9px] uppercase tracking-widest text-soil opacity-60">
          Returning you to your journal...
        </p>
      </div>
    );
  }

  if (pass === 1) {
    return (
      <div className="px-2.5 space-y-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[3px] text-soil opacity-60 mb-1">
            Pass one
          </p>
          <p className="font-display text-lg italic font-light text-bark">
            "Write the version you keep replaying."
          </p>
        </div>
        <textarea
          value={pass1Text}
          onChange={(e) => setPass1Text(e.target.value)}
          placeholder="Write whatever comes. No editing."
          rows={10}
          className="w-full bg-white rounded-card p-4 text-sm text-bark placeholder:text-muted/60 border border-border focus:outline-none focus:border-clay/40 resize-none leading-relaxed"
          autoFocus
        />
        <button
          onClick={() => setPass(2)}
          disabled={!pass1Text.trim()}
          className="w-full bg-bark text-cream rounded-card py-3 text-sm font-medium disabled:opacity-40"
        >
          Next
        </button>
      </div>
    );
  }

  return (
    <div className="px-2.5 space-y-4">
      <div>
        <p className="font-mono text-[9px] uppercase tracking-[3px] text-soil opacity-60 mb-1">
          Pass two
        </p>
        <p className="font-display text-lg italic font-light text-bark">
          "Now write the full version. The part you've been leaving out."
        </p>
      </div>
      <div className="bg-white rounded-card p-4 border-l-2 border-clay/40">
        <p className="text-xs text-muted italic">{pass2Prompt}</p>
      </div>
      <textarea
        value={pass2Text}
        onChange={(e) => setPass2Text(e.target.value)}
        placeholder="The full version."
        rows={10}
        className="w-full bg-white rounded-card p-4 text-sm text-bark placeholder:text-muted/60 border border-border focus:outline-none focus:border-clay/40 resize-none leading-relaxed"
        autoFocus
      />
      <button
        onClick={handleComplete}
        disabled={!pass2Text.trim() || saving}
        className="w-full bg-bark text-cream rounded-card py-3 text-sm font-medium disabled:opacity-40"
      >
        {saving ? "Saving..." : "Complete"}
      </button>
    </div>
  );
}
