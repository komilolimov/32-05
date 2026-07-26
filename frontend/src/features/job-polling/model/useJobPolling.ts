import { useEffect } from 'react';
import { useJobStore, selectActiveJobId, selectUpdateJobDetails } from '../../../entities/job/model/store';
import { jobsApi } from '../../../shared/api/jobsApi';
import { isTerminalJobStatus } from '../../../entities/job/lib/isTerminalStatus';

export function useJobPolling() {
  const activeJobId = useJobStore(selectActiveJobId);
  const updateJobDetails = useJobStore(selectUpdateJobDetails);

  useEffect(() => {
    if (!activeJobId) return;

    let isCancelled = false;
    let timerId: ReturnType<typeof setTimeout>;

    const poll = async () => {
      if (isCancelled) return;
      

      
      try {
        const updatedJob = await jobsApi.getJobById(activeJobId);
        
        if (isCancelled) return;
        
        updateJobDetails(updatedJob);

        if (!isTerminalJobStatus(updatedJob.status)) {
          timerId = setTimeout(poll, 1500);
        }
      } catch (error) {
        if (!isCancelled) {
          timerId = setTimeout(poll, 3000);
        }
      }
    };

    void poll();

    return () => {
      isCancelled = true;
      clearTimeout(timerId);
    };
  }, [activeJobId, updateJobDetails]);
}
