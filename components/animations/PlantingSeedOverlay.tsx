"use client";

interface Props {
  habitName: string;
  onClose: () => void;
}

export default function PlantingSeedOverlay({ habitName, onClose }: Props) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400;1,500&family=DM+Mono:wght@400;500&display=swap');

        .mot-overlay {
          animation: mot-fade-in 0.2s ease-out both;
        }
        @keyframes mot-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .mot-seed {
          position: absolute;
          bottom: 92px;
          left: 50%;
          transform: translateX(-50%) translateY(-340px);
          animation:
            mot-seed-drop   1.1s 0.3s  ease-in      forwards,
            mot-seed-settle 0.35s 1.45s ease-in-out forwards;
        }
        @keyframes mot-seed-drop {
          0%   { transform: translateX(-50%) translateY(-340px); }
          82%  { transform: translateX(-50%) translateY(7px); }
          92%  { transform: translateX(-50%) translateY(-9px); }
          100% { transform: translateX(-50%) translateY(0); }
        }
        @keyframes mot-seed-settle {
          0%   { transform: translateX(-50%) scale(1); }
          50%  { transform: translateX(-50%) scale(1.1); }
          100% { transform: translateX(-50%) scale(1); }
        }

        .mot-shadow {
          position: absolute;
          bottom: 98px;
          left: 50%;
          transform: translateX(-50%);
          width: 44px;
          height: 10px;
          background: radial-gradient(ellipse, rgba(20,10,4,0.55) 0%, transparent 70%);
          animation: mot-shadow-pulse 0.4s 1.2s ease-out both;
        }
        @keyframes mot-shadow-pulse {
          0%   { opacity: 0;   transform: translateX(-50%) scale(0.4); }
          50%  { opacity: 1;   transform: translateX(-50%) scale(1); }
          100% { opacity: 0.3; transform: translateX(-50%) scale(1); }
        }

        .mot-p {
          position: absolute;
          bottom: 108px;
          left: 50%;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #C4785A;
        }
        .mot-p1 { animation: mot-p1 0.6s 1.4s  ease-out both; }
        .mot-p2 { animation: mot-p2 0.6s 1.45s ease-out both; }
        .mot-p3 { animation: mot-p3 0.6s 1.5s  ease-out both; width: 4px; height: 4px; background: #B8956A; }

        @keyframes mot-p1 {
          0%   { transform: translate(-50%, 0);   opacity: 0.8; }
          100% { transform: translate(calc(-50% - 28px), -22px); opacity: 0; }
        }
        @keyframes mot-p2 {
          0%   { transform: translate(-50%, 0);   opacity: 0.75; }
          100% { transform: translate(calc(-50% + 32px), -18px); opacity: 0; }
        }
        @keyframes mot-p3 {
          0%   { transform: translate(-50%, 0);   opacity: 0.7; }
          100% { transform: translate(calc(-50% + 8px), -30px); opacity: 0; }
        }

        .mot-copy {
          position: absolute;
          bottom: 112px;
          left: 0;
          right: 0;
          text-align: center;
        }
        .mot-line1 { animation: mot-copy-in 0.4s 1.8s ease-out both; }
        .mot-line2 { animation: mot-copy-in 0.4s 2.0s ease-out both; }
        @keyframes mot-copy-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .mot-dismiss {
          position: absolute;
          bottom: 52px;
          left: 0;
          right: 0;
          text-align: center;
          animation: mot-copy-in 0.4s 2.6s ease-out both;
          cursor: pointer;
        }
      `}</style>

      <div
        className="mot-overlay"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          background: "rgba(18, 10, 4, 0.92)",
        }}
      >
        {/* Scene container */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -10%)",
            width: 280,
            height: 220,
          }}
        >
          {/* Bench */}
          <svg
            width="280"
            height="72"
            viewBox="0 0 280 72"
            fill="none"
            style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
          >
            {/* Surface */}
            <rect x="12" y="18" width="256" height="12" rx="3" fill="#6B4C35" />
            {/* Grain detail */}
            <line
              x1="40"
              y1="18"
              x2="40"
              y2="30"
              stroke="#5A3D28"
              strokeWidth="0.5"
              opacity="0.4"
            />
            <line
              x1="90"
              y1="18"
              x2="90"
              y2="30"
              stroke="#5A3D28"
              strokeWidth="0.5"
              opacity="0.4"
            />
            <line
              x1="140"
              y1="18"
              x2="140"
              y2="30"
              stroke="#5A3D28"
              strokeWidth="0.5"
              opacity="0.4"
            />
            <line
              x1="190"
              y1="18"
              x2="190"
              y2="30"
              stroke="#5A3D28"
              strokeWidth="0.5"
              opacity="0.4"
            />
            <line
              x1="240"
              y1="18"
              x2="240"
              y2="30"
              stroke="#5A3D28"
              strokeWidth="0.5"
              opacity="0.4"
            />
            {/* Edge */}
            <rect
              x="12"
              y="30"
              width="256"
              height="6"
              fill="#5A3D28"
              opacity="0.6"
            />
            {/* Left leg */}
            <rect x="20" y="36" width="10" height="30" rx="3" fill="#5A3522" />
            {/* Right leg */}
            <rect x="250" y="36" width="10" height="30" rx="3" fill="#5A3522" />
            {/* Lower shelf */}
            <rect
              x="14"
              y="62"
              width="252"
              height="5"
              rx="2"
              fill="#5A3D28"
              opacity="0.4"
            />
          </svg>

          {/* Pot */}
          <svg
            width="64"
            height="58"
            viewBox="0 0 64 58"
            fill="none"
            style={{
              position: "absolute",
              bottom: 54,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {/* Body */}
            <path d="M7 10 L14 54 L50 54 L57 10 Z" fill="#B87040" />
            {/* Left shade */}
            <path d="M7 10 L14 54 L24 54 L17 10 Z" fill="rgba(0,0,0,0.18)" />
            {/* Base */}
            <ellipse cx="32" cy="54" rx="19" ry="5" fill="#8E4E28" />
            {/* Rim */}
            <ellipse cx="32" cy="10" rx="27" ry="8" fill="#CA8452" />
            {/* Soil */}
            <ellipse cx="32" cy="11" rx="23" ry="5.5" fill="#3A1E0A" />
          </svg>

          {/* Landing shadow */}
          <div className="mot-shadow" />

          {/* Seed */}
          <svg
            width="36"
            height="28"
            viewBox="0 0 36 28"
            fill="none"
            className="mot-seed"
          >
            <ellipse cx="18" cy="16" rx="14" ry="10" fill="#5C3D2A" />
            <ellipse
              cx="14"
              cy="13"
              rx="6"
              ry="3.5"
              fill="#8B6247"
              opacity="0.45"
              transform="rotate(-20 14 13)"
            />
          </svg>

          {/* Particles */}
          <div className="mot-p mot-p1" />
          <div className="mot-p mot-p2" />
          <div className="mot-p mot-p3" />
        </div>

        {/* Copy */}
        <div className="mot-copy">
          <p
            className="mot-line1"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: "#A89070",
              marginBottom: 6,
              opacity: 0,
            }}
          >
            Something is beginning.
          </p>
          <p
            className="mot-line2"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 22,
              fontStyle: "italic",
              color: "#F5EFE4",
              opacity: 0,
            }}
          >
            Your {habitName} seed has been planted.
          </p>
        </div>

        {/* Dismiss */}
        <div className="mot-dismiss" onClick={onClose} style={{ opacity: 0 }}>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              fontVariant: "small-caps",
              letterSpacing: "0.12em",
              color: "#C4A882",
            }}
          >
            Continue
          </span>
        </div>
      </div>
    </>
  );
}
