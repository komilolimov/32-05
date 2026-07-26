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
        <label htmlFor="urls" className="text-sm font-medium text-zinc-400">
          Enter URLs (one per line)
        </label>
        <textarea
          id="urls"
          className="border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder-zinc-600 rounded-md p-3 min-h-[120px] focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none text-sm font-mono transition-colors resize-y"
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
        className="bg-white hover:bg-zinc-200 text-black py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50 tracking-tight"
      >
        {isSubmitting ? 'Creating...' : 'Start Job'}
      </button>
    </form>
  );
}
