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
        'p-4 border-b border-zinc-800 last:border-0 cursor-pointer hover:bg-zinc-900/50 transition-colors',
        isActive ? 'bg-zinc-900/30 border-l-4 border-l-zinc-100' : 'border-l-4 border-l-transparent'
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-mono text-zinc-200 truncate pr-4">
          Job {job.id}
        </span>
        <JobStatusBadge status={job.status} />
      </div>
      <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
        <span>Total: {job.totalUrls}</span>
        <span className="text-emerald-400">✓ {job.successCount}</span>
        <span className="text-red-400">✗ {job.errorCount}</span>
      </div>
      <div className="text-[10px] text-zinc-600 font-mono mt-2 tracking-wider uppercase">
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
    return <div className="p-8 text-center text-zinc-500 text-sm bg-zinc-950 border border-zinc-800 rounded-lg">No jobs yet</div>;
  }

  const sortedJobs = [...jobs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden h-[600px] overflow-y-auto">
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
