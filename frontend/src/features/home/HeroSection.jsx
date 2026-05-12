import { TypingHeading } from '../../components/TypingHeading';
import './styles/HeroSection.css';

export function HeroSection({ hello, profile }) {
  return (
    <section className="hero-section">
      <div>
        <p className="hero-section__eyebrow">Portfolio API</p>
        <p className="hero-section__api-status">
          {hello || 'MySQL connected portfolio API'}
        </p>
        <TypingHeading />
        <p className="hero-section__intro">
          {profile?.intro || '백엔드 API를 기다리는 중입니다.'}
        </p>
        <div className="hero-section__meta">
          <span>{profile?.role || 'Full-stack learner'}</span>
          <span>{profile?.location || 'Seoul, Korea'}</span>
        </div>
      </div>
    </section>
  );
}
