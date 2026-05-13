import { Link } from 'react-router-dom';
import './styles/OpportunitySection.css';

const portfolioChecklist = [
  '관심 있는 공모전은 주최 기관, 접수 기간, 활용 API를 함께 기록하기',
  '참여하지 못한 공모전도 아이디어를 개인 프로젝트 주제로 재구성하기',
  '결과물은 문제 정의, 핵심 기능, API 흐름, 트러블슈팅까지 문서화하기',
  '정부/기업 공모전 요구사항을 비교하며 포트폴리오 기능 우선순위 정하기',
];

function formatOpportunityDate(value) {
  if (!value) {
    return '';
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
  }).format(parsedDate);
}

export function OpportunitySection({
  opportunities = [],
  limit,
  showChecklist = true,
  showMoreLink = false,
  title = '과학/공학 공모전과 대회 정보',
}) {
  const visibleOpportunities = Number.isInteger(limit) ? opportunities.slice(0, limit) : opportunities;

  return (
    <section className="opportunity-section">
      <div className="opportunity-section__header">
        <p>Contest Radar</p>
        <h2>{title}</h2>
      </div>
      {visibleOpportunities.length > 0 ? (
        <div className="opportunity-section__grid">
          {visibleOpportunities.map((item) => (
            <a
              aria-label={`${item.title} 상세 내용 열기`}
              className="opportunity-section__card"
              href={item.url}
              key={`${item.source}-${item.title}`}
              rel="noreferrer"
              target="_blank"
            >
              <div className="opportunity-section__meta">
                <span>{item.source}</span>
              </div>
              <h3>{item.title}</h3>
              <div className="opportunity-section__footer">
                {item.publishedAt ? (
                  <time dateTime={item.publishedAt}>{formatOpportunityDate(item.publishedAt)}까지</time>
                ) : (
                  <span aria-hidden="true" />
                )}
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="opportunity-section__empty">
          <h3>상세 링크를 가져오지 못했습니다.</h3>
          <p>외부 공모전 목록에 접근할 수 없거나, 현재 진행중인 과학/공학 공모전을 찾지 못한 상태입니다.</p>
        </div>
      )}
      {showMoreLink && opportunities.length > visibleOpportunities.length ? (
        <div className="opportunity-section__more">
          <Link to="/contests">공모전 목록 전체 보기</Link>
        </div>
      ) : null}
      {showChecklist ? (
        <div className="opportunity-section__checklist">
          <h3>포트폴리오로 남길 때 체크할 것</h3>
          <ul>
            {portfolioChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
