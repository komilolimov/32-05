import { memo, useEffect } from 'react';
import { useJobStore, selectJobs, selectActiveJobId, selectSetActiveJobId, selectSetJobs } from '../../../entities/job/model/store';
import { jobsApi } from '../../../shared/api/jobsApi';
import { JobStatusBadge } from '../../../entities/job/ui/JobStatusBadge';
import { clsx } from 'clsx';
import type { Job } from '../../../entities/job/model/types';

const JobRow = memo(({ job, isActive, onClick }: { job: Job; isActive: boolean; onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'p-4 border-b last:border-0 cursor-pointer hover:bg-gray-50 transition-colors',
        isActive ? 'bg-blue-50 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-medium text-gray-900 truncate pr-4">
          Job {job.id}
        </span>
        <JobStatusBadge status={job.status} />
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>Total: {job.totalUrls}</span>
        <span className="text-green-600">✓ {job.successCount}</span>
        <span className="text-red-600">✗ {job.errorCount}</span>
      </div>
      <div className="text-xs text-gray-400 mt-2">
        {new Date(job.createdAt).toLocaleString()}
      </div>
    </div>
  );
});

JobRow.displayName = 'JobRow';

export function JobList() {
  const jobs = useJobStore(selectJobs);
  const activeJobId = useJobStore(selectActiveJobId);
  const setActiveJobId = useJobStore(selectSetActiveJobId);
  const setJobs = useJobStore(selectSetJobs);

  useEffect(() => {
    void jobsApi.getJobs().then((data) => setJobs(data));
  }, [setJobs]);

  if (jobs.length === 0) {
    return <div className="p-8 text-center text-gray-500">No jobs yet</div>;
  }

  const sortedJobs = [...jobs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden h-[600px] overflow-y-auto">
      {sortedJobs.map((job) => (
        <JobRow
          key={job.id}
          job={job}
          isActive={activeJobId === job.id}
          onClick={() => setActiveJobId(job.id)}
        />
      ))}
    </div>
  );
}
