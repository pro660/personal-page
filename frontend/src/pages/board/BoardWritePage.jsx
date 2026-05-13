import { useNavigate } from 'react-router-dom';
import { createPost } from '../../api/boardApi';
import { useToast } from '../../contexts/ToastContext';
import { BoardPostForm } from '../../features/board/BoardPostForm';
import { getApiErrorMessage } from '../../utils/apiError';
import './styles/BoardWritePage.css';

export function BoardWritePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function handleSubmit(form) {
    try {
      const post = await createPost(form);
      showToast('게시글을 작성했습니다.');
      navigate(`/board/${post.id}`);
    } catch (error) {
      showToast(getApiErrorMessage(error, '게시글 작성에 실패했습니다.'), 'error');
    }
  }

  return (
    <section className="board-write-page">
      <p>Write</p>
      <h2>게시글 작성</h2>
      <BoardPostForm submitLabel="작성하기" onSubmit={handleSubmit} />
    </section>
  );
}
