import { z } from 'zod';
import { fetchClient } from './client';
import { JobSchema } from '../../entities/job/model/types';
import type { Job } from '../../entities/job/model/types';

export const jobsApi = {
  async createJob(urls: string[]): Promise<{ jobId: string }> {
    const res = await fetchClient('/jobs', {
      method: 'POST',
      body: JSON.stringify({ urls }),
    });
    const data = await res.json();
    return z.object({ jobId: z.string() }).parse(data);
  },

  async getJobs(): Promise<Job[]> {
    const res = await fetchClient('/jobs');
    const data = await res.json();
    return z.array(JobSchema).parse(data);
  },

  async getJobById(id: string): Promise<Job> {
    const res = await fetchClient(`/jobs/${id}`);
    const data = await res.json();
    return JobSchema.parse(data);
  },

  async cancelJob(id: string): Promise<Job> {
    const res = await fetchClient(`/jobs/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    const resultSchema = z.object({
      message: z.string(),
      job: JobSchema,
    });
    const parsed = resultSchema.parse(data);
    return parsed.job;
  },
};
