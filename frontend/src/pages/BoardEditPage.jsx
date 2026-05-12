import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { getPost, updatePost } from '../api/boardApi';
import { BoardPostForm } from '../features/board/BoardPostForm';
import { useAuth } from '../contexts/AuthContext';
import './styles/BoardEditPage.css';

export function BoardEditPage() {
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState('loading');
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    async function loadPost() {
      try {
        const data = await getPost(id);
        setPost(data);
        setStatus('success');
      } catch (error) {
        setStatus('error');
      }
    }

    loadPost();
  }, [id]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  async function handleSubmit(form) {
    await updatePost(id, { ...form, author: user.username });
    navigate(`/board/${id}`);
  }

  if (status === 'loading') {
    return <p className="board-edit-page__state">게시글을 불러오는 중입니다.</p>;
  }

  if (status === 'error' || !post) {
    return <p className="board-edit-page__state">게시글을 찾을 수 없습니다.</p>;
  }

  return (
    <section className="board-edit-page">
      <p>Edit</p>
      <h1>게시글 수정</h1>
      <BoardPostForm initialValue={post} submitLabel="수정하기" onSubmit={handleSubmit} />
    </section>
  );
}
