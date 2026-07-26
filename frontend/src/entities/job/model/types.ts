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
  status: JobStatus;
  urls: string[];
  results: UrlResult[];
  createdAt: string;
  completedAt?: string;
  totalUrls: number;
  successCount: number;
  errorCount: number;
}

export const UrlResultSchema = z.object({
  url: z.string(),
  status: z.enum(['pending', 'in_progress', 'success', 'error', 'cancelled']),
  httpStatus: z.number().nullable(),
  error: z.string().optional(),
  startedAt: z.string().optional(),
  finishedAt: z.string().optional(),
  durationMs: z.number().optional(),
});

export const JobSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled', 'failed']),
  urls: z.array(z.string()),
  results: z.array(UrlResultSchema),
  createdAt: z.string(),
  completedAt: z.string().optional(),
  totalUrls: z.number(),
  successCount: z.number(),
  errorCount: z.number(),
});
