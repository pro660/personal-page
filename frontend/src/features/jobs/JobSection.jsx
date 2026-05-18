import { Link } from 'react-router-dom';
import './styles/JobSection.css';

function formatDate(value) {
  if (!value) {
    return '';
  }

  const normalizedValue = value.replace(/([+-]\d{2})(\d{2})$/, '$1:$2');
  const parsedDate = new Date(normalizedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
  }).format(parsedDate);
}

export function JobSection({
  emptyDescription = '사람인 API 키가 없거나, 현재 조건에 맞는 채용 공고를 가져오지 못한 상태입니다.',
  emptyTitle = '채용 공고를 가져오지 못했습니다.',
  headerAction = null,
  jobs = [],
  limit,
  showMoreLink = false,
  status = 'success',
  title = '개발 채용 공고',
}) {
  const visibleJobs = Number.isInteger(limit) ? jobs.slice(0, limit) : jobs;
  const isLoading = status === 'loading';

  return (
    <section className="job-section">
      <div className="job-section__header">
        <div>
          <p>Job Radar</p>
          <h2>{title}</h2>
        </div>
        {headerAction ? <div className="job-section__action">{headerAction}</div> : null}
      </div>
      {isLoading ? (
        <div className="job-section__loading" role="status" aria-label="채용 공고를 불러오는 중">
          <div className="job-section__loader" />
        </div>
      ) : visibleJobs.length > 0 ? (
        <div className="job-section__grid">
          {visibleJobs.map((job) => (
            <a
              aria-label={`${job.title} 채용 공고 열기`}
              className="job-section__card"
              href={job.url}
              key={job.id || `${job.company}-${job.title}`}
              rel="noreferrer"
              target="_blank"
            >
              <div className="job-section__meta">
                <span>{job.source || '사람인'}</span>
                {job.jobType ? <span>{job.jobType}</span> : null}
              </div>
              <h3>{job.title}</h3>
              <p>{job.company}</p>
              <dl className="job-section__detail">
                {job.location ? (
                  <>
                    <dt>근무지</dt>
                    <dd>{job.location}</dd>
                  </>
                ) : null}
                {job.experience ? (
                  <>
                    <dt>경력</dt>
                    <dd>{job.experience}</dd>
                  </>
                ) : null}
                {job.salary ? (
                  <>
                    <dt>연봉</dt>
                    <dd>{job.salary}</dd>
                  </>
                ) : null}
                {job.education ? (
                  <>
                    <dt>학력</dt>
                    <dd>{job.education}</dd>
                  </>
                ) : null}
              </dl>
              <div className="job-section__footer">
                {job.deadlineAt ? (
                  <time dateTime={job.deadlineAt}>{formatDate(job.deadlineAt)}까지</time>
                ) : (
                  <span>마감일 확인 필요</span>
                )}
                {job.readCount || job.applyCount ? (
                  <span>
                    조회 {job.readCount || 0} / 지원 {job.applyCount || 0}
                  </span>
                ) : null}
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="job-section__empty">
          <h3>{emptyTitle}</h3>
          <p>{emptyDescription}</p>
        </div>
      )}
      {!isLoading && showMoreLink && jobs.length > visibleJobs.length ? (
        <div className="job-section__more">
          <Link to="/jobs">채용 공고 전체 보기</Link>
        </div>
      ) : null}
    </section>
  );
}
