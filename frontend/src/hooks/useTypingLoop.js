import { useEffect, useMemo, useState } from 'react';

const TYPE_SPEED = 92;
const DELETE_SPEED = 46;
const HOLD_DELAY = 1300;

export function useTypingLoop(phrases) {
  const safePhrases = useMemo(
    () => phrases.filter((phrase) => phrase.length > 0),
    [phrases]
  );
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (safePhrases.length === 0) {
      return undefined;
    }

    const currentPhrase = safePhrases[phraseIndex];
    const isComplete = letterIndex === currentPhrase.length;
    const isEmpty = letterIndex === 0;

    const delay = isComplete && !isDeleting
      ? HOLD_DELAY
      : isDeleting
        ? DELETE_SPEED
        : TYPE_SPEED;

    const timeoutId = window.setTimeout(() => {
      if (!isDeleting && isComplete) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && isEmpty) {
        setIsDeleting(false);
        setPhraseIndex((currentIndex) => (currentIndex + 1) % safePhrases.length);
        return;
      }

      setLetterIndex((currentIndex) => currentIndex + (isDeleting ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [isDeleting, letterIndex, phraseIndex, safePhrases]);

  if (safePhrases.length === 0) {
    return '';
  }

  return safePhrases[phraseIndex].slice(0, letterIndex);
}
