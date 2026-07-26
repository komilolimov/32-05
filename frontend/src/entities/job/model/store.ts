import { create } from 'zustand';
import type { Job } from './types';

interface JobState {
  jobs: Job[];
  activeJobId: string | null;
  activeJobDetails: Job | null;
}

interface JobActions {
  setJobs: (jobs: Job[]) => void;
  setActiveJobId: (id: string | null) => void;
  updateJobDetails: (job: Job) => void;
}

export const useJobStore = create<JobState & JobActions>()((set) => ({
  jobs: [],
  activeJobId: null,
  activeJobDetails: null,
  
  setJobs: (jobs) => set({ jobs }),
  setActiveJobId: (id) => set({ activeJobId: id }),
  updateJobDetails: (job) => set((state) => {
    const updatedJobs = state.jobs.map((j) => (j.id === job.id ? job : j));
    
    const newActiveJobDetails = state.activeJobId === job.id ? job : state.activeJobDetails;

    if (!state.jobs.some((j) => j.id === job.id)) {
        updatedJobs.push(job);
    }
    
    return {
      jobs: updatedJobs,
      activeJobDetails: newActiveJobDetails,
    };
  }),
}));

export const selectJobs = (state: JobState & JobActions) => state.jobs;
export const selectActiveJobId = (state: JobState & JobActions) => state.activeJobId;
export const selectActiveJobDetails = (state: JobState & JobActions) => state.activeJobDetails;
export const selectSetJobs = (state: JobState & JobActions) => state.setJobs;
export const selectSetActiveJobId = (state: JobState & JobActions) => state.setActiveJobId;
export const selectUpdateJobDetails = (state: JobState & JobActions) => state.updateJobDetails;
