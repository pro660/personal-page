import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { AppLayout } from '../layouts/AppLayout';
import { AboutPage } from '../pages/AboutPage';
import { BoardDetailPage } from '../pages/BoardDetailPage';
import { BoardEditPage } from '../pages/BoardEditPage';
import { BoardListPage } from '../pages/BoardListPage';
import { BoardWritePage } from '../pages/BoardWritePage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

export function Router() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <AuthProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/board" element={<BoardListPage />} />
            <Route path="/board/write" element={<BoardWritePage />} />
            <Route path="/board/:id" element={<BoardDetailPage />} />
            <Route path="/board/:id/edit" element={<BoardEditPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
