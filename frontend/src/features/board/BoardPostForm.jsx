import { useState } from 'react';
import './styles/BoardPostForm.css';

export function BoardPostForm({ initialValue, onSubmit, submitLabel }) {
  const [form, setForm] = useState({
    title: initialValue?.title || '',
    content: initialValue?.content || '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSave, setDidSave] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');

    if (form.title.trim().length < 2) {
      setErrorMessage('제목은 2자 이상 입력해 주세요.');
      return;
    }

    if (form.content.trim().length < 5) {
      setErrorMessage('내용은 5자 이상 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({ title: form.title.trim(), content: form.content.trim() });
      setDidSave(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={`board-post-form ${didSave ? 'is-saved' : ''}`} onSubmit={handleSubmit}>
      <label>
        <span>Title</span>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="게시글 제목"
          maxLength="120"
          required
        />
      </label>
      <label>
        <span>Content</span>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="내용을 작성해 주세요."
          maxLength="5000"
          required
        />
      </label>
      {errorMessage && <p className="board-post-form__error">{errorMessage}</p>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
