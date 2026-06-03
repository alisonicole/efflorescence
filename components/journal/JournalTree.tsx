"use client";

import { useState } from "react";
import type { JournalEntry } from "@/types";

// Leaf positions along and at the tips of branches
const LEAF_POSITIONS = [
  // Right sub-branch tips
  { x: 268, y: 142, rx: 13, ry: 7, rot: 45 },
  { x: 255, y: 136, rx: 13, ry: 7, rot: 35 },
  { x: 278, y: 156, rx: 12, ry: 6, rot: 55 },
  // Right branch tips
  { x: 238, y: 162, rx: 13, ry: 7, rot: 30 },
  { x: 250, y: 150, rx: 12, ry: 6, rot: 42 },
  { x: 226, y: 170, rx: 13, ry: 7, rot: 20 },
  // Center branch tips
  { x: 180, y: 138, rx: 13, ry: 7, rot: 0 },
  { x: 168, y: 136, rx: 12, ry: 6, rot: -15 },
  { x: 193, y: 140, rx: 12, ry: 6, rot: 15 },
  // Center-left branch tips
  { x: 163, y: 154, rx: 13, ry: 7, rot: -20 },
  { x: 150, y: 150, rx: 12, ry: 6, rot: -35 },
  { x: 174, y: 162, rx: 12, ry: 6, rot: -8 },
  // Left branch tips
  { x: 94, y: 146, rx: 13, ry: 7, rot: -50 },
  { x: 108, y: 138, rx: 12, ry: 6, rot: -45 },
  { x: 82, y: 157, rx: 11, ry: 6, rot: -58 },
  // Left main branch
  { x: 122, y: 168, rx: 13, ry: 7, rot: -38 },
  { x: 112, y: 176, rx: 12, ry: 6, rot: -45 },
  // Mid right
  { x: 212, y: 186, rx: 12, ry: 6, rot: 25 },
  { x: 236, y: 186, rx: 11, ry: 6, rot: 38 },
  // Mid left
  { x: 138, y: 188, rx: 12, ry: 6, rot: -28 },
  { x: 152, y: 194, rx: 12, ry: 6, rot: -15 },
  // Lower center
  { x: 185, y: 202, rx: 11, ry: 6, rot: 5 },
  { x: 170, y: 207, rx: 11, ry: 5, rot: -10 },
  { x: 200, y: 210, rx: 10, ry: 5, rot: 18 },
  { x: 160, y: 220, rx: 10, ry: 5, rot: -20 },
];

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

interface JournalTreeProps {
  entries: JournalEntry[];
  onShowArchive: () => void;
}

