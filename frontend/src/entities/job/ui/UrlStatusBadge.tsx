import type { UrlStatus } from '../model/types';
import { clsx } from 'clsx';

export function UrlStatusBadge({ status }: { status: UrlStatus }) {
  const styles: Record<UrlStatus, string> = {
    pending: 'border-zinc-700 text-zinc-400 bg-zinc-900/50',
    in_progress: 'border-blue-900/50 text-blue-400 bg-blue-950/30',
    success: 'border-emerald-900/50 text-emerald-400 bg-emerald-950/30',
    error: 'border-red-900/50 text-red-400 bg-red-950/30',
    cancelled: 'border-amber-900/50 text-amber-400 bg-amber-950/30',
  };

  return (
    <span className={clsx('px-2 py-0.5 rounded-full border text-xs font-mono uppercase tracking-wider', styles[status])}>
      {status.replace('_', ' ')}
    </span>
  );
}
