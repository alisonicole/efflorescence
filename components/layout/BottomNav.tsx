"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface BottomNavProps {
  onGround: () => void;
}

export default function BottomNav({ onGround }: BottomNavProps) {
  const pathname = usePathname();

  const tab = (href: string, icon: string, label: string) => {
    const active =
      href === "/garden" ? pathname === href : pathname.startsWith(href);
    return (
      <Link href={href} className="flex flex-col items-center gap-0.5">
        <span className="text-lg">{icon}</span>
        <span
          className={`text-[9px] uppercase tracking-wider ${active ? "text-bark font-semibold" : "text-muted"}`}
        >
          {label}
        </span>
      </Link>
    );
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app bg-white border-t border-border flex items-center justify-around px-4 py-2 pb-3 z-10">
      {tab("/garden", "🏡", "garden")}
      {tab("/calendar", "◎", "journey")}

      <button
        onClick={onGround}
        className="flex flex-col items-center gap-0.5 -mt-4"
      >
        <span className="w-11 h-11 rounded-full bg-clay text-cream flex items-center justify-center text-xl shadow-md">
          🌿
        </span>
        <span className="text-[9px] uppercase tracking-wider text-clay font-semibold">
          ground
        </span>
      </button>

      {tab("/journal", "✏️", "journal")}
      {tab("/inspire", "🌸", "inspire")}
    </nav>
  );
}