export default function JournalTree({
  entries,
  onShowArchive,
}: JournalTreeProps) {
  const [selected, setSelected] = useState<JournalEntry | null>(null);

  const leafEntries = entries.slice(0, LEAF_POSITIONS.length);
  const archiveCount = entries.length - leafEntries.length;

  function pullLeaf() {
    if (entries.length === 0) return;
    const idx = Math.floor(Math.random() * entries.length);
    setSelected(entries[idx]);
  }

  return (
    <>
      <div className="relative mx-2.5 bg-white rounded-card overflow-hidden shadow-sm">
        {/* Header */}
        <div className="px-3.5 pt-3 pb-0 flex items-baseline justify-between">
          <span className="font-mono text-[8px] uppercase tracking-[2.5px] text-bark/60">
            Your journal
          </span>
          {entries.length > 0 && (
            <span className="font-mono text-[8px] text-bark/30">
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </span>
          )}
        </div>

        <svg
          viewBox="0 0 360 440"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          style={{ maxHeight: 400 }}
        >
          <defs>
            <radialGradient id="skyGrad" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#f9f4ec" />
              <stop offset="100%" stopColor="#f0e8d8" />
            </radialGradient>
          </defs>
          <rect width="360" height="440" fill="url(#skyGrad)" />

          {/* Ground shadow */}
          <ellipse
            cx="180"
            cy="424"
            rx="100"
            ry="12"
            fill="#C8A96A"
            opacity="0.2"
          />

          {/* Trunk - wider so hole fits */}
          <path
            d="M172 428 C170 395 168 355 170 315 C171 292 173 265 174 245"
            stroke="#7A5030"
            strokeWidth="44"
            fill="none"
            strokeLinecap="round"
          />
          {/* Trunk highlight */}
          <path
            d="M177 428 C175 395 173 355 175 315 C176 292 178 265 179 245"
            stroke="#9A6840"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            opacity="0.4"
          />

          {/* Trunk hole (archive) */}
          <ellipse
            cx="178"
            cy="362"
            rx="22"
            ry="12"
            fill="#3A1C08"
            opacity="0.75"
          />
          <ellipse
            cx="178"
            cy="362"
            rx="16"
            ry="8"
            fill="#1A0C04"
            opacity="0.85"
          />
          <text
            x="178"
            y="382"
            textAnchor="middle"
            fontSize="7"
            fontFamily="monospace"
            fill="#9A6840"
            opacity="0.7"
            letterSpacing="1"
          >
            {archiveCount > 0 ? `+${archiveCount}` : "archive"}
          </text>
          <ellipse
            cx="178"
            cy="368"
            rx="32"
            ry="24"
            fill="transparent"
            className="cursor-pointer"
            onClick={onShowArchive}
          />

          {/* Main branches - clearly visible */}
          {/* Left branch */}
          <path
            d="M172 245 C163 225 145 202 128 176"
            stroke="#7A5030"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
          />
          {/* Left sub-branch */}
          <path
            d="M145 202 C130 187 114 172 96 155"
            stroke="#7A5030"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Left twig */}
          <path
            d="M120 177 C112 168 103 158 92 148"
            stroke="#7A5030"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Center-left branch */}
          <path
            d="M173 245 C170 222 167 198 164 170"
            stroke="#7A5030"
            strokeWidth="11"
            fill="none"
            strokeLinecap="round"
          />
          {/* Center branch */}
          <path
            d="M175 245 C177 215 179 185 180 152"
            stroke="#7A5030"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
          />
          {/* Right branch */}
          <path
            d="M176 245 C190 222 210 196 230 172"
            stroke="#7A5030"
            strokeWidth="13"
            fill="none"
            strokeLinecap="round"
          />
          {/* Right sub-branch */}
          <path
            d="M210 196 C228 180 246 165 266 150"
            stroke="#7A5030"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Right twig */}
          <path
            d="M232 172 C244 160 255 148 265 140"
            stroke="#7A5030"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Empty state */}
          {entries.length === 0 && (
            <text
              x="180"
              y="120"
              textAnchor="middle"
              fontSize="9"
              fontFamily="Georgia, serif"
              fontStyle="italic"
              fill="#9A6840"
              opacity="0.5"
            >
              Your first entry will be a leaf.
            </text>
          )}

          {/* Leaves - one per entry, positioned along branches */}
          {leafEntries.map((entry, i) => {
            const pos = LEAF_POSITIONS[i];
            return (
              <g
                key={entry.objectId}
                onClick={() => setSelected(entry)}
                className="cursor-pointer"
                style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.12))" }}
              >
                <ellipse
                  cx={pos.x}
                  cy={pos.y}
                  rx={pos.rx}
                  ry={pos.ry}
                  fill="#A8D890"
                  opacity="0.92"
                  transform={`rotate(${pos.rot} ${pos.x} ${pos.y})`}
                />
                <line
                  x1={
                    pos.x - (pos.rx - 2) * Math.cos((pos.rot * Math.PI) / 180)
                  }
                  y1={
                    pos.y - (pos.rx - 2) * Math.sin((pos.rot * Math.PI) / 180)
                  }
                  x2={
                    pos.x + (pos.rx - 2) * Math.cos((pos.rot * Math.PI) / 180)
                  }
                  y2={
                    pos.y + (pos.rx - 2) * Math.sin((pos.rot * Math.PI) / 180)
                  }
                  stroke="#7AB860"
                  strokeWidth="0.8"
                  opacity="0.7"
                />
              </g>
            );
          })}
        </svg>

        {/* Pull a leaf button */}
        <div className="px-3.5 pb-4 flex gap-2">
          <button
            onClick={pullLeaf}
            disabled={entries.length === 0}
            className="flex-1 bg-bark/8 border border-bark/15 text-bark rounded-card py-2.5 font-mono text-[8px] uppercase tracking-[2px] disabled:opacity-30 active:scale-[0.98] transition-transform"
          >
            Pull a leaf
          </button>
        </div>

        <div className="mx-3.5 mb-3 h-1 rounded-full bg-[#C4A882] opacity-25" />
      </div>

      {/* Entry detail bottom sheet */}
      {selected && (
        <>
          <div
            className="fixed inset-0 bg-bark/40 z-40 backdrop-blur-[2px]"
            onClick={() => setSelected(null)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
            <div className="bg-cream rounded-t-2xl px-5 pt-5 pb-12 max-w-app mx-auto max-h-[72vh] flex flex-col">
              <div className="w-8 h-0.5 rounded-full bg-bark/15 mx-auto mb-4" />
              <p className="font-mono text-[7px] uppercase tracking-[2.5px] text-muted mb-1">
                {formatDate(selected.createdAt)}
              </p>
              {selected.prompt && (
                <p className="font-display italic text-[13px] text-muted border-l-2 border-border pl-2.5 mb-3 leading-snug">
                  {selected.prompt}
                </p>
              )}
              <p className="text-sm text-bark leading-relaxed overflow-y-auto flex-1">
                {selected.content}
              </p>
              <button
                onClick={() => setSelected(null)}
                className="mt-4 w-full py-2 font-mono text-[9px] uppercase tracking-widest text-muted"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
