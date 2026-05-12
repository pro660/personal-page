import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import './styles/AppLayout.css';

export function AppLayout() {
  return (
    <>
      <Header />
      <main className="app-layout">
        <Outlet />
      </main>
    </>
  );
}
