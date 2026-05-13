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
        const [helloData, skillsData, projectsData, opportunitiesData] = await Promise.all([
          getHello(requestConfig),
          getSkills(requestConfig),
          getProjects(requestConfig),
          getOpportunities(requestConfig),
        ]);

        if (!isMounted) {
          return;
        }

        setState({
          hello: helloData.message || fallbackData.hello,
          skills: skillsData?.length > 0 ? skillsData : fallbackData.skills,
          projects: projectsData?.length > 0 ? projectsData : fallbackData.projects,
          opportunities: opportunitiesData?.length > 0 ? opportunitiesData : fallbackData.opportunities,
          status: 'success',
        });
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
            opportunities:
              currentState.opportunities.length > 0 ? currentState.opportunities : fallbackData.opportunities,
            status: 'error',
          }));
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
