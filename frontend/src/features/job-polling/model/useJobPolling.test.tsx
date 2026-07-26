import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useJobPolling } from './useJobPolling';
import { useJobStore } from '../../../entities/job/model/store';
import { jobsApi } from '../../../shared/api/jobsApi';
import type { Job } from '../../../entities/job/model/types';

vi.mock('../../../shared/api/jobsApi', () => ({
  jobsApi: {
    getJobById: vi.fn(),
  },
}));

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: any) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe('useJobPolling race condition', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useJobStore.setState({
      jobs: [],
      activeJobId: null,
      activeJobDetails: null,
    });
  });

  it('determines polling race condition correctly with controlled promises', async () => {
    const deferredA = createDeferred<Job>();
    const deferredB = createDeferred<Job>();

    vi.mocked(jobsApi.getJobById).mockImplementation(async (id: string) => {
      if (id === 'jobA') return deferredA.promise;
      if (id === 'jobB') return deferredB.promise;
      return Promise.reject(new Error('Unknown job'));
    });

    act(() => {
      useJobStore.setState({ activeJobId: 'jobA' });
    });

    const { unmount } = renderHook(() => useJobPolling());

    expect(jobsApi.getJobById).toHaveBeenCalledWith('jobA');
    expect(useJobStore.getState().activeJobDetails).toBeNull();

    const initialJobBData: Job = {
      id: 'jobB',
      status: 'pending',
      urls: [],
      results: [],
      createdAt: new Date().toISOString(),
      totalUrls: 0,
      successCount: 0,
      errorCount: 0,
    };

    act(() => {
      useJobStore.setState({ 
        activeJobId: 'jobB',
        activeJobDetails: initialJobBData
      });
    });

    await act(async () => {
      await new Promise(r => setTimeout(r, 0));
    });
    expect(jobsApi.getJobById).toHaveBeenCalledWith('jobB');

    const jobAData: Job = {
      id: 'jobA',
      status: 'in_progress',
      urls: [],
      results: [],
      createdAt: new Date().toISOString(),
      totalUrls: 0,
      successCount: 0,
      errorCount: 0,
    };
    
    await act(async () => {
      deferredA.resolve(jobAData);
    });

    expect(useJobStore.getState().activeJobDetails).toEqual(initialJobBData);

    const jobBData: Job = {
      id: 'jobB',
      status: 'in_progress',
      urls: [],
      results: [],
      createdAt: new Date().toISOString(),
      totalUrls: 0,
      successCount: 0,
      errorCount: 0,
    };
    
    await act(async () => {
      deferredB.resolve(jobBData);
    });

    expect(useJobStore.getState().activeJobDetails).toEqual(jobBData);
    expect(jobsApi.getJobById).toHaveBeenCalledTimes(2);

    unmount();
  });
});
