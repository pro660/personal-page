import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPost, updatePost } from '../../api/boardApi';
import { StatusMessage } from '../../components/common/StatusMessage';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { BoardPostForm } from '../../features/board/BoardPostForm';
import { getApiErrorMessage } from '../../utils/apiError';
import './styles/BoardEditPage.css';

export function BoardEditPage() {
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState('loading');
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
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

  async function handleSubmit(form) {
    try {
      await updatePost(id, form);
      showToast('게시글을 수정했습니다.');
      navigate(`/board/${id}`);
    } catch (error) {
      showToast(getApiErrorMessage(error, '게시글 수정에 실패했습니다.'), 'error');
    }
  }

  if (status === 'loading') {
    return <StatusMessage>게시글을 불러오는 중입니다.</StatusMessage>;
  }

  if (status === 'error' || !post) {
    return <StatusMessage tone="error">게시글을 찾을 수 없습니다.</StatusMessage>;
  }

  if (user?.username !== post.author) {
    return <StatusMessage tone="error">작성자만 게시글을 수정할 수 있습니다.</StatusMessage>;
  }

  return (
    <section className="board-edit-page">
      <p>Edit</p>
      <h2>게시글 수정</h2>
      <BoardPostForm initialValue={post} submitLabel="수정하기" onSubmit={handleSubmit} />
    </section>
  );
}
