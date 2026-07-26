interface ProgressBarProps {
  processed: number;
  total: number;
}

export function ProgressBar({ processed, total }: ProgressBarProps) {
  const percentage = total === 0 ? 0 : Math.round((processed / total) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2 font-mono tracking-wider text-[10px] uppercase text-zinc-500">
        <span>Progress</span>
        <span>
          {processed} / {total} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-zinc-800 rounded-full h-[2px]">
        <div
          className="bg-zinc-100 h-[2px] rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
