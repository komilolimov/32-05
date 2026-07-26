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
      className="bg-red-100 hover:bg-red-200 text-red-700 py-1 px-4 rounded font-medium transition-colors disabled:opacity-50 text-sm"
    >
      {isCancelling ? 'Cancelling...' : 'Cancel Job'}
    </button>
  );
}
