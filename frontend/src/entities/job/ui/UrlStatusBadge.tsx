import type { UrlStatus } from '../model/types';
import { clsx } from 'clsx';

export function UrlStatusBadge({ status }: { status: UrlStatus }) {
  const styles: Record<UrlStatus, string> = {
    pending: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-red-700',
    cancelled: 'bg-orange-100 text-orange-700',
  };

  return (
    <span className={clsx('px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider', styles[status])}>
      {status.replace('_', ' ')}
    </span>
  );
}
