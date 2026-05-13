import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { getApiErrorMessage } from '../../utils/apiError';
import './styles/DeleteAccountPage.css';

export function DeleteAccountPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteAccount, isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  async function handleDelete() {
    setErrorMessage('');
    setIsDeleting(true);

    try {
      await deleteAccount();
      showToast('회원 탈퇴가 완료되었습니다.');
      navigate('/', { replace: true });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, '회원 탈퇴에 실패했습니다.'));
      setIsDeleting(false);
    }
  }

  return (
    <section className="delete-account-page">
      <p>Account</p>
      <h2>회원 탈퇴</h2>
      <div className="delete-account-page__panel">
        <p>
          <strong>{user.username}</strong> 계정을 삭제하면 현재 로그인 정보가 제거됩니다.
        </p>
        <div className="delete-account-page__actions">
          <button type="button" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? '처리중...' : '회원 탈퇴'}
          </button>
          <Link to="/board">취소</Link>
        </div>
        {errorMessage && <p className="delete-account-page__error">{errorMessage}</p>}
      </div>
    </section>
  );
}
