import { ApiStatusNotice } from '../../components/common/ApiStatusNotice';
import { OpportunitySection } from '../../features/opportunities/OpportunitySection';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import './styles/ContestListPage.css';

export function ContestListPage() {
  const { opportunities, status } = usePortfolioData();

  return (
    <div className="contest-list-page">
      <section className="contest-list-page__intro">
        </section>
      <ApiStatusNotice status={status} />
      <OpportunitySection
        opportunities={opportunities}
        showChecklist={false}
        title={`진행중인 공모전 ${opportunities.length}개`}
      />
    </div>
  );
}
