import { useState } from 'react';
import './styles/BoardPostForm.css';

export function BoardPostForm({ initialValue, onSubmit, submitLabel }) {
  const [form, setForm] = useState({
    title: initialValue?.title || '',
    content: initialValue?.content || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(form);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="board-post-form" onSubmit={handleSubmit}>
      <label>
        <span>Title</span>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="게시글 제목"
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
          required
        />
      </label>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
