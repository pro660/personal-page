import { ApiStatusNotice } from '../components/ApiStatusNotice';
import { ThemeToggle } from '../components/ThemeToggle';
import { ContactSection } from '../features/contact/ContactSection';
import { HeroSection } from '../features/home/HeroSection';
import { ProjectsSection } from '../features/projects/ProjectsSection';
import { SkillsSection } from '../features/skills/SkillsSection';
import { useTheme } from '../hooks/useTheme';
import { usePortfolioData } from '../hooks/usePortfolioData';
import '../styles/App.css';

export function Router() {
  const { hello, profile, skills, projects, status } = usePortfolioData();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <main className="page-shell">
      <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
      <HeroSection hello={hello} profile={profile} />
      <ApiStatusNotice status={status} />
      <section className="section-grid reveal reveal-delay-1">
        <SkillsSection skills={skills} />
        <div className="panel">
          <h2>API Flow</h2>
          <ol className="flow-list">
            <li>React renders this page on localhost:3000.</li>
            <li>Axios calls Spring Boot APIs on localhost:8080.</li>
            <li>Spring Data JPA reads and writes MySQL data.</li>
          </ol>
        </div>
      </section>
      <ProjectsSection projects={projects} />
      <ContactSection />
    </main>
  );
}
