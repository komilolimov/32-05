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
      <div className="flex flex-col items-center justify-center h-[600px] bg-gray-50 border border-gray-200 rounded-lg text-gray-500">
        <Info className="w-12 h-12 mb-4 text-gray-300" />
        <p>Select a job from the list to view details</p>
      </div>
    );
  }

  if (!activeJobDetails || activeJobDetails.id !== activeJobId) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gray-50 border border-gray-200 rounded-lg text-gray-500">
        <p>Loading details...</p>
      </div>
    );
  }

  const processedUrls = activeJobDetails.successCount + activeJobDetails.errorCount + activeJobDetails.results.filter(r => r.status === 'cancelled').length;

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm p-6 h-[600px] overflow-y-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Job Details
          </h2>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-mono text-gray-500">{activeJobDetails.id}</span>
            <JobStatusBadge status={activeJobDetails.status} />
          </div>
          <div className="text-sm text-gray-500">
            Created: {new Date(activeJobDetails.createdAt).toLocaleString()}
          </div>
          {activeJobDetails.completedAt && (
             <div className="text-sm text-gray-500">
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
        <h3 className="text-lg font-medium text-gray-900 mb-4">URL Results</h3>
        <UrlTable results={activeJobDetails.results} />
      </div>
    </div>
  );
}
