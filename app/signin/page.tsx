"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
      setAuthError("Something went wrong. Please try again.");
    }
  }

  if (loading) return null;

  return (
    <div style={styles.root}>
      {/* Grain overlay */}
      <div style={styles.grain} />

      {/* Atmospheric orbs */}
      <div style={{ ...styles.orb, ...styles.orb1 }} />
      <div style={{ ...styles.orb, ...styles.orb2 }} />
      <div style={{ ...styles.orb, ...styles.orb3 }} />

      {/* Back to landing */}
      <Link href="/" style={styles.backLink}>
        <span style={styles.backArrow}>←</span>
        efflorescence
      </Link>

      {/* Center card */}
      <div style={styles.card}>
        {/* Small botanical */}
        <svg
          width="48"
          height="72"
          viewBox="0 0 48 72"
          fill="none"
          style={styles.botanical}
        >
          <path
            d="M24 68 C24 52 23.5 38 24.5 22"
            stroke="#B8935A"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          <ellipse
            cx="24.5"
            cy="18"
            rx="8"
            ry="11"
            fill="none"
            stroke="#DBA898"
            strokeWidth="0.7"
          />
          <ellipse
            cx="24.5"
            cy="16"
            rx="5.5"
            ry="8"
            fill="none"
            stroke="#C97A6E"
            strokeWidth="0.5"
          />
          <circle
            cx="24.5"
            cy="13"
            r="2.5"
            fill="none"
            stroke="#B8935A"
            strokeWidth="0.6"
          />
          <path
            d="M24 32 C19 30 14 31 11 28"
            stroke="#7A9E6E"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
          <path
            d="M11 28 C8 26 7 23 8 20 C9 23 10 26 11 28"
            fill="none"
            stroke="#7A9E6E"
            strokeWidth="0.5"
          />
          <path
            d="M24.5 44 C29 42 33 43 36 41"
            stroke="#7A9E6E"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
          <circle
            cx="37"
            cy="39.5"
            r="3"
            fill="none"
            stroke="#C97A6E"
            strokeWidth="0.5"
          />
        </svg>

        {/* Eyebrow */}
        <p style={styles.eyebrow}>A healing companion</p>

        {/* Wordmark */}
        <h1 style={styles.wordmark}>efflorescence</h1>

        {/* Tagline */}
        <div style={styles.taglineRow}>
          <div style={styles.taglineRule} />
          <p style={styles.tagline}>You were always the garden.</p>
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Sign-in prompt */}
        <p style={styles.prompt}>Continue tending to your garden.</p>

        {/* Google button */}
        <div style={styles.googleWrap}>
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
        </div>

        {authError && <p style={styles.error}>{authError}</p>}

        {/* Footer note */}
        <p style={styles.footerNote}>efflorescence™ 2026</p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    background: "#1E1A17",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    padding: "24px",
  },
  grain: {
    position: "fixed",
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
    opacity: 0.028,
    pointerEvents: "none",
    zIndex: 1000,
  },
  orb: {
    position: "absolute",
    borderRadius: "50%",
    pointerEvents: "none",
  },
  orb1: {
    width: 500,
    height: 500,
    top: -180,
    right: -120,
    background:
      "radial-gradient(circle, rgba(74,103,65,0.15) 0%, transparent 70%)",
  },
  orb2: {
    width: 400,
    height: 400,
    bottom: -120,
    left: -100,
    background:
      "radial-gradient(circle, rgba(184,147,90,0.10) 0%, transparent 70%)",
  },
  orb3: {
    width: 280,
    height: 280,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background:
      "radial-gradient(circle, rgba(201,122,110,0.06) 0%, transparent 70%)",
  },
  backLink: {
    position: "absolute",
    top: 28,
    left: 32,
    fontFamily: "var(--font-mono, 'DM Mono', monospace)",
    fontSize: 9,
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: "rgba(245,239,228,0.28)",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: 10,
    transition: "color 0.3s",
    zIndex: 10,
  },
  backArrow: {
    fontSize: 12,
    opacity: 0.6,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    position: "relative",
    zIndex: 10,
    maxWidth: 400,
    width: "100%",
  },
  botanical: {
    marginBottom: 28,
    opacity: 0.7,
  },
  eyebrow: {
    fontFamily: "var(--font-mono, 'DM Mono', monospace)",
    fontSize: 9,
    letterSpacing: "4px",
    textTransform: "uppercase",
    color: "#D4B47A",
    opacity: 0.55,
    marginBottom: 20,
    margin: "0 0 20px 0",
  },
  wordmark: {
    fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
    fontSize: "clamp(48px, 12vw, 72px)",
    fontWeight: 300,
    fontStyle: "italic",
    letterSpacing: "-1.5px",
    color: "#F5EFE4",
    lineHeight: 1,
    margin: "0 0 24px 0",
  },
  taglineRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 40,
    justifyContent: "center",
  },
  taglineRule: {
    width: 32,
    height: 0.5,
    background: "#B8935A",
    opacity: 0.45,
    flexShrink: 0,
  },
  tagline: {
    fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
    fontSize: 16,
    fontWeight: 300,
    fontStyle: "italic",
    color: "rgba(245,239,228,0.45)",
    margin: 0,
  },
  divider: {
    width: "100%",
    height: 0.5,
    background:
      "linear-gradient(90deg, transparent, rgba(184,147,90,0.35), transparent)",
    marginBottom: 36,
  },
  prompt: {
    fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
    fontSize: 13,
    fontWeight: 300,
    color: "rgba(245,239,228,0.35)",
    letterSpacing: "0.3px",
    marginBottom: 24,
    margin: "0 0 24px 0",
  },
  googleWrap: {
    marginBottom: 16,
  },
  error: {
    fontFamily: "var(--font-mono, 'DM Mono', monospace)",
    fontSize: 10,
    color: "#C97A6E",
    marginTop: 8,
    margin: "8px 0 0 0",
  },
  footerNote: {
    fontFamily: "var(--font-mono, 'DM Mono', monospace)",
    fontSize: 8,
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "rgba(245,239,228,0.12)",
    marginTop: 40,
    margin: "40px 0 0 0",
  },
};
