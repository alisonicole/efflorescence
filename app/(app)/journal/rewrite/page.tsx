"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Spiral } from "@/types";
import TopBar from "@/components/layout/TopBar";
import RewriteRoom from "@/components/journal/RewriteRoom";

function RewriteRoomInner() {
  const router = useRouter();
  const params = useSearchParams();
  const spiral = params.get("spiral") as Spiral | null;

  if (spiral !== "the_but_he" && spiral !== "the_what_if") {
    router.replace("/journal");
    return null;
  }

  return (
    <>
      <TopBar title="rewrite room" subtitle="Two passes. Full truth." />
      <div className="pt-2 pb-4">
        <RewriteRoom
          spiral={spiral}
          onComplete={() => router.push("/journal")}
        />
      </div>
    </>
  );
}

export default function RewritePage() {
  return (
    <Suspense>
      <RewriteRoomInner />
    </Suspense>
  );
}
