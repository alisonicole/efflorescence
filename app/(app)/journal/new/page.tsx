"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Parse from "parse";
import { initParse } from "@/lib/parse";
import { getPrompt } from "@/lib/prompts";
import type { Spiral } from "@/types";
import TopBar from "@/components/layout/TopBar";
import EntryEditor from "@/components/journal/EntryEditor";

function NewEntryInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState("");
  const [spiralContext, setSpiralContext] = useState<Spiral | undefined>();

  const loadPrompt = useCallback(async () => {
    const paramSpiral = searchParams.get("spiral") as Spiral | null;

    if (paramSpiral) {
      setSpiralContext(paramSpiral);
      setPrompt(getPrompt(paramSpiral));
      return;
    }

    initParse();
    const user = Parse.User.current();
    if (!user) {
      setPrompt(getPrompt());
      return;
    }

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const checkInQuery = new Parse.Query("CheckIn");
      checkInQuery.equalTo("user", user);
      checkInQuery.greaterThanOrEqualTo("date", today);
      checkInQuery.lessThan("date", tomorrow);
      checkInQuery.limit(1);
      const todayCheckIn = await checkInQuery.first();
      const spiral = todayCheckIn?.get("spiral") as Spiral | undefined;
      setSpiralContext(spiral);
      setPrompt(getPrompt(spiral));
    } catch {
      setPrompt(getPrompt());
    }
  }, [searchParams]);

  useEffect(() => {
    void loadPrompt();
  }, [loadPrompt]);

  return (
    <>
      <TopBar title="new entry" subtitle="Write something true" />
      <div className="pt-2 pb-4">
        <EntryEditor
          prompt={prompt}
          spiralContext={spiralContext}
          onSaved={() => router.push("/journal")}
        />
      </div>
    </>
  );
}

export default function NewEntryPage() {
  return (
    <Suspense>
      <NewEntryInner />
    </Suspense>
  );
}
