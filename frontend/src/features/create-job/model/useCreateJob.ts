import { useState } from 'react';
import { jobsApi } from '../../../shared/api/jobsApi';
import { useJobStore, selectSetActiveJobId } from '../../../entities/job/model/store';

export function useCreateJob() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const setActiveJobId = useJobStore(selectSetActiveJobId);

  const createJob = async (urlsString: string) => {
    const urls = urlsString
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean);

    if (urls.length === 0) {
      setError('Please enter at least one URL');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await jobsApi.createJob(urls);
      setActiveJobId(response.jobId);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create job');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createJob, isSubmitting, error };
}
