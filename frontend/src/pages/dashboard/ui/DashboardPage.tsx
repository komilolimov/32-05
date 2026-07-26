import { CreateJobForm } from '../../../features/create-job';
import { JobList } from '../../../widgets/job-list';
import { JobDetails } from '../../../widgets/job-details';

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 mb-2 tracking-tight">Async URL Checker</h1>
          <p className="text-zinc-400">Monitor and manage URL processing jobs in real-time.</p>
        </div>

        <section className="bg-zinc-950 p-6 border border-zinc-800 rounded-lg">
          <h2 className="text-lg font-semibold text-zinc-100 mb-4 tracking-tight">Create New Job</h2>
          <CreateJobForm />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4 tracking-tight">Job List</h2>
            <JobList />
          </section>
          
          <section className="lg:col-span-2">
            <JobDetails />
          </section>
        </div>
      </div>
    </div>
  );
}
