import { useState } from 'react';
import { createContactMessage } from '../../api/portfolioApi';
import './styles/ContactSection.css';

const initialForm = {
  name: '',
  email: '',
  message: '',
};

export function ContactSection() {
  const [form, setForm] = useState(initialForm);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('피드백을 전송하는 중입니다...');

    try {
      await createContactMessage({
        ...form,
        message: `[오류/개선 피드백]\n${form.message}`,
      });
      setForm(initialForm);
      setSubmitMessage('피드백이 저장되었습니다. 확인 후 개선에 반영하겠습니다.');
    } catch (error) {
      setSubmitMessage('피드백 전송에 실패했습니다. 백엔드 서버 상태를 확인해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="contact-section">
      <div>
        <p className="contact-section__eyebrow">Feedback</p>
        <h2>오류 제보와 개선 피드백</h2>
        <p>
          이 웹을 사용하다가 오류, 깨진 화면, 이상한 동작, 개선하면 좋을 부분을 발견했다면 이곳으로 알려주세요.
        </p>
      </div>
      <form className="contact-section__form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="이름 또는 닉네임"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="답변 받을 이메일"
          value={form.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="발견한 오류, 발생한 페이지, 재현 방법을 적어주세요."
          value={form.message}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '전송중...' : '피드백 보내기'}
        </button>
        {submitMessage && <p className="contact-section__submit-message">{submitMessage}</p>}
      </form>
    </section>
  );
}
