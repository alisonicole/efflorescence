type SoilPatchState =
  | "empty"
  | "seeded"
  | "sprouted"
  | "grown-gratitude"
  | "grown-rewrite";

interface SoilPatch {
  state: SoilPatchState;
  x: number;
  y: number;
}

function SoilCircle({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {/* Base soil */}
      <circle cx={x} cy={y} r={16} fill="#2A1F15" opacity={0.82} />
      {/* Inner texture ring */}
      <circle cx={x} cy={y} r={13} fill="#3D2B1F" opacity={0.6} />
      {/* Subtle highlight arc — top-left */}
      <ellipse
        cx={x - 4}
        cy={y - 5}
        rx={5}
        ry={3}
        fill="#6B4F3A"
        opacity={0.18}
        transform={`rotate(-30 ${x - 4} ${y - 5})`}
      />
      {/* Tiny texture dots */}
      <circle cx={x - 5} cy={y + 2} r={1} fill="#6B4F3A" opacity={0.25} />
      <circle cx={x + 4} cy={y - 3} r={0.8} fill="#6B4F3A" opacity={0.2} />
      <circle cx={x + 2} cy={y + 5} r={0.8} fill="#4A3020" opacity={0.3} />
    </g>
  );
}

function SeededPatch({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <SoilCircle x={x} y={y} />
      {/* Seed — small oval, tan/cream, barely visible */}
      <ellipse
        cx={x}
        cy={y + 1}
        rx={4}
        ry={2.5}
        fill="#C4A882"
        opacity={0.75}
      />
      <ellipse
        cx={x}
        cy={y + 1}
        rx={2.5}
        ry={1.5}
        fill="#D4B47A"
        opacity={0.5}
      />
    </g>
  );
}

function SproutedPatch({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <SoilCircle x={x} y={y} />
      {/* Thin stem breaking surface */}
      <line
        x1={x}
        y1={y + 2}
        x2={x}
        y2={y - 10}
        stroke="#4A6741"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      {/* Left leaf */}
      <ellipse
        cx={x - 4}
        cy={y - 7}
        rx={3.5}
        ry={2}
        fill="#7A9E6E"
        opacity={0.85}
        transform={`rotate(-30 ${x - 4} ${y - 7})`}
      />
      {/* Right leaf */}
      <ellipse
        cx={x + 4}
        cy={y - 5}
        rx={3.5}
        ry={2}
        fill="#7A9E6E"
        opacity={0.75}
        transform={`rotate(30 ${x + 4} ${y - 5})`}
      />
    </g>
  );
}

function GrownGratitudePatch({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <SoilCircle x={x} y={y} />
      {/* Stem */}
      <line
        x1={x}
        y1={y + 2}
        x2={x}
        y2={y - 18}
        stroke="#4A6741"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      {/* Lavender sprig — small florets */}
      <ellipse cx={x} cy={y - 20} rx={3} ry={5} fill="#B8CDB0" opacity={0.8} />
      <ellipse
        cx={x - 2}
        cy={y - 18}
        rx={2}
        ry={3.5}
        fill="#A8C4A0"
        opacity={0.7}
      />
      <ellipse
        cx={x + 2}
        cy={y - 18}
        rx={2}
        ry={3.5}
        fill="#A8C4A0"
        opacity={0.7}
      />
      {/* Side leaves */}
      <ellipse
        cx={x - 5}
        cy={y - 10}
        rx={3.5}
        ry={2}
        fill="#7A9E6E"
        opacity={0.65}
        transform={`rotate(-40 ${x - 5} ${y - 10})`}
      />
      <ellipse
        cx={x + 5}
        cy={y - 8}
        rx={3.5}
        ry={2}
        fill="#7A9E6E"
        opacity={0.6}
        transform={`rotate(40 ${x + 5} ${y - 8})`}
      />
    </g>
  );
}

function GrownRewritePatch({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <SoilCircle x={x} y={y} />
      {/* Succulent — rosette of thick leaves */}
      <ellipse cx={x} cy={y - 8} rx={9} ry={5} fill="#4A6741" opacity={0.55} />
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const lx = x + Math.cos(rad) * 7;
        const ly = y - 8 + Math.sin(rad) * 4;
        return (
          <ellipse
            key={angle}
            cx={lx}
            cy={ly}
            rx={4}
            ry={2.5}
            fill="#4A6741"
            opacity={0.75}
            transform={`rotate(${angle} ${lx} ${ly})`}
          />
        );
      })}
      {/* Center rosette */}
      <circle cx={x} cy={y - 8} r={3} fill="#3D2B1F" opacity={0.5} />
      <circle cx={x} cy={y - 8} r={1.5} fill="#7A9E6E" opacity={0.8} />
    </g>
  );
}

function SoilPatchRenderer({ patch }: { patch: SoilPatch }) {
  const { state, x, y } = patch;
  switch (state) {
    case "empty":
      return <SoilCircle x={x} y={y} />;
    case "seeded":
      return <SeededPatch x={x} y={y} />;
    case "sprouted":
      return <SproutedPatch x={x} y={y} />;
    case "grown-gratitude":
      return <GrownGratitudePatch x={x} y={y} />;
    case "grown-rewrite":
      return <GrownRewritePatch x={x} y={y} />;
  }
}

// Demo state for first open: 1 empty, 1 seeded
const DEMO_PATCHES: SoilPatch[] = [
  { state: "empty", x: 30, y: 52 },
  { state: "seeded", x: 68, y: 58 },
];

export default function SoilCorner() {
  return (
    <div
      className="absolute pointer-events-none z-10"
      style={{ bottom: 52, left: 0 }}
    >
      {/* Soft ambient glow behind the corner — quieter zone */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          width: 120,
          height: 60,
          background:
            "radial-gradient(ellipse, rgba(61,43,31,0.18) 0%, transparent 70%)",
          transform: "translateY(8px)",
        }}
      />
      <svg
        width="110"
        height="80"
        viewBox="0 0 110 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {DEMO_PATCHES.map((patch, i) => (
          <SoilPatchRenderer key={i} patch={patch} />
        ))}
      </svg>
    </div>
  );
}

export type { SoilPatchState, SoilPatch };
