import { useEffect, useState } from 'react';
import { getJobs } from '../api/portfolioApi';

const initialState = {
  jobs: [],
  status: 'loading',
};

export function useJobListings() {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function loadJobs() {
      try {
        const jobs = await getJobs({ signal: controller.signal });

        if (!isMounted) {
          return;
        }

        setState({
          jobs: Array.isArray(jobs) ? jobs : [],
          status: 'success',
        });
      } catch (error) {
        if (error.code === 'ERR_CANCELED') {
          return;
        }

        if (isMounted) {
          setState((currentState) => ({
            jobs: currentState.jobs,
            status: 'error',
          }));
        }
      }
    }

    loadJobs();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return state;
}
