"use client";

import { useState } from "react";
import type { JournalEntry } from "@/types";

// Fixed leaf positions distributed across the canopy
const LEAF_POSITIONS = [
  { x: 145, y: 95, rx: 14, ry: 8, rot: -25 },
  { x: 178, y: 75, rx: 14, ry: 8, rot: 5 },
  { x: 212, y: 92, rx: 14, ry: 8, rot: 22 },
  { x: 120, y: 120, rx: 13, ry: 7, rot: -40 },
  { x: 155, y: 112, rx: 13, ry: 7, rot: -15 },
  { x: 192, y: 105, rx: 13, ry: 7, rot: 10 },
  { x: 228, y: 115, rx: 13, ry: 7, rot: 30 },
  { x: 256, y: 132, rx: 12, ry: 7, rot: 48 },
  { x: 104, y: 148, rx: 12, ry: 6, rot: -52 },
  { x: 136, y: 140, rx: 13, ry: 7, rot: -20 },
  { x: 168, y: 135, rx: 13, ry: 7, rot: 0 },
  { x: 201, y: 138, rx: 13, ry: 7, rot: 18 },
  { x: 236, y: 148, rx: 12, ry: 6, rot: 38 },
  { x: 262, y: 163, rx: 11, ry: 6, rot: 52 },
  { x: 113, y: 170, rx: 12, ry: 6, rot: -35 },
  { x: 148, y: 164, rx: 13, ry: 7, rot: -10 },
  { x: 181, y: 162, rx: 13, ry: 7, rot: 5 },
  { x: 212, y: 168, rx: 12, ry: 6, rot: 25 },
  { x: 246, y: 175, rx: 11, ry: 6, rot: 42 },
  { x: 128, y: 192, rx: 12, ry: 6, rot: -25 },
  { x: 162, y: 188, rx: 12, ry: 6, rot: 0 },
  { x: 196, y: 190, rx: 12, ry: 6, rot: 20 },
  { x: 230, y: 196, rx: 11, ry: 6, rot: 38 },
  { x: 148, y: 216, rx: 11, ry: 5, rot: -15 },
  { x: 186, y: 218, rx: 11, ry: 5, rot: 10 },
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

  // First 25 entries get visible leaves; rest go to archive
  const leafEntries = entries.slice(0, LEAF_POSITIONS.length);
  const archiveCount = entries.length - leafEntries.length;

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
          viewBox="0 0 360 460"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          style={{ maxHeight: 420 }}
        >
          {/* Sky gradient */}
          <defs>
            <radialGradient id="skyGrad" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#f9f4ec" />
              <stop offset="100%" stopColor="#f0e8d8" />
            </radialGradient>
          </defs>
          <rect width="360" height="460" fill="url(#skyGrad)" />

          {/* Ground */}
          <ellipse
            cx="180"
            cy="438"
            rx="130"
            ry="18"
            fill="#C8A96A"
            opacity="0.25"
          />
          <ellipse
            cx="180"
            cy="434"
            rx="110"
            ry="12"
            fill="#A07C48"
            opacity="0.15"
          />

          {/* Ground flowers (decorative) */}
          {[60, 95, 130, 240, 275, 305].map((fx, i) => (
            <g key={i} transform={`translate(${fx}, 428)`}>
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="-14"
                stroke="#6B8F5E"
                strokeWidth="1"
              />
              <circle
                cx="0"
                cy="-17"
                r="4"
                fill={
                  [
                    "#E8C4A0",
                    "#D4A8C0",
                    "#E8D4A0",
                    "#C8D4A8",
                    "#E0B8B0",
                    "#C8C4E0",
                  ][i]
                }
                opacity="0.7"
              />
            </g>
          ))}

          {/* Trunk */}
          <path
            d="M172 435 C170 400 168 360 170 320 C171 295 173 268 174 248"
            stroke="#7A5030"
            strokeWidth="26"
            fill="none"
            strokeLinecap="round"
          />
          {/* Trunk highlight */}
          <path
            d="M175 435 C173 400 171 360 173 320 C174 295 176 268 177 248"
            stroke="#9A6840"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* Trunk hole (archive) */}
          <ellipse
            cx="178"
            cy="370"
            rx="18"
            ry="10"
            fill="#3A1C08"
            opacity="0.7"
          />
          <ellipse
            cx="178"
            cy="370"
            rx="14"
            ry="7"
            fill="#1A0C04"
            opacity="0.8"
          />
          <text
            x="178"
            y="387"
            textAnchor="middle"
            fontSize="7"
            fontFamily="monospace"
            fill="#9A6840"
            opacity="0.7"
            letterSpacing="1"
          >
            {archiveCount > 0 ? `+${archiveCount}` : "archive"}
          </text>
          {/* Invisible hit area for hole */}
          <ellipse
            cx="178"
            cy="375"
            rx="30"
            ry="20"
            fill="transparent"
            className="cursor-pointer"
            onClick={onShowArchive}
          />

          {/* Main branches */}
          {/* Left branch */}
          <path
            d="M174 248 C165 228 148 205 130 178"
            stroke="#7A5030"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
          />
          {/* Left sub-branch */}
          <path
            d="M148 205 C135 190 118 175 100 158"
            stroke="#7A5030"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Center-left branch */}
          <path
            d="M174 248 C172 225 170 200 168 172"
            stroke="#7A5030"
            strokeWidth="11"
            fill="none"
            strokeLinecap="round"
          />
          {/* Center branch */}
          <path
            d="M174 248 C177 218 179 188 180 155"
            stroke="#7A5030"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
          />
          {/* Right branch */}
          <path
            d="M174 248 C188 225 208 198 228 175"
            stroke="#7A5030"
            strokeWidth="13"
            fill="none"
            strokeLinecap="round"
          />
          {/* Right sub-branch */}
          <path
            d="M208 198 C225 183 245 168 264 152"
            stroke="#7A5030"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />

          {/* Canopy clusters (decorative background foliage) */}
          {[
            { cx: 180, cy: 162, r: 108, fill: "#4A7A3E", op: 0.82 },
            { cx: 148, cy: 142, r: 76, fill: "#5E8A50", op: 0.78 },
            { cx: 215, cy: 147, r: 72, fill: "#3E6B32", op: 0.72 },
            { cx: 108, cy: 162, r: 56, fill: "#4A7A3E", op: 0.68 },
            { cx: 255, cy: 162, r: 54, fill: "#3E6B32", op: 0.68 },
            { cx: 180, cy: 118, r: 62, fill: "#6A9A5C", op: 0.78 },
            { cx: 148, cy: 105, r: 48, fill: "#5E8A50", op: 0.72 },
            { cx: 210, cy: 108, r: 48, fill: "#4A8040", op: 0.7 },
            { cx: 175, cy: 215, r: 50, fill: "#456E38", op: 0.65 },
          ].map((c, i) => (
            <circle
              key={i}
              cx={c.cx}
              cy={c.cy}
              r={c.r}
              fill={c.fill}
              opacity={c.op}
            />
          ))}

          {/* Lighter leaf texture dots */}
          {[
            [120, 130],
            [155, 98],
            [190, 88],
            [225, 105],
            [260, 138],
            [100, 158],
            [140, 152],
            [200, 150],
            [244, 155],
            [170, 108],
            [210, 192],
            [140, 198],
            [115, 175],
            [250, 178],
          ].map(([lx, ly], i) => (
            <circle
              key={i}
              cx={lx}
              cy={ly}
              r="5"
              fill="#8AC47A"
              opacity="0.35"
            />
          ))}

          {/* Empty state: soft message when no entries */}
          {entries.length === 0 && (
            <text
              x="180"
              y="158"
              textAnchor="middle"
              fontSize="9"
              fontFamily="Georgia, serif"
              fontStyle="italic"
              fill="#F5EFE4"
              opacity="0.6"
            >
              Your first entry will be a leaf.
            </text>
          )}

          {/* Interactive leaves — one per entry */}
          {leafEntries.map((entry, i) => {
            const pos = LEAF_POSITIONS[i];
            return (
              <g
                key={entry.objectId}
                onClick={() => setSelected(entry)}
                className="cursor-pointer"
                style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))" }}
              >
                <ellipse
                  cx={pos.x}
                  cy={pos.y}
                  rx={pos.rx}
                  ry={pos.ry}
                  fill="#A8D890"
                  opacity="0.9"
                  transform={`rotate(${pos.rot} ${pos.x} ${pos.y})`}
                />
                {/* Leaf vein */}
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

          {/* Hint text */}
          {entries.length > 0 && (
            <text
              x="180"
              y="452"
              textAnchor="middle"
              fontSize="6.5"
              fontFamily="monospace"
              fill="#9A6840"
              opacity="0.45"
              letterSpacing="1.5"
            >
              TAP A LEAF TO READ
            </text>
          )}
        </svg>

        {/* Decorative ground strip */}
        <div className="h-1 mx-3.5 mb-3 rounded-full bg-[#C4A882] opacity-30" />
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
