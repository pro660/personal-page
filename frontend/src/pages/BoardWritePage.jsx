import { Navigate, useNavigate } from 'react-router-dom';
import { createPost } from '../api/boardApi';
import { BoardPostForm } from '../features/board/BoardPostForm';
import { useAuth } from '../contexts/AuthContext';
import './styles/BoardWritePage.css';

export function BoardWritePage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  async function handleSubmit(form) {
    const post = await createPost({ ...form, author: user.username });
    navigate(`/board/${post.id}`);
  }

  return (
    <section className="board-write-page">
      <p>Write</p>
      <h1>게시글 작성</h1>
      <BoardPostForm submitLabel="작성하기" onSubmit={handleSubmit} />
    </section>
  );
}
