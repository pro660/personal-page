import { useCallback, useEffect, useState } from 'react';
import { createComment, deleteComment, getComments, updateComment } from '../../api/commentApi';
import { StatusMessage } from '../../components/common/StatusMessage';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { getApiErrorMessage } from '../../utils/apiError';
import './styles/CommentSection.css';

export function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();

  const loadComments = useCallback(async () => {
    try {
      const data = await getComments(postId);
      setComments(data);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  }, [postId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  async function handleCreate(event) {
    event.preventDefault();
    setErrorMessage('');

    if (!content.trim()) {
      setErrorMessage('댓글 내용을 입력해 주세요.');
      return;
    }

    try {
      const comment = await createComment(postId, { content: content.trim() });
      setComments((currentComments) => [...currentComments, comment]);
      setContent('');
      showToast('댓글을 작성했습니다.');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, '댓글 작성에 실패했습니다.'));
    }
  }

  async function handleUpdate(commentId) {
    setErrorMessage('');

    if (!editingContent.trim()) {
      setErrorMessage('댓글 내용을 입력해 주세요.');
      return;
    }

    try {
      const updatedComment = await updateComment(commentId, { content: editingContent.trim() });
      setComments((currentComments) =>
        currentComments.map((comment) => (comment.id === commentId ? updatedComment : comment))
      );
      setEditingId(null);
      setEditingContent('');
      showToast('댓글을 수정했습니다.');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, '댓글 수정에 실패했습니다.'));
    }
  }

  async function handleDelete(commentId) {
    setErrorMessage('');

    try {
      await deleteComment(commentId);
      setComments((currentComments) => currentComments.filter((comment) => comment.id !== commentId));
      showToast('댓글을 삭제했습니다.');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, '댓글 삭제에 실패했습니다.'));
    }
  }

  return (
    <section className="comment-section">
      <div className="comment-section__header">
        <p>Comments</p>
        <h2>댓글</h2>
      </div>

      {isAuthenticated ? (
        <form className="comment-section__form" onSubmit={handleCreate}>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="댓글을 작성해 주세요."
            maxLength="1000"
          />
          <button type="submit">댓글 작성</button>
        </form>
      ) : (
        <StatusMessage>댓글 작성은 로그인 후 가능합니다.</StatusMessage>
      )}

      {errorMessage && <p className="comment-section__error">{errorMessage}</p>}
      {status === 'loading' && <StatusMessage>댓글을 불러오는 중입니다.</StatusMessage>}
      {status === 'error' && <StatusMessage tone="error">댓글 API 연결을 확인해 주세요.</StatusMessage>}

      <div className="comment-section__list">
        {comments.map((comment) => {
          const isAuthor = user?.username === comment.author;
          const isEditing = editingId === comment.id;

          return (
            <article className="comment-section__item" key={comment.id}>
              <div className="comment-section__meta">
                <strong>작성자 : {comment.author}</strong>
              </div>
              {isEditing ? (
                <textarea
                  value={editingContent}
                  onChange={(event) => setEditingContent(event.target.value)}
                  maxLength="1000"
                />
              ) : (
                <p>{comment.content}</p>
              )}
              {isAuthor && (
                <div className="comment-section__actions">
                  {isEditing ? (
                    <>
                      <button type="button" onClick={() => handleUpdate(comment.id)}>저장</button>
                      <button type="button" onClick={() => setEditingId(null)}>취소</button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditingContent(comment.content);
                        }}
                      >
                        수정
                      </button>
                      <button type="button" onClick={() => handleDelete(comment.id)}>삭제</button>
                    </>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
