import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { ThemeToggle } from '../common/ThemeToggle';
import './styles/ActiveUserBadge.css';

const EXIT_DURATION = 280;

export function ActiveUserBadge() {
  const { isAuthenticated, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isUserMounted, setIsUserMounted] = useState(Boolean(isAuthenticated && user?.username));
  const [isUserVisible, setIsUserVisible] = useState(Boolean(isAuthenticated && user?.username));
  const [displayName, setDisplayName] = useState(user?.username || '');

  useEffect(() => {
    if (isAuthenticated && user?.username) {
      setDisplayName(user.username);
      setIsUserMounted(true);
      window.requestAnimationFrame(() => setIsUserVisible(true));
      return undefined;
    }

    setIsUserVisible(false);
    const timeoutId = window.setTimeout(() => {
      setIsUserMounted(false);
      setDisplayName('');
    }, EXIT_DURATION);

    return () => window.clearTimeout(timeoutId);
  }, [isAuthenticated, user?.username]);

  return (
    <aside className={`active-user-panel ${isAuthenticated ? 'is-authenticated' : 'is-guest'}`}>
      {isUserMounted && (
        <span
          className={`active-user-panel__text ${isUserVisible ? 'is-visible' : 'is-hidden'}`}
          aria-hidden={!isUserVisible}
        >
          {displayName} 활동중..
        </span>
      )}
      <div className="active-user-panel__toggle">
        <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} isCompact={isAuthenticated} />
      </div>
    </aside>
  );
}
