import './styles/AboutPage.css';

const strengths = [
  'React 화면 구성과 상태 흐름을 명확하게 나누는 연습',
  'Spring Boot REST API와 MySQL 데이터 연결 경험',
  '작게 만들고 검증하며 확장하는 풀스택 개발 루틴',
];

export function AboutPage() {
  return (
    <section className="about-page">
      <p className="about-page__eyebrow">About</p>
      <h2>화면과 데이터의 흐름을 연결하는 개발자 김형석입니다.</h2>
      <p className="about-page__intro">
        사용자 화면에서 출발해 API, 데이터베이스, 배포까지 이어지는 전체 흐름을 만들며 성장하고 있습니다.<br />
        이 페이지는 React와 Spring Boot를 오가며 구조를 다듬는 개인 풀스택 프로젝트입니다.
      </p>
      <div className="about-page__grid">
        {strengths.map((strength, index) => (
          <article className="about-page__card" key={strength}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <p>{strength}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
