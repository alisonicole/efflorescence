"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app bg-white border-t border-border flex items-center justify-around px-4 py-2 pb-3 z-10">
      <Link href="/garden" className="flex flex-col items-center gap-0.5">
        <span className="text-lg">🏡</span>
        <span
          className={`text-[9px] uppercase tracking-wider ${pathname === "/garden" ? "text-bark font-semibold" : "text-muted"}`}
        >
          garden
        </span>
      </Link>

      <Link href="/journal" className="flex flex-col items-center gap-0.5">
        <span className="text-lg">✏️</span>
        <span
          className={`text-[9px] uppercase tracking-wider ${pathname.startsWith("/journal") ? "text-bark font-semibold" : "text-muted"}`}
        >
          journal
        </span>
      </Link>

      <div className="flex flex-col items-center gap-0.5 opacity-40 cursor-not-allowed">
        <span className="text-lg">🏛</span>
        <span className="text-[9px] uppercase tracking-wider text-muted">
          museum
        </span>
      </div>

      <div className="flex flex-col items-center gap-0.5 opacity-40 cursor-not-allowed">
        <span className="text-lg">♡</span>
        <span className="text-[9px] uppercase tracking-wider text-muted">
          friends
        </span>
      </div>
    </nav>
  );
}
