import { useEffect, useState } from 'react';

const STORAGE_KEY = 'portfolio-theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

function getInitialTheme() {
  const savedTheme = window.localStorage.getItem(STORAGE_KEY);

  if (savedTheme === DARK_THEME || savedTheme === LIGHT_THEME) {
    return savedTheme;
  }

  if (!window.matchMedia) {
    return LIGHT_THEME;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? DARK_THEME
    : LIGHT_THEME;
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.body.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) => (
      currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME
    ));
  }

  return {
    isDarkMode: theme === DARK_THEME,
    theme,
    toggleTheme,
  };
}
