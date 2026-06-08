"use client";

import { useEffect, useState } from "react";

interface Props {
  habitName: string;
  onClose: () => void;
}

const MOTES = [
  { x: -22, drift: "-18px", delay: "3.2s", size: 4, color: "#B8AADA" },
  { x: 10, drift: "14px", delay: "3.35s", size: 3, color: "#9B8EC4" },
  { x: -6, drift: "-8px", delay: "3.5s", size: 5, color: "#D4C9E8" },
  { x: 18, drift: "22px", delay: "3.4s", size: 3, color: "#B8AADA" },
  { x: -14, drift: "-24px", delay: "3.55s", size: 4, color: "#9B8EC4" },
  { x: 4, drift: "6px", delay: "3.6s", size: 3, color: "#D4C9E8" },
];

export default function HatchOverlay({ habitName, onClose }: Props) {
  const [canDismiss, setCanDismiss] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setCanDismiss(true), 2000);
    return () => clearTimeout(t);
  }, []);

  function handleClick() {
    if (canDismiss) onClose();
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400;1,500&family=DM+Mono:wght@400;500&display=swap');

        .hov-overlay {
          animation: hov-fade-in 0.2s ease-out both;
        }
        @keyframes hov-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes hov-glow-burst {
          0%   { opacity: 0;    transform: translateX(-50%) scale(0.05); }
          35%  { opacity: 1;    transform: translateX(-50%) scale(0.35); }
          100% { opacity: 0.45; transform: translateX(-50%) scale(1); }
        }

        .hov-shell-l {
          position: absolute;
          bottom: 52px;
          left: 50%;
          animation: hov-shell-l 0.7s 1.6s ease-out both;
          transform-origin: center bottom;
        }
        @keyframes hov-shell-l {
          0%   { transform: translateX(-50%) rotate(0deg);    opacity: 1; }
          100% { transform: translateX(calc(-50% - 30px)) rotate(-42deg); opacity: 0; }
        }

        .hov-shell-r {
          position: absolute;
          bottom: 52px;
          left: 50%;
          animation: hov-shell-r 0.7s 1.65s ease-out both;
          transform-origin: center bottom;
        }
        @keyframes hov-shell-r {
          0%   { transform: translateX(-50%) rotate(0deg);   opacity: 1; }
          100% { transform: translateX(calc(-50% + 30px)) rotate(42deg); opacity: 0; }
        }

        .hov-stem {
          position: absolute;
          bottom: 62px;
          left: 50%;
          transform: translateX(-50%) scaleY(0);
          transform-origin: bottom center;
          animation: hov-stem-grow 0.6s 2.2s ease-out forwards;
          opacity: 0;
        }
        @keyframes hov-stem-grow {
          from { transform: translateX(-50%) scaleY(0); opacity: 0; }
          to   { transform: translateX(-50%) scaleY(1); opacity: 1; }
        }

        .hov-leaf-l {
          position: absolute;
          bottom: 118px;
          left: calc(50% - 38px);
          transform: rotate(-70deg) scale(0.2);
          opacity: 0;
          animation: hov-leaf-l 0.5s 2.65s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        @keyframes hov-leaf-l {
          0%   { transform: rotate(-70deg) scale(0.2); opacity: 0; }
          65%  { transform: rotate(8deg)   scale(1.05); opacity: 1; }
          100% { transform: rotate(0deg)   scale(1);    opacity: 1; }
        }

        .hov-leaf-r {
          position: absolute;
          bottom: 118px;
          left: calc(50% + 14px);
          transform: rotate(70deg) scale(0.2);
          opacity: 0;
          animation: hov-leaf-r 0.5s 2.75s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        @keyframes hov-leaf-r {
          0%   { transform: rotate(70deg)  scale(0.2); opacity: 0; }
          65%  { transform: rotate(-8deg)  scale(1.05); opacity: 1; }
          100% { transform: rotate(0deg)   scale(1);    opacity: 1; }
        }

        .hov-bloom {
          position: absolute;
          bottom: 170px;
          left: 50%;
          transform: translateX(-50%) scale(0.4);
          opacity: 0;
          animation: hov-bloom 0.55s 3.0s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        @keyframes hov-bloom {
          from { transform: translateX(-50%) scale(0.4); opacity: 0; }
          to   { transform: translateX(-50%) scale(1);   opacity: 1; }
        }

        .hov-halo {
          position: absolute;
          bottom: 140px;
          left: 50%;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(155,142,196,0.22) 0%, transparent 70%);
          transform: translateX(-50%);
          opacity: 0;
          animation: hov-halo-in 0.8s 2.8s ease-out forwards;
        }
        @keyframes hov-halo-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .hov-mote {
          position: absolute;
          border-radius: 50%;
          animation: hov-mote-float 1.8s ease-out both;
          animation-fill-mode: both;
        }
        @keyframes hov-mote-float {
          0%   { opacity: 0.85; transform: translate(0, 0); }
          100% { opacity: 0;    transform: translate(var(--drift, 0), -72px); }
        }

        .hov-copy-in {
          animation: hov-copy-in 0.4s ease-out both;
        }
        @keyframes hov-copy-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className="hov-overlay"
        onClick={handleClick}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          background: "rgba(10, 22, 14, 0.94)",
          cursor: canDismiss ? "pointer" : "default",
        }}
      >
        {/* Plant scene */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            height: 320,
          }}
        >
          {/* Soil mound */}
          <svg
            width="220"
            height="52"
            viewBox="0 0 220 52"
            fill="none"
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <path
              d="M0 52 Q30 36 75 30 Q110 26 110 26 Q110 26 145 30 Q190 36 220 52 Z"
              fill="#2E1A0E"
            />
            {/* Pebbles */}
            <ellipse
              cx="60"
              cy="38"
              rx="5"
              ry="3"
              fill="#3D2410"
              opacity="0.7"
            />
            <ellipse
              cx="155"
              cy="35"
              rx="4"
              ry="2.5"
              fill="#3D2410"
              opacity="0.6"
            />
            <ellipse
              cx="95"
              cy="30"
              rx="3"
              ry="1.8"
              fill="#4A3020"
              opacity="0.5"
            />
            {/* Root hint */}
            <path
              d="M100 32 Q90 40 85 48"
              stroke="#1E0E06"
              strokeWidth="1"
              opacity="0.45"
              fill="none"
            />
            <path
              d="M120 31 Q128 38 132 46"
              stroke="#1E0E06"
              strokeWidth="1"
              opacity="0.45"
              fill="none"
            />
          </svg>

          {/* Crack glow */}
          <div
            style={{
              position: "absolute",
              bottom: 62,
              left: "50%",
              width: 200,
              height: 200,
              borderRadius: "50%",
              background:
                "radial-gradient(ellipse, rgba(212,201,232,0.45) 0%, rgba(155,142,196,0.15) 40%, transparent 70%)",
              animation: "hov-glow-burst 1.2s 1.5s ease-out both",
              transform: "translateX(-50%) scale(0.05)",
              opacity: 0,
            }}
          />

          {/* Shell left */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            className="hov-shell-l"
          >
            <path
              d="M11 2 Q2 6 2 14 Q2 20 11 20 Q11 20 11 2 Z"
              fill="#5C3D2A"
            />
            <path
              d="M11 2 Q8 7 8 14 Q8 18 11 20"
              stroke="#8B6247"
              strokeWidth="0.8"
              opacity="0.5"
              fill="none"
            />
          </svg>

          {/* Shell right */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            className="hov-shell-r"
          >
            <path
              d="M11 2 Q20 6 20 14 Q20 20 11 20 Q11 20 11 2 Z"
              fill="#5C3D2A"
            />
            <path
              d="M11 2 Q14 7 14 14 Q14 18 11 20"
              stroke="#8B6247"
              strokeWidth="0.8"
              opacity="0.5"
              fill="none"
            />
          </svg>

          {/* Halo behind plant */}
          <div className="hov-halo" />

          {/* Stem */}
          <svg
            width="8"
            height="115"
            viewBox="0 0 8 115"
            fill="none"
            className="hov-stem"
          >
            <path
              d="M4 115 Q3 80 4 60 Q5 30 4 0"
              stroke="#4A7A42"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>

          {/* Leaf left */}
          <svg
            width="34"
            height="22"
            viewBox="0 0 34 22"
            fill="none"
            className="hov-leaf-l"
          >
            <path
              d="M34 11 Q24 2 6 4 Q0 10 6 18 Q24 20 34 11 Z"
              fill="#5A8E52"
            />
            <path
              d="M34 11 Q20 10 6 11"
              stroke="#4A7A42"
              strokeWidth="0.8"
              opacity="0.5"
              fill="none"
            />
          </svg>

          {/* Leaf right */}
          <svg
            width="34"
            height="22"
            viewBox="0 0 34 22"
            fill="none"
            className="hov-leaf-r"
          >
            <path
              d="M0 11 Q10 2 28 4 Q34 10 28 18 Q10 20 0 11 Z"
              fill="#5A8E52"
            />
            <path
              d="M0 11 Q14 10 28 11"
              stroke="#4A7A42"
              strokeWidth="0.8"
              opacity="0.5"
              fill="none"
            />
          </svg>

          {/* Bloom */}
          <svg
            width="72"
            height="72"
            viewBox="0 0 72 72"
            fill="none"
            className="hov-bloom"
          >
            {/* 8 petals at various rotations */}
            {[0, 45, 90, 135, 22.5, 67.5, 112.5, 157.5].map((angle, i) => (
              <ellipse
                key={angle}
                cx="36"
                cy="36"
                rx="7"
                ry="13"
                fill={i % 2 === 0 ? "#9B8EC4" : "#B8AADA"}
                transform={`rotate(${angle} 36 36) translate(0 -13)`}
              />
            ))}
            <circle cx="36" cy="36" r="9" fill="#D4C9E8" />
            <circle cx="36" cy="36" r="5.5" fill="#F0EBF8" />
            <circle cx="36" cy="36" r="2.5" fill="#7C6FAB" />
          </svg>

          {/* Floating motes */}
          {MOTES.map((m, i) => (
            <div
              key={i}
              className="hov-mote"
              style={{
                bottom: 175,
                left: `calc(50% + ${m.x}px)`,
                width: m.size,
                height: m.size,
                background: m.color,
                animationDelay: m.delay,
                animationDuration: "1.8s",
                ["--drift" as string]: m.drift,
                opacity: 0,
              }}
            />
          ))}
        </div>

        {/* Copy */}
        <div
          style={{
            position: "absolute",
            bottom: 150,
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          <p
            className="hov-copy-in"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 26,
              fontStyle: "italic",
              color: "#F5EFE4",
              marginBottom: 6,
              animationDelay: "3.4s",
              opacity: 0,
            }}
          >
            Your lavender bloomed.
          </p>
          <p
            className="hov-copy-in"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: "#A89070",
              animationDelay: "3.6s",
              opacity: 0,
            }}
          >
            Seven days of {habitName}.
          </p>
        </div>

        {/* Dismiss */}
        <div
          style={{
            position: "absolute",
            bottom: 52,
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          <span
            className="hov-copy-in"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              fontVariant: "small-caps",
              letterSpacing: "0.12em",
              color: "#C4A882",
              animationDelay: "3.9s",
              opacity: 0,
            }}
          >
            Meet your plant &rarr;
          </span>
        </div>
      </div>
    </>
  );
}
