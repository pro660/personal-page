import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deletePost, getPost } from '../api/boardApi';
import { useAuth } from '../contexts/AuthContext';
import './styles/BoardDetailPage.css';

export function BoardDetailPage() {
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState('loading');
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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

  async function handleDelete() {
    await deletePost(id);
    navigate('/board');
  }

  if (status === 'loading') {
    return <p className="board-detail-page__state">게시글을 불러오는 중입니다.</p>;
  }

  if (status === 'error' || !post) {
    return <p className="board-detail-page__state">게시글을 찾을 수 없습니다.</p>;
  }

  return (
    <article className="board-detail-page">
      <Link className="board-detail-page__back" to="/board">
        목록으로
      </Link>
      <header>
        <p>{post.author}</p>
        <h1>{post.title}</h1>
      </header>
      <div className="board-detail-page__content">
        {post.content}
      </div>
      {isAuthenticated && (
        <div className="board-detail-page__actions">
          <Link to={`/board/${post.id}/edit`}>수정</Link>
          <button type="button" onClick={handleDelete}>삭제</button>
        </div>
      )}
    </article>
  );
}
