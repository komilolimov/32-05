import axios from 'axios';
import { nanoid } from 'nanoid';
import pLimit from 'p-limit';
import type { Job, JobStatus, UrlResult, UrlStatus } from '../types/job.types.js';

class JobsService {
  private jobs = new Map<string, Job>();

  public createJob(urls: string[]): Job {
    const id = nanoid();
    const initialResults: UrlResult[] = urls.map((url) => ({
      url,
      status: 'pending',
      httpStatus: null,
    }));

    const newJob: Job = {
      id,
      urls,
      status: 'pending',
      results: initialResults,
      createdAt: new Date().toISOString(),
    };

    this.jobs.set(id, newJob);

    void this.processJob(id);

    return newJob;
  }

  public getAllJobs(): Job[] {
    return Array.from(this.jobs.values());
  }

  public getJobById(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  public cancelJob(id: string): Job | undefined {
    const job = this.jobs.get(id);
    if (!job) return undefined;

    job.status = 'cancelled';
    job.completedAt = new Date().toISOString();

    job.results = job.results.map((item) => {
      if (item.status === 'pending') {
        return { ...item, status: 'cancelled' };
      }
      return item;
    });

    this.jobs.set(id, job);
    return job;
  }

  private async processJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job || job.status === 'cancelled') return;

    job.status = 'in_progress';
    this.jobs.set(jobId, job);

    const limit = pLimit(5);
    let isUnhandledError = false;

    const tasks = job.urls.map((url, index) =>
      limit(async () => {
        const currentJob = this.jobs.get(jobId);
        if (!currentJob) return;

        if (currentJob.status === 'cancelled' || currentJob.results[index]?.status === 'cancelled') {
          if (currentJob.results[index] && currentJob.results[index].status === 'pending') {
            currentJob.results[index].status = 'cancelled';
          }
          return;
        }

        if (currentJob.results[index]) {
          currentJob.results[index].status = 'in_progress';
          currentJob.results[index].startedAt = new Date().toISOString();
        }

        const startedTimeMs = Date.now();

        const checkRes = await this.checkUrl(url);

        const delayMs = Math.floor(Math.random() * 10000);
        await new Promise(r => setTimeout(r, delayMs));

        const updatedJob = this.jobs.get(jobId);
        if (!updatedJob) return;

        if (updatedJob.results[index]) {
          const urlStatus: UrlStatus = checkRes.error ? 'error' : 'success';
          updatedJob.results[index] = {
            ...updatedJob.results[index],
            status: urlStatus,
            httpStatus: checkRes.httpStatus,
            ...(checkRes.error ? { error: checkRes.error } : {}),
            finishedAt: new Date().toISOString(),
            durationMs: Date.now() - startedTimeMs,
          };
        }
      })
    );

    try {
      await Promise.all(tasks);
    } catch (_err) {
      isUnhandledError = true;
    } finally {
      const finalJob = this.jobs.get(jobId);
      if (finalJob && finalJob.status !== 'cancelled') {
        finalJob.status = isUnhandledError ? 'failed' : 'completed';
        finalJob.completedAt = new Date().toISOString();
        this.jobs.set(jobId, finalJob);
      }
    }
  }

  private async checkUrl(url: string): Promise<{ httpStatus: number | null; error?: string }> {
    try {
      const response = await axios.head(url, {
        timeout: 5000,
        validateStatus: () => true,
        headers: {
          'User-Agent': 'Status-Checker/1.0',
        },
      });

      return {
        httpStatus: response.status,
      };
    } catch (error: unknown) {
      let errorMessage = 'Network error';

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Request timeout (5s)';
        } else if (error.response) {
          return {
            httpStatus: error.response.status,
          };
        } else if (error.message) {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      return {
        httpStatus: null,
        error: errorMessage,
      };
    }
  }
}

export const jobsService = new JobsService();

export function getJobSummary(job: Job) {
  let successCount = 0;
  let errorCount = 0;
  
  for (const result of job.results) {
    if (result.status === 'success') {
      successCount++;
    } else if (result.status === 'error') {
      errorCount++;
    }
  }

  return {
    ...job,
    totalUrls: job.urls.length,
    successCount,
    errorCount,
  };
}
