import type { JournalEntry } from "@/types";

export default function EntryCard({ entry }: { entry: JournalEntry }) {
  const date = new Date(entry.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-card p-4 shadow-sm">
      <p className="text-[10px] uppercase tracking-widest text-muted mb-1">
        {date}
      </p>
      {entry.prompt && (
        <p className="text-[11px] italic text-muted border-l-2 border-border pl-2 mb-2">
          {entry.prompt}
        </p>
      )}
      <p className="text-sm text-bark leading-relaxed line-clamp-4">
        {entry.content}
      </p>
    </div>
  );
}
