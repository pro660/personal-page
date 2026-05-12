import './styles/SkillsSection.css';

export function SkillsSection({ skills }) {
  return (
    <div className="skills-section">
      <h2>Skills</h2>
      <div className="skills-section__list">
        {skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>
    </div>
  );
}
