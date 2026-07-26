import type { JobStatus } from '../model/types';
import { clsx } from 'clsx';

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const styles: Record<JobStatus, string> = {
    pending: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-blue-100 text-blue-700 animate-pulse',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-orange-100 text-orange-700',
    failed: 'bg-red-100 text-red-700',
  };

  return (
    <span className={clsx('px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider', styles[status])}>
      {status.replace('_', ' ')}
    </span>
  );
}
