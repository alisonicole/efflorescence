"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Parse from "parse";
import { useAuth } from "@/context/AuthContext";

interface TopBarProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

export default function TopBar({ title, subtitle, action }: TopBarProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const avatarUrl = user?.get("avatarUrl") as string | undefined;

  async function handleSignOut() {
    await Parse.User.logOut();
    router.push("/signin");
  }

  return (
    <>
      <div className="flex justify-between items-start px-4 pt-3 pb-2 bg-cream">
        <div>
          <h1 className="font-display text-2xl font-light italic tracking-tight text-bark">
            {title}
          </h1>
          <p className="font-mono text-[9px] uppercase tracking-[3px] text-soil opacity-60">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {action && <div>{action}</div>}
          <button
            onClick={() => setOpen(true)}
            className="w-8 h-8 rounded-full bg-border overflow-hidden flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Settings"
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="avatar"
                width={32}
                height={32}
                className="object-cover"
              />
            ) : (
              <span className="text-muted text-sm">👤</span>
            )}
          </button>
        </div>
      </div>

      {/* Settings bottom sheet */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-bark/30 z-40 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
            <div className="bg-cream rounded-t-2xl px-5 pt-6 pb-10 max-w-app mx-auto">
              <div className="w-8 h-0.5 rounded-full bg-bark/15 mx-auto mb-6" />

              <p className="font-display font-light italic text-[20px] text-bark tracking-tight mb-5">
                Settings
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setOpen(false);
                    router.push("/garden?tour=1");
                  }}
                  className="w-full text-left flex items-center gap-3 p-4 rounded-xl bg-bark/[0.04] border border-bark/8 active:scale-[0.99] transition-transform"
                >
                  <span className="text-xl">🌱</span>
                  <div>
                    <p className="text-[14px] text-bark font-normal leading-tight mb-0.5">
                      Garden guide
                    </p>
                    <p className="text-[12px] text-bark/45 font-light leading-snug">
                      How the flowers grow
                    </p>
                  </div>
                </button>

                <button
                  onClick={handleSignOut}
                  className="w-full text-left flex items-center gap-3 p-4 rounded-xl bg-bark/[0.04] border border-bark/8 active:scale-[0.99] transition-transform"
                >
                  <span className="text-xl">🚪</span>
                  <div>
                    <p className="text-[14px] text-bark font-normal leading-tight">
                      Sign out
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
