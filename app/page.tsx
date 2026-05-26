"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import { loginWithGoogle } from "@/lib/parseAuth";
import Image from "next/image";

export default function SignInPage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/garden");
  }, [user, loading, router]);

  async function handleGoogleSuccess(credentialResponse: {
    credential?: string;
  }) {
    if (!credentialResponse.credential) return;
    await loginWithGoogle(credentialResponse.credential);
    refreshUser();
    router.replace("/garden");
  }

  if (loading) return null;

  return (
    <div className="app-shell flex flex-col items-center justify-center min-h-screen px-6">
      <div className="w-full rounded-card overflow-hidden mb-8 aspect-[4/3] relative">
        <Image
          src="/images/garden-01.jpg"
          alt="A tender garden"
          fill
          className="object-cover animate-shimmer"
          priority
        />
      </div>

      <h1 className="font-serif text-4xl font-light tracking-wide text-bark mb-1">
        tender
      </h1>
      <p className="text-xs uppercase tracking-widest text-muted mb-10">
        Tend to yourself.
      </p>

      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => console.error("Google sign-in failed")}
        shape="pill"
        theme="outline"
        text="continue_with"
      />
    </div>
  );
}
