"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import { loginWithGoogle } from "@/lib/parseAuth";

export default function SignInPage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) router.replace("/garden");
  }, [user, loading, router]);

  async function handleGoogleSuccess(credentialResponse: {
    credential?: string;
  }) {
    if (!credentialResponse.credential) return;
    setAuthError(null);
    try {
      await loginWithGoogle(credentialResponse.credential);
      refreshUser();
      router.replace("/garden");
    } catch {
      setAuthError("Something went wrong signing in. Please try again.");
    }
  }

  if (loading) return null;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between relative overflow-hidden"
      style={{ background: "#1E1A17" }}
    >
      {/* Atmospheric orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 400,
          height: 400,
          top: -100,
          right: -100,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(74,103,65,0.18) 0%, transparent 70%)",
          animation: "float-petal 12s ease-in-out infinite",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 300,
          height: 300,
          bottom: -60,
          left: -60,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(184,147,90,0.12) 0%, transparent 70%)",
          animation: "float-petal 16s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 200,
          height: 200,
          top: "40%",
          left: "20%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(201,122,110,0.07) 0%, transparent 70%)",
          animation: "float-petal 20s ease-in-out infinite",
        }}
      />

      {/* Botanical SVG — right edge */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ opacity: 0.18 }}
      >
        <svg
          width="140"
          height="420"
          viewBox="0 0 380 560"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M190 540 C190 400 188 300 192 180"
            stroke="#B8935A"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <ellipse
            cx="192"
            cy="160"
            rx="52"
            ry="68"
            fill="none"
            stroke="#DBA898"
            strokeWidth="0.8"
          />
          <ellipse
            cx="192"
            cy="148"
            rx="36"
            ry="50"
            fill="none"
            stroke="#C97A6E"
            strokeWidth="0.6"
          />
          <ellipse
            cx="192"
            cy="140"
            rx="22"
            ry="32"
            fill="none"
            stroke="#DBA898"
            strokeWidth="0.5"
          />
          <circle
            cx="192"
            cy="132"
            r="10"
            fill="none"
            stroke="#B8935A"
            strokeWidth="0.8"
          />
          <path
            d="M192 92 C175 70 160 55 152 40"
            stroke="#DBA898"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
          <path
            d="M192 92 C210 70 225 58 234 44"
            stroke="#DBA898"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
          <path
            d="M140 148 C118 140 100 138 82 132"
            stroke="#DBA898"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
          <path
            d="M244 148 C266 140 284 138 302 130"
            stroke="#DBA898"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
          <path
            d="M190 280 C160 268 130 270 108 258"
            stroke="#7A9E6E"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="M108 258 C90 248 82 236 86 220 C92 240 102 248 108 258"
            fill="none"
            stroke="#7A9E6E"
            strokeWidth="0.7"
          />
          <path
            d="M191 320 C220 308 248 312 268 300"
            stroke="#7A9E6E"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <circle
            cx="272"
            cy="296"
            r="18"
            fill="none"
            stroke="#C97A6E"
            strokeWidth="0.7"
          />
          <circle
            cx="272"
            cy="296"
            r="10"
            fill="none"
            stroke="#DBA898"
            strokeWidth="0.5"
          />
          <path
            d="M190 380 C162 368 140 374 124 362"
            stroke="#7A9E6E"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          <circle
            cx="120"
            cy="358"
            r="14"
            fill="none"
            stroke="#B8935A"
            strokeWidth="0.7"
          />
          <path
            d="M190 420 C210 408 222 400 228 388 C216 396 206 406 190 420"
            fill="none"
            stroke="#7A9E6E"
            strokeWidth="0.7"
          />
          <path
            d="M191 460 C172 450 162 442 158 430 C168 440 178 450 191 460"
            fill="none"
            stroke="#7A9E6E"
            strokeWidth="0.7"
          />
          <path
            d="M190 500 C205 494 214 488 216 480"
            stroke="#7A9E6E"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          <ellipse
            cx="218"
            cy="476"
            rx="6"
            ry="10"
            fill="none"
            stroke="#DBA898"
            strokeWidth="0.6"
            transform="rotate(15 218 476)"
          />
        </svg>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center items-start w-full px-8 relative z-10">
        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-8" style={{ opacity: 0.55 }}>
          <div
            style={{
              width: 32,
              height: 0.5,
              background: "#D4B47A",
            }}
          />
          <span
            className="font-mono text-[10px] uppercase tracking-[4px]"
            style={{ color: "#D4B47A" }}
          >
            A healing companion
          </span>
        </div>

        {/* Wordmark */}
        <div
          className="font-display font-light italic leading-none mb-0"
          style={{
            fontSize: "clamp(52px, 14vw, 72px)",
            letterSpacing: "-1px",
            color: "#F5EFE4",
          }}
        >
          efflore
          <br />
          scence
        </div>

        {/* Tagline */}
        <div className="flex items-center gap-4 mt-6">
          <div
            style={{
              width: 36,
              height: 0.5,
              background: "#B8935A",
              opacity: 0.5,
              flexShrink: 0,
            }}
          />
          <span
            className="font-display font-light italic"
            style={{ fontSize: 17, color: "rgba(245,239,228,0.5)" }}
          >
            You were always the garden.
          </span>
        </div>
      </div>

      {/* Bottom: sign-in */}
      <div className="w-full px-8 pb-16 relative z-10 flex flex-col items-center gap-4">
        {/* Gold separator */}
        <div
          className="w-full mb-4"
          style={{
            height: 0.5,
            background:
              "linear-gradient(90deg, transparent, rgba(184,147,90,0.4), transparent)",
          }}
        />

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() =>
            setAuthError("Google sign-in failed. Please try again.")
          }
          shape="pill"
          theme="filled_black"
          text="continue_with"
          size="large"
        />

        {authError && (
          <p
            className="text-xs text-center font-mono"
            style={{ color: "#C97A6E" }}
          >
            {authError}
          </p>
        )}

        <p
          className="font-mono text-[9px] uppercase tracking-[2px] text-center mt-2"
          style={{ color: "rgba(245,239,228,0.18)" }}
        >
          efflorescence™ 2026
        </p>
      </div>
    </div>
  );
}
