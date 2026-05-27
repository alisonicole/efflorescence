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
      query.limit(50);
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
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory, refreshKey]);

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
              onClick={() => {
                setSelectedSpiral(s);
                setPass(1);
                setPass1Text("");
                setPass2Text("");
              }}
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
            {entry.pass1Content && (
              <>
                <p className="font-mono text-[9px] uppercase tracking-widest text-muted mb-1">
                  Pass one
                </p>
                <p className="text-sm text-bark leading-relaxed mb-3 line-clamp-3">
                  {entry.pass1Content}
                </p>
                <hr className="border-border mb-3" />
              </>
            )}
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
