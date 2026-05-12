export function ProjectsSection({ projects }) {
  return (
    <section className="projects reveal reveal-delay-2">
      <h2>Projects</h2>
      <div className="project-grid">
        {projects.map((project) => (
          <article className="project-card" key={project.id}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="project-links">
              {project.githubUrl && <a href={project.githubUrl}>GitHub</a>}
              {project.demoUrl && <a href={project.demoUrl}>Demo</a>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
