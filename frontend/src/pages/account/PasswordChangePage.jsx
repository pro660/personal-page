import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../../api/userApi';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { getApiErrorMessage } from '../../utils/apiError';
import './styles/PasswordChangePage.css';

const initialForm = {
  currentPassword: '',
  newPassword: '',
};

export function PasswordChangePage() {
  const [form, setForm] = useState(initialForm);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');

    if (form.newPassword.length < 6) {
      setErrorMessage('새 비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      await changePassword(form);
      showToast('비밀번호를 변경했습니다. 다시 로그인해 주세요.');
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, '비밀번호 변경에 실패했습니다.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="password-change-page">
      <p>Account</p>
      <h2>비밀번호 변경</h2>
      <form className="password-change-page__form" onSubmit={handleSubmit}>
        <input
          name="currentPassword"
          type="password"
          placeholder="현재 비밀번호"
          value={form.currentPassword}
          onChange={handleChange}
          required
        />
        <input
          name="newPassword"
          type="password"
          placeholder="새 비밀번호"
          value={form.newPassword}
          onChange={handleChange}
          minLength="6"
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '변경중...' : '비밀번호 변경'}
        </button>
      </form>
      {errorMessage && <p className="password-change-page__error">{errorMessage}</p>}
    </section>
  );
}
