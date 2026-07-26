import { useState } from 'react';
import { jobsApi } from '../../../shared/api/jobsApi';
import { useJobStore, selectUpdateJobDetails } from '../../../entities/job/model/store';

export function useCancelJob() {
  const [isCancelling, setIsCancelling] = useState(false);
  const updateJobDetails = useJobStore(selectUpdateJobDetails);

  const cancelJob = async (id: string) => {
    setIsCancelling(true);
    try {
      const updatedJob = await jobsApi.cancelJob(id);
      updateJobDetails(updatedJob);
    } catch (error) {
    } finally {
      setIsCancelling(false);
    }
  };

  return { cancelJob, isCancelling };
}
