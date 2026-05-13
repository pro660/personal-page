import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { getApiErrorMessage } from '../../utils/apiError';
import './styles/RegisterPage.css';

const initialForm = {
  username: '',
  email: '',
  password: '',
};

export function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');

    if (form.password.length < 6) {
      setErrorMessage('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register(form);
      showToast('회원가입이 완료되었습니다.');
      navigate('/board');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, '회원가입에 실패했습니다.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="register-page">
      <p>회원가입</p>
      <h2>내 계정으로 시작해요.</h2>
      <form className="register-page__form" onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          minLength="6"
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '계정 생성중...' : '계정 생성'}
        </button>
      </form>
      {errorMessage && <p className="register-page__error">{errorMessage}</p>}
      <Link className="register-page__link" to="/login">
        이미 계정이 있다면 로그인
      </Link>
    </section>
  );
}
