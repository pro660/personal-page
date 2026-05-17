import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import './styles/Header.css';

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();

  async function handleLogout() {
    await logout();
    showToast('로그아웃되었습니다.');
  }

  return (
    <header className="site-header">
      <Link className="site-header__brand" to="/">
        log.Kim
      </Link>
      <nav className="site-header__nav" aria-label="주요 메뉴">
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contests">Contests</NavLink>
        <NavLink to="/jobs">Jobs</NavLink>
        <NavLink to="/board">Board</NavLink>
      </nav>
      <div className="site-header__actions">
        {isAuthenticated ? (
          <>
            <Link className="site-header__button" to="/mypage">
              My
            </Link>
            <button className="site-header__button" type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link className="site-header__button" to="/login">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
