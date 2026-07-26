interface ProgressBarProps {
  processed: number;
  total: number;
}

export function ProgressBar({ processed, total }: ProgressBarProps) {
  const percentage = total === 0 ? 0 : Math.round((processed / total) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1 text-sm font-medium text-gray-700">
        <span>Progress</span>
        <span>
          {processed} of {total} processed ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
