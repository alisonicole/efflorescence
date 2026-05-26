import Link from "next/link";
import TopBar from "@/components/layout/TopBar";
import EntryList from "@/components/journal/EntryList";

export default function JournalPage() {
  return (
    <>
      <TopBar title="journal" subtitle="Your entries" />
      <div className="pt-2 pb-4">
        <div className="px-2.5 mb-3">
          <Link
            href="/journal/new"
            className="block w-full bg-bark text-cream rounded-card py-3 text-sm text-center font-medium"
          >
            + New entry
          </Link>
        </div>
        <EntryList />
      </div>
    </>
  );
}
