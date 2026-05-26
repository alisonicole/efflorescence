"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

interface TopBarProps {
  title: string;
  subtitle: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  const { user } = useAuth();
  const avatarUrl = user?.get("avatarUrl") as string | undefined;

  return (
    <div className="flex justify-between items-start px-4 pt-3 pb-2 bg-cream">
      <div>
        <h1 className="font-display text-2xl font-light italic tracking-tight text-bark">
          {title}
        </h1>
        <p className="font-mono text-[9px] uppercase tracking-[3px] text-soil opacity-60">
          {subtitle}
        </p>
      </div>
      <div className="w-8 h-8 rounded-full bg-border overflow-hidden flex items-center justify-center">
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
      </div>
    </div>
  );
}
