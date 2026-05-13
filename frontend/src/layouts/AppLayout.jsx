import { Outlet } from 'react-router-dom';
import { ActiveUserBadge } from '../components/layout/ActiveUserBadge';
import { Header } from '../components/layout/Header';
import { ScrollProgressBar } from '../components/layout/ScrollProgressBar';
import './styles/AppLayout.css';

export function AppLayout() {
  return (
    <>
      <ScrollProgressBar />
      <div className="app-layout__topbar">
        <Header />
        <ActiveUserBadge />
      </div>
      <main className="app-layout">
        <Outlet />
      </main>
    </>
  );
}
