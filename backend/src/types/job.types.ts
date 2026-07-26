import { z } from 'zod';

export type JobStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'failed';

export type UrlStatus = 'pending' | 'in_progress' | 'success' | 'error' | 'cancelled';

export interface UrlResult {
  url: string;
  status: UrlStatus;
  httpStatus: number | null;
  error?: string;
  startedAt?: string;
  finishedAt?: string;
  durationMs?: number;
}

export interface Job {
  id: string;
  urls: string[];
  status: JobStatus;
  results: UrlResult[];
  createdAt: string;
  completedAt?: string;
}

export const CreateJobSchema = z.object({
  urls: z
    .array(z.string().url('Invalid URL format. Must start with http:// or https://'))
    .min(1, 'At least one URL is required'),
});

export type CreateJobInput = z.infer<typeof CreateJobSchema>;
