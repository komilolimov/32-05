import { useCancelJob } from '../model/useCancelJob';
import { isTerminalJobStatus } from '../../../entities/job/lib/isTerminalStatus';
import type { Job } from '../../../entities/job/model/types';

interface CancelJobButtonProps {
  job: Job;
}

export function CancelJobButton({ job }: CancelJobButtonProps) {
  const { cancelJob, isCancelling } = useCancelJob();
  const isTerminal = isTerminalJobStatus(job.status);

  if (isTerminal) {
    return null;
  }

  return (
    <button
      onClick={() => void cancelJob(job.id)}
      disabled={isCancelling}
      className="bg-transparent border border-zinc-800 hover:border-red-900 hover:bg-red-950/30 text-red-500 py-1 px-4 rounded-md font-medium transition-colors disabled:opacity-50 text-sm tracking-tight"
    >
      {isCancelling ? 'Cancelling...' : 'Cancel Job'}
    </button>
  );
}
