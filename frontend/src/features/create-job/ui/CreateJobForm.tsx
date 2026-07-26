import { useState } from 'react';
import { useCreateJob } from '../model/useCreateJob';

export function CreateJobForm() {
  const [urls, setUrls] = useState('');
  const { createJob, isSubmitting, error } = useCreateJob();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void createJob(urls);
    if (!error) {
      setUrls('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md w-full">
      <div className="flex flex-col gap-2">
        <label htmlFor="urls" className="text-sm font-medium text-gray-700">
          Enter URLs (one per line)
        </label>
        <textarea
          id="urls"
          className="border border-gray-300 rounded-lg p-3 min-h-[120px] shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
          placeholder="https://example.com&#10;https://google.com"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          disabled={isSubmitting}
        />
        {error && <span className="text-sm text-danger">{error}</span>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary hover:bg-primary-hover text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Creating...' : 'Start Job'}
      </button>
    </form>
  );
}
