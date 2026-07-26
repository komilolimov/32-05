import type { JobStatus, UrlStatus } from '../model/types';

export function isTerminalJobStatus(status: JobStatus): boolean {
  return status === 'completed' || status === 'cancelled' || status === 'failed';
}

export function isTerminalUrlStatus(status: UrlStatus): boolean {
  return status === 'success' || status === 'error' || status === 'cancelled';
}
