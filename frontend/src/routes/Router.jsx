import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastContext';
import { AppLayout } from '../layouts/AppLayout';
import { AboutPage } from '../pages/about/AboutPage';
import { DeleteAccountPage } from '../pages/account/DeleteAccountPage';
import { MyPage } from '../pages/account/MyPage';
import { PasswordChangePage } from '../pages/account/PasswordChangePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { BoardDetailPage } from '../pages/board/BoardDetailPage';
import { BoardEditPage } from '../pages/board/BoardEditPage';
import { BoardListPage } from '../pages/board/BoardListPage';
import { BoardWritePage } from '../pages/board/BoardWritePage';
import { HomePage } from '../pages/home/HomePage';
import { ProtectedRoute } from './ProtectedRoute';

export function Router() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/board" element={<BoardListPage />} />
              <Route path="/board/:id" element={<BoardDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/board/write" element={<BoardWritePage />} />
                <Route path="/board/:id/edit" element={<BoardEditPage />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/account/password" element={<PasswordChangePage />} />
                <Route path="/account/delete" element={<DeleteAccountPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
