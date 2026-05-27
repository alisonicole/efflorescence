"use client";

import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import DiaryTab from "@/components/journal/tabs/DiaryTab";
import FullPictureTab from "@/components/journal/tabs/FullPictureTab";
import RewriteTab from "@/components/journal/tabs/RewriteTab";
import WhyTab from "@/components/journal/tabs/WhyTab";

type JournalTab = "diary" | "full_picture" | "rewrite" | "why";

const TABS: { id: JournalTab; label: string }[] = [
  { id: "diary", label: "Diary" },
  { id: "full_picture", label: "Full Picture" },
  { id: "rewrite", label: "Rewrite Room" },
  { id: "why", label: "The Why" },
];

export default function JournalPage() {
  const [activeTab, setActiveTab] = useState<JournalTab>("diary");

  return (
    <>
      <TopBar title="journal" subtitle="Your entries" />
      <div className="px-2.5 pt-2 pb-3">
        <div className="flex rounded-card overflow-hidden border border-border">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-[8.5px] font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-bark text-cream"
                  : "bg-white text-bark"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {activeTab === "diary" && <DiaryTab />}
      {activeTab === "full_picture" && <FullPictureTab />}
      {activeTab === "rewrite" && <RewriteTab />}
      {activeTab === "why" && <WhyTab />}
    </>
  );
}
