import { useTypingLoop } from '../hooks/useTypingLoop';

const headingPhrases = [
  'console.log("김형석")',
  '웹/앱 개발자 김형석입니다.',
  'React + Spring Boot',
];

export function TypingHeading() {
  const text = useTypingLoop(headingPhrases);

  return (
    <h1 className="typing-heading" aria-label={headingPhrases.join(' / ')}>
      <span aria-hidden="true">{text}</span>
      <span className="typing-cursor" aria-hidden="true" />
    </h1>
  );
}
