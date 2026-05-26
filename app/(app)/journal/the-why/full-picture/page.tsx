import TopBar from "@/components/layout/TopBar";
import FullPicture from "@/components/journal/FullPicture";

export default function FullPicturePage() {
  return (
    <>
      <TopBar title="the full picture" subtitle="Add as you remember things." />
      <div className="pt-2 pb-4 px-2.5">
        <FullPicture />
      </div>
    </>
  );
}
