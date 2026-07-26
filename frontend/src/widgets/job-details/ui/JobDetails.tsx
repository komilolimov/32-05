import { useEffect } from 'react';
import { useJobStore, selectActiveJobId, selectActiveJobDetails, selectUpdateJobDetails } from '../../../entities/job/model/store';
import { jobsApi } from '../../../shared/api/jobsApi';
import { JobStatusBadge } from '../../../entities/job/ui/JobStatusBadge';
import { CancelJobButton } from '../../../features/cancel-job/ui/CancelJobButton';
import { ProgressBar } from './ProgressBar';
import { UrlTable } from './UrlTable';
import { useJobPolling } from '../../../features/job-polling/model/useJobPolling';
import { Info } from 'lucide-react';

export function JobDetails() {
  const activeJobId = useJobStore(selectActiveJobId);
  const activeJobDetails = useJobStore(selectActiveJobDetails);
  const updateJobDetails = useJobStore(selectUpdateJobDetails);

  useJobPolling();

  useEffect(() => {
    if (!activeJobId) return;
    
    if (!activeJobDetails || activeJobDetails.id !== activeJobId) {
      void jobsApi.getJobById(activeJobId)
        .then(updateJobDetails)
        .catch(() => {});
    }
  }, [activeJobId, activeJobDetails?.id, updateJobDetails]);

  if (!activeJobId) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-500">
        <Info className="w-12 h-12 mb-4 text-zinc-800" />
        <p className="text-sm">Select a job from the list to view details</p>
      </div>
    );
  }

  if (!activeJobDetails || activeJobDetails.id !== activeJobId) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-500">
        <p className="text-sm">Loading details...</p>
      </div>
    );
  }

  const processedUrls = activeJobDetails.successCount + activeJobDetails.errorCount + activeJobDetails.results.filter(r => r.status === 'cancelled').length;

  return (
    <div className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-lg p-6 h-[600px] overflow-y-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100 mb-2 tracking-tight">
            Job Details
          </h2>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono text-zinc-500">{activeJobDetails.id}</span>
            <JobStatusBadge status={activeJobDetails.status} />
          </div>
          <div className="text-[10px] font-mono tracking-wider uppercase text-zinc-500 mt-4">
            Created: {new Date(activeJobDetails.createdAt).toLocaleString()}
          </div>
          {activeJobDetails.completedAt && (
             <div className="text-[10px] font-mono tracking-wider uppercase text-zinc-500 mt-1">
             Finished: {new Date(activeJobDetails.completedAt).toLocaleString()}
           </div>
          )}
        </div>
        
        <CancelJobButton job={activeJobDetails} />
      </div>

      <div className="mb-8">
        <ProgressBar processed={processedUrls} total={activeJobDetails.totalUrls} />
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-semibold text-zinc-100 mb-4 tracking-tight">URL Results</h3>
        <UrlTable results={activeJobDetails.results} />
      </div>
    </div>
  );
}
