export default function DayCounter({ days }: { days: number }) {
  return (
    <div className="w-12 h-12 rounded-full bg-white/85 backdrop-blur-sm flex flex-col items-center justify-center">
      <span className="text-lg font-bold leading-none text-bark">
        {days > 999 ? "999+" : days}
      </span>
      <span className="text-[8px] uppercase tracking-widest text-muted">
        days
      </span>
    </div>
  );
}
