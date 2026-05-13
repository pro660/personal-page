import { TypingHeading } from '../../components/typing/TypingHeading';
import './styles/HeroSection.css';

export function HeroSection({ hello }) {
  return (
    <section className="hero-section">
      <div>
        <p className="hero-section__eyebrow">Portfolio API</p>
        <p className="hero-section__api-status">
          {hello || 'MySQL connected portfolio API'}
        </p>
        <TypingHeading />
      </div>
    </section>
  );
}
