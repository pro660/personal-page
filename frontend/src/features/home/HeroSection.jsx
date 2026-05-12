import { TypingHeading } from '../../components/TypingHeading';

export function HeroSection({ hello, profile }) {
  return (
    <section className="hero reveal">
      <div>
        <p className="eyebrow">Portfolio API</p>
        <p className="api-status-text">{hello || 'MySQL connected portfolio API'}</p>
        <TypingHeading />
        <p className="intro">
          {profile?.intro || '백엔드 API를 기다리는 중입니다.'}
        </p>
        <div className="hero-meta">
          <span>{profile?.role || 'Full-stack learner'}</span>
          <span>{profile?.location || 'Seoul, Korea'}</span>
        </div>
      </div>
    </section>
  );
}
