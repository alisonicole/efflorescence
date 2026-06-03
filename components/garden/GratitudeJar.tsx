"use client";

import { useCallback, useEffect, useState } from "react";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import type { GratitudeEntry } from "@/types";

// Deterministic pebble positions seeded by index so jar looks consistent
const PEBBLE_COLORS = [
  "#7A9E6E", // sage
  "#C97A6E", // clay
  "#B8935A", // gold
  "#8C7B6E", // muted
  "#6B8F5E", // deep sage
  "#DBA898", // blush
  "#9E8B6E", // tan
  "#7B9E8E", // teal sage
];

function pebbleProps(idx: number) {
  const cols = 6;
  const col = idx % cols;
  const row = Math.floor(idx / cols);
  const jitterX = ((idx * 37 + row * 13) % 14) - 7;
  const jitterY = ((idx * 23 + col * 17) % 8) - 4;
  const cx = 28 + col * 24 + jitterX;
  // fill from bottom: row 0 is lowest
  const cy = 145 - row * 20 + jitterY;
  const rx = 7 + ((idx * 11) % 5);
  const ry = 5 + ((idx * 7) % 4);
  const color = PEBBLE_COLORS[idx % PEBBLE_COLORS.length];
  return { cx, cy, rx, ry, color };
}

function JarSvg({ count }: { count: number }) {
  const displayCount = Math.min(count, 20);
  const extra = count - displayCount;

  return (
    <svg
      width="160"
      height="200"
      viewBox="0 0 160 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Jar body */}
      <path
        d="M30 60 Q20 80 18 120 Q16 160 20 175 Q30 188 80 188 Q130 188 140 175 Q144 160 142 120 Q140 80 130 60 Z"
        fill="rgba(245,239,228,0.85)"
        stroke="#B8935A"
        strokeWidth="1.2"
      />
      {/* Jar neck */}
      <rect
        x="50"
        y="42"
        width="60"
        height="22"
        rx="4"
        fill="rgba(245,239,228,0.9)"
        stroke="#B8935A"
        strokeWidth="1.2"
      />
      {/* Lid */}
      <rect
        x="44"
        y="34"
        width="72"
        height="12"
        rx="3"
        fill="#B8935A"
        opacity="0.7"
      />
      {/* Clip pebbles to jar body */}
      <clipPath id="jar-clip">
        <path d="M30 60 Q20 80 18 120 Q16 160 20 175 Q30 188 80 188 Q130 188 140 175 Q144 160 142 120 Q140 80 130 60 Z" />
      </clipPath>
      <g clipPath="url(#jar-clip)">
        {Array.from({ length: displayCount }).map((_, i) => {
          const p = pebbleProps(i);
          return (
            <ellipse
              key={i}
              cx={p.cx}
              cy={p.cy}
              rx={p.rx}
              ry={p.ry}
              fill={p.color}
              opacity="0.75"
            />
          );
        })}
        {extra > 0 && (
          <text
            x="80"
            y="100"
            textAnchor="middle"
            fontSize="11"
            fontFamily="monospace"
            fill="#3D2B1F"
            opacity="0.5"
          >
            +{extra} more
          </text>
        )}
      </g>
      {/* Glass shine */}
      <path
        d="M36 70 Q32 100 32 130"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

export default function GratitudeJar() {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showPull, setShowPull] = useState(false);
  const [pulledEntry, setPulledEntry] = useState<GratitudeEntry | null>(null);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    initParse();
    const user = Parse.User.current();
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const query = new Parse.Query("GratitudeEntry");
      query.equalTo("user", user);
      query.descending("createdAt");
      query.limit(200);
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
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleAdd() {
    if (!text.trim() || saving) return;
    setSaving(true);
    initParse();
    const user = Parse.User.current();
    if (!user) {
      setSaving(false);
      return;
    }
    try {
      const ParseGratitude = Parse.Object.extend("GratitudeEntry");
      const entry = new ParseGratitude();
      entry.set("user", user);
      entry.set("content", text.trim());
      entry.setACL(new Parse.ACL(user));
      await entry.save();
      setText("");
      setShowAdd(false);
      await load();
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }

  function pullPebble() {
    if (entries.length === 0) return;
    const idx = Math.floor(Math.random() * entries.length);
    setPulledEntry(entries[idx]);
    setShowPull(true);
  }

  return (
    <div className="px-2.5 pb-4">
      <div className="bg-white rounded-card p-4 shadow-sm border border-border">
        <p className="font-mono text-[9px] uppercase tracking-widest text-muted mb-3">
          Gratitude
        </p>

        {/* Jar + interactions */}
        <div className="flex flex-col items-center">
          <button
            onClick={pullPebble}
            disabled={entries.length === 0}
            className="disabled:opacity-40 active:scale-95 transition-transform"
            aria-label="Pull a gratitude pebble"
          >
            {!loading && <JarSvg count={entries.length} />}
            {loading && (
              <div className="w-[160px] h-[200px] flex items-center justify-center">
                <span className="font-mono text-[9px] text-muted">...</span>
              </div>
            )}
          </button>

          {entries.length > 0 && (
            <p className="font-mono text-[8px] uppercase tracking-widest text-muted mt-1 mb-3">
              {entries.length} pebble{entries.length !== 1 ? "s" : ""} - tap to
              pull one
            </p>
          )}
          {entries.length === 0 && !loading && (
            <p className="font-mono text-[8px] uppercase tracking-widest text-muted mt-1 mb-3">
              Add your first gratitude below
            </p>
          )}

          <button
            onClick={() => setShowAdd(true)}
            className="w-full bg-bark text-cream rounded-card py-2.5 text-sm font-medium"
          >
            Add a pebble
          </button>
        </div>
      </div>

      {/* Add sheet */}
      {showAdd && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
          onClick={() => setShowAdd(false)}
        >
          <div
            className="w-full max-w-app bg-cream rounded-t-2xl p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted mb-1">
              New pebble
            </p>
            <p className="font-display text-base italic text-bark mb-4">
              What are you grateful for?
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="I am grateful for..."
              rows={4}
              autoFocus
              className="w-full bg-white rounded-card p-4 text-sm text-bark placeholder:text-muted/60 border border-border focus:outline-none focus:border-clay/40 resize-none leading-relaxed mb-3"
            />
            <button
              onClick={handleAdd}
              disabled={!text.trim() || saving}
              className="w-full bg-bark text-cream rounded-card py-3 text-sm font-medium disabled:opacity-40"
            >
              {saving ? "Adding..." : "Add to jar"}
            </button>
          </div>
        </div>
      )}

      {/* Pull sheet */}
      {showPull && pulledEntry && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center"
          onClick={() => setShowPull(false)}
        >
          <div
            className="w-full max-w-app bg-cream rounded-t-2xl p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🪨</span>
              <p className="font-mono text-[9px] uppercase tracking-widest text-muted">
                A pebble from your jar
              </p>
            </div>
            <div className="bg-white rounded-card p-5 shadow-sm border border-border mb-4">
              <p className="font-display text-lg italic text-bark leading-relaxed">
                &ldquo;{pulledEntry.content}&rdquo;
              </p>
              <p className="mt-3 font-mono text-[8px] uppercase tracking-widest text-muted">
                {new Date(pulledEntry.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <button
              onClick={() => setShowPull(false)}
              className="w-full bg-bark text-cream rounded-card py-3 text-sm font-medium"
            >
              Put it back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
