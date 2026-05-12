import { useEffect, useState } from 'react';
import { getHello, getProfile, getProjects, getSkills } from '../api/portfolioApi';

const initialState = {
  hello: '',
  profile: null,
  skills: [],
  projects: [],
  status: 'loading',
};

export function usePortfolioData() {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const requestConfig = { signal: controller.signal };

    async function loadPageData() {
      try {
        const [helloData, profileData, skillsData, projectsData] = await Promise.all([
          getHello(requestConfig),
          getProfile(requestConfig),
          getSkills(requestConfig),
          getProjects(requestConfig),
        ]);

        if (!isMounted) {
          return;
        }

        setState({
          hello: helloData.message,
          profile: profileData,
          skills: skillsData,
          projects: projectsData,
          status: 'success',
        });
      } catch (error) {
        if (error.code === 'ERR_CANCELED') {
          return;
        }

        if (isMounted) {
          setState((currentState) => ({ ...currentState, status: 'error' }));
        }
      }
    }

    loadPageData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return state;
}
