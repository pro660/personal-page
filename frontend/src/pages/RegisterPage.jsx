import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
      await register(form);
      navigate('/board');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || '회원가입에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="register-page">
      <p>Register</p>
      <h1>새 계정으로 시작해요.</h1>
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
          {isSubmitting ? 'Creating...' : 'Create Account'}
        </button>
      </form>
      {errorMessage && <p className="register-page__error">{errorMessage}</p>}
      <Link className="register-page__link" to="/login">
        이미 계정이 있다면 로그인
      </Link>
    </section>
  );
}
