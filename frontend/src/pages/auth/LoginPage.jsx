import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { getApiErrorMessage } from '../../utils/apiError';
import './styles/LoginPage.css';

const initialForm = {
  username: '',
  password: '',
};

export function LoginPage() {
  const [form, setForm] = useState(initialForm);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login(form);
      showToast('로그인했습니다.');
      navigate('/', { replace: true });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, '로그인에 실패했습니다.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="login-page">
      <p>Login</p>
      <form className="login-page__form" onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {errorMessage && <p className="login-page__error">{errorMessage}</p>}
      <Link className="login-page__link" to="/register">
        회원가입
      </Link>
    </section>
  );
}
