export function SkillsSection({ skills }) {
  return (
    <div className="panel">
      <h2>Skills</h2>
      <div className="skill-list">
        {skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>
    </div>
  );
}
