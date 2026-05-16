import { ApiStatusNotice } from '../../components/common/ApiStatusNotice';
import { ContactSection } from '../../features/contact/ContactSection';
import { HeroSection } from '../../features/home/HeroSection';
import { OpportunitySection } from '../../features/opportunities/OpportunitySection';
import { ProjectsSection } from '../../features/projects/ProjectsSection';
import { SkillsSection } from '../../features/skills/SkillsSection';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import './styles/HomePage.css';

export function HomePage() {
  const { hello, skills, projects, opportunities, opportunitiesStatus, status } = usePortfolioData();

  return (
    <div className="home-page">
      <HeroSection hello={hello} />
      <ApiStatusNotice status={status} />
      <OpportunitySection opportunities={opportunities} limit={4} status={opportunitiesStatus} showMoreLink />
      <section className="home-page__section-grid">
        <SkillsSection skills={skills} />
        <div className="home-page__api-flow">
          <h2>API Flow</h2>
          <ol className="home-page__flow-list">
            <li>React renders this page on localhost:3000.</li>
            <li>Axios calls Spring Boot APIs on localhost:8080.</li>
            <li>Spring Data JPA reads and writes MySQL data.</li>
          </ol>
        </div>
      </section>
      <ProjectsSection projects={projects} />
      <ContactSection />
    </div>
  );
}
