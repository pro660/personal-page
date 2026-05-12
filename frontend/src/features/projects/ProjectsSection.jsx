import './styles/ProjectsSection.css';

export function ProjectsSection({ projects }) {
  return (
    <section className="projects-section">
      <h2>Projects</h2>
      <div className="projects-section__grid">
        {projects.map((project) => (
          <article className="projects-section__card" key={project.id}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="projects-section__links">
              {project.githubUrl && <a href={project.githubUrl}>GitHub</a>}
              {project.demoUrl && <a href={project.demoUrl}>Demo</a>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
