import { useMemo, useState } from 'react';
import { ApiStatusNotice } from '../../components/common/ApiStatusNotice';
import { OpportunitySection } from '../../features/opportunities/OpportunitySection';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import './styles/ContestListPage.css';

export function ContestListPage() {
  const { opportunities, opportunitiesStatus, status } = usePortfolioData({ includeCore: false });
  const [searchKeyword, setSearchKeyword] = useState('');
  const normalizedKeyword = searchKeyword.trim().toLowerCase();
  const uniqueOpportunities = useMemo(() => {
    const seenOpportunityKeys = new Set();

    return opportunities.filter((opportunity) => {
      const opportunityKey = [
        opportunity.title,
        opportunity.source,
        opportunity.publishedAt,
      ]
        .filter(Boolean)
        .join('|')
        .toLowerCase();

      if (!opportunityKey || seenOpportunityKeys.has(opportunityKey)) {
        return false;
      }

      seenOpportunityKeys.add(opportunityKey);
      return true;
    });
  }, [opportunities]);
  const filteredOpportunities = useMemo(() => {
    if (!normalizedKeyword) {
      return uniqueOpportunities;
    }

    return uniqueOpportunities.filter((opportunity) => {
      const searchableText = [
        opportunity.title,
        opportunity.source,
        opportunity.description,
        opportunity.publishedAt,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedKeyword);
    });
  }, [normalizedKeyword, uniqueOpportunities]);

  const listTitle =
    opportunitiesStatus === 'success'
      ? `${normalizedKeyword ? '검색 결과' : '진행중인 공모전'} ${filteredOpportunities.length}개`
      : '진행중인 공모전';
  const emptyTitle = normalizedKeyword ? '검색 결과가 없습니다.' : undefined;
  const emptyDescription = normalizedKeyword
    ? '다른 키워드로 공모전명이나 주최 기관을 검색해보세요.'
    : undefined;

  return (
    <div className="contest-list-page">
      <ApiStatusNotice status={status} />
      <OpportunitySection
        emptyDescription={emptyDescription}
        emptyTitle={emptyTitle}
        headerAction={
          <form className="contest-list-page__search" onSubmit={(event) => event.preventDefault()} role="search">
            <label htmlFor="contest-search">공모전 검색</label>
            <input
              aria-label="공모전 검색"
              disabled={opportunitiesStatus === 'loading'}
              id="contest-search"
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder="검색어 입력"
              type="search"
              value={searchKeyword}
            />
          </form>
        }
        opportunities={filteredOpportunities}
        status={opportunitiesStatus}
        showChecklist={false}
        title={listTitle}
      />
    </div>
  );
}
