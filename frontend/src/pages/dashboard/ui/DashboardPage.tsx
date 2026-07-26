import { CreateJobForm } from '../../../features/create-job';
import { JobList } from '../../../widgets/job-list';
import { JobDetails } from '../../../widgets/job-details';

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Dashboard</h1>
          <p className="text-gray-500">Monitor and manage URL processing jobs.</p>
        </div>

        <section className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Job</h2>
          <CreateJobForm />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job List</h2>
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
