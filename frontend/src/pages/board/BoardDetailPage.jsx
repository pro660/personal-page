import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deletePost, getPost } from '../../api/boardApi';
import { StatusMessage } from '../../components/common/StatusMessage';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { CommentSection } from '../../features/comments/CommentSection';
import { getApiErrorMessage } from '../../utils/apiError';
import './styles/BoardDetailPage.css';

export function BoardDetailPage() {
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState('loading');
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();

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
    try {
      await deletePost(id);
      showToast('게시글을 삭제했습니다.');
      navigate('/board');
    } catch (error) {
      showToast(getApiErrorMessage(error, '게시글 삭제에 실패했습니다.'), 'error');
    }
  }

  if (status === 'loading') {
    return <StatusMessage>게시글을 불러오는 중입니다.</StatusMessage>;
  }

  if (status === 'error' || !post) {
    return <StatusMessage tone="error">게시글을 찾을 수 없습니다.</StatusMessage>;
  }

  return (
    <>
      <article className="board-detail-page">
        <Link className="board-detail-page__back" to="/board">
          목록으로
        </Link>
        <header>
          <p>작성자 : {post.author}</p>
          <h2>{post.title}</h2>
        </header>
        <div className="board-detail-page__content">
          {post.content}
        </div>
        {isAuthenticated && user?.username === post.author && (
          <div className="board-detail-page__actions">
            <Link to={`/board/${post.id}/edit`}>수정</Link>
            <button type="button" onClick={handleDelete}>삭제</button>
          </div>
        )}
      </article>
      <CommentSection postId={post.id} />
    </>
  );
}
