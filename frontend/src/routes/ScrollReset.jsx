import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollReset() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }, [pathname]);

  return null;
}
