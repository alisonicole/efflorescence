import HabitGrid from "@/components/habits/HabitGrid";
import TopBar from "@/components/layout/TopBar";

export default function HabitsPage() {
  return (
    <>
      <TopBar title="habits" subtitle="small things, every day" />
      <div className="pt-2 pb-4 px-2.5">
        <HabitGrid />
      </div>
    </>
  );
}
