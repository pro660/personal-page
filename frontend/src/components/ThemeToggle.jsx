export function ThemeToggle({ isDarkMode, onToggle }) {
  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={isDarkMode ? '라이트 모드로 변경' : '다크 모드로 변경'}
      aria-pressed={isDarkMode}
      onClick={onToggle}
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-thumb" />
      </span>
      <span className="theme-toggle-text">{isDarkMode ? 'Dark' : 'Light'}</span>
    </button>
  );
}
