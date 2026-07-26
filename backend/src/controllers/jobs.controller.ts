import type { Request, Response } from 'express';
import { jobsService, getJobSummary } from '../services/jobs.service.js';
import { CreateJobSchema } from '../types/job.types.js';

export function createJobController(req: Request, res: Response): void {
  const parseResult = CreateJobSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({
      error: 'Validation Error',
      details: parseResult.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  const job = jobsService.createJob(parseResult.data.urls);
  res.status(201).json({ jobId: job.id });
}

export function getAllJobsController(_req: Request, res: Response): void {
  const jobs = jobsService.getAllJobs().map(getJobSummary);
  res.status(200).json(jobs);
}

export function getJobByIdController(req: Request, res: Response): void {
  const { id } = req.params;
  if (typeof id !== 'string') {
    res.status(400).json({ error: 'Job ID parameter must be a string' });
    return;
  }

  const job = jobsService.getJobById(id);

  if (!job) {
    res.status(404).json({ error: 'Job not found' });
    return;
  }

  res.status(200).json(getJobSummary(job));
}

export function deleteJobController(req: Request, res: Response): void {
  const { id } = req.params;
  if (typeof id !== 'string') {
    res.status(400).json({ error: 'Job ID parameter must be a string' });
    return;
  }

  const cancelledJob = jobsService.cancelJob(id);

  if (!cancelledJob) {
    res.status(404).json({ error: 'Job not found' });
    return;
  }

  res.status(200).json({
    message: 'Job cancelled successfully',
    job: getJobSummary(cancelledJob),
  });
}
