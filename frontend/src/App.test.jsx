import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./hooks/usePortfolioData', () => ({
  usePortfolioData: () => ({
    hello: 'Spring Boot backend is running',
    profile: {
      name: 'console.log("김형석")',
      intro: 'Test intro',
      role: 'Full-stack learner',
      location: 'Seoul, Korea',
    },
    skills: ['React', 'Spring Boot'],
    projects: [],
    status: 'success',
  }),
}));

test('renders personal page heading', () => {
  render(<App />);
  const headingElement = screen.getByRole('heading', {
    name: 'console.log("김형석") / 프론트엔드 개발자 김형석입니다. / React + Spring Boot',
  });
  expect(headingElement).toBeInTheDocument();
});
