import { useMemo, useState } from 'react';
import { SearchField } from '../../components/common/SearchField';
import { JobSection } from '../../features/jobs/JobSection';
import { useJobListings } from '../../hooks/useJobListings';
import './styles/JobsPage.css';

export function JobsPage() {
  const { jobs, status } = useJobListings();
  const [searchKeyword, setSearchKeyword] = useState('');
  const normalizedKeyword = searchKeyword.trim().toLowerCase();
  const filteredJobs = useMemo(() => {
    if (!normalizedKeyword) {
      return jobs;
    }

    return jobs.filter((job) => {
      const searchableText = [
        job.title,
        job.company,
        job.location,
        job.jobType,
        job.experience,
        job.salary,
        job.source,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedKeyword);
    });
  }, [jobs, normalizedKeyword]);

  const title =
    status === 'success'
      ? `${normalizedKeyword ? '검색 결과' : '개발 채용 공고'} ${filteredJobs.length}개`
      : '개발 채용 공고';
  const emptyTitle = normalizedKeyword ? '검색 결과가 없습니다.' : undefined;
  const emptyDescription = normalizedKeyword
    ? '회사명, 기술, 지역, 고용형태를 다른 키워드로 검색해보세요.'
    : undefined;

  return (
    <div className="jobs-page">
      <JobSection
        emptyDescription={emptyDescription}
        emptyTitle={emptyTitle}
        headerAction={
          <SearchField
            disabled={status === 'loading'}
            id="job-search"
            label="채용 공고 검색"
            onChange={setSearchKeyword}
            onClear={() => setSearchKeyword('')}
            placeholder="회사, 기술, 지역"
            value={searchKeyword}
          />
        }
        jobs={filteredJobs}
        status={status}
        title={title}
      />
    </div>
  );
}
