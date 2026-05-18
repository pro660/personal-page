import { useEffect, useState } from 'react';
import { getHello, getOpportunities, getProjects, getSkills } from '../api/portfolioApi';

const fallbackData = {
  hello: 'MySQL connected portfolio API',
  skills: ['React', 'Spring Boot', 'MySQL', 'JWT', 'REST API'],
  projects: [
    {
      id: 'fallback-personal-page',
      title: 'Personal Page',
      description: 'React CRA frontend and Spring Boot backend connected to MySQL.',
      githubUrl: 'https://github.com/pro660',
      demoUrl: '',
    },
    {
      id: 'fallback-portfolio-api',
      title: 'Portfolio API',
      description: 'REST APIs for profile, skills, projects, contact, auth, board, and comments.',
      githubUrl: 'https://github.com/pro660',
      demoUrl: '',
    },
  ],
  opportunities: [],
};

const initialState = {
  ...fallbackData,
  opportunitiesStatus: 'loading',
  status: 'loading',
};

const OPPORTUNITY_RETRY_DELAYS = [0, 1200, 2200, 3500];

function wait(ms, signal) {
  if (ms === 0) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Request canceled', 'AbortError'));
      return;
    }

    const timeoutId = window.setTimeout(resolve, ms);

    signal.addEventListener(
      'abort',
      () => {
        window.clearTimeout(timeoutId);
        reject(new DOMException('Request canceled', 'AbortError'));
      },
      { once: true }
    );
  });
}

export function usePortfolioData({ includeCore = true, includeOpportunities = true } = {}) {
  const [state, setState] = useState(() => ({
    ...initialState,
    opportunitiesStatus: includeOpportunities ? 'loading' : 'success',
    status: includeCore ? 'loading' : 'success',
  }));

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const requestConfig = { signal: controller.signal };

    async function loadCoreData() {
      try {
        const [helloData, skillsData, projectsData] = await Promise.all([
          getHello(requestConfig),
          getSkills(requestConfig),
          getProjects(requestConfig),
        ]);

        if (!isMounted) {
          return;
        }

        setState((currentState) => ({
          ...currentState,
          hello: helloData.message || fallbackData.hello,
          skills: skillsData?.length > 0 ? skillsData : fallbackData.skills,
          projects: projectsData?.length > 0 ? projectsData : fallbackData.projects,
          status: 'success',
        }));
      } catch (error) {
        if (error.code === 'ERR_CANCELED') {
          return;
        }

        if (isMounted) {
          setState((currentState) => ({
            ...currentState,
            hello: currentState.hello || fallbackData.hello,
            skills: currentState.skills.length > 0 ? currentState.skills : fallbackData.skills,
            projects: currentState.projects.length > 0 ? currentState.projects : fallbackData.projects,
            status: 'error',
          }));
        }
      }
    }

    async function loadOpportunityData() {
      let lastError = null;

      for (const retryDelay of OPPORTUNITY_RETRY_DELAYS) {
        try {
          await wait(retryDelay, controller.signal);
          const opportunitiesData = await getOpportunities(requestConfig);

          if (!isMounted) {
            return;
          }

          if (opportunitiesData?.length > 0) {
            setState((currentState) => ({
              ...currentState,
              opportunities: opportunitiesData,
              opportunitiesStatus: 'success',
            }));
            return;
          }

          lastError = null;
        } catch (error) {
          if (error.code === 'ERR_CANCELED' || error.name === 'AbortError') {
            return;
          }

          lastError = error;
        }
      }

      if (isMounted) {
        setState((currentState) => ({
          ...currentState,
          opportunities:
            currentState.opportunities?.length > 0 ? currentState.opportunities : fallbackData.opportunities,
          opportunitiesStatus: lastError ? 'error' : 'success',
        }));
      }
    }

    if (includeCore) {
      loadCoreData();
    }

    if (includeOpportunities) {
      loadOpportunityData();
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [includeCore, includeOpportunities]);

  return state;
}
