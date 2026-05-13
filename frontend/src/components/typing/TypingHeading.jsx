import { useTypingLoop } from '../../hooks/useTypingLoop';
import './styles/TypingHeading.css';

const headingPhrases = [
  'console.log("김형석")',
  '프론트엔드 개발자 김형석입니다.',
  'React + Spring Boot',
];

export function TypingHeading() {
  const text = useTypingLoop(headingPhrases);

  return (
    <h2 className="typing-heading" aria-label={headingPhrases.join(' / ')}>
      <span aria-hidden="true">{text}</span>
      <span className="typing-cursor" aria-hidden="true" />
    </h2>
  );
}
