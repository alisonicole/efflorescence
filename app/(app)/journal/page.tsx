"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import DiaryTab from "@/components/journal/tabs/DiaryTab";
import FullPictureTab from "@/components/journal/tabs/FullPictureTab";
import AffirmationsTab from "@/components/journal/tabs/AffirmationsTab";
import WhyTab from "@/components/journal/tabs/WhyTab";

type JournalTab = "diary" | "full_picture" | "affirmations" | "why";

const TABS: { id: JournalTab; label: string }[] = [
  { id: "diary", label: "Diary" },
  { id: "full_picture", label: "Full Picture" },
  { id: "affirmations", label: "Affirmations" },
  { id: "why", label: "Commitments" },
];

export default function JournalPage() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") ?? "";
  const [activeTab, setActiveTab] = useState<JournalTab>("diary");

  return (
    <>
      <TopBar title="journal" subtitle="Your entries" />
      <div className="px-2.5 pt-2 pb-3">
        <div className="flex border border-border rounded-card overflow-hidden">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 font-mono text-[7.5px] uppercase tracking-[1.5px] transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-bark text-cream"
                  : "bg-white text-bark/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {activeTab === "diary" && <DiaryTab initialPrompt={initialPrompt} />}
      {activeTab === "full_picture" && <FullPictureTab />}
      {activeTab === "affirmations" && <AffirmationsTab />}
      {activeTab === "why" && <WhyTab />}
    </>
  );
}
