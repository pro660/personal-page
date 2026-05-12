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
    setSubmitMessage('Sending...');

    try {
      await createContactMessage(form);
      setForm(initialForm);
      setSubmitMessage('Message saved in MySQL.');
    } catch (error) {
      setSubmitMessage('Backend connection failed. Start Spring Boot and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="contact-section">
      <div>
        <h2>Contact</h2>
        <p>POST 요청으로 MySQL의 contact_messages 테이블에 저장됩니다.</p>
      </div>
      <form className="contact-section__form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
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
        <textarea
          name="message"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
        {submitMessage && <p className="contact-section__submit-message">{submitMessage}</p>}
      </form>
    </section>
  );
}
