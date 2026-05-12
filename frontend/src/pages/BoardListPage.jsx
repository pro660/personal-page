import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../api/boardApi';
import { useAuth } from '../contexts/AuthContext';
import './styles/BoardListPage.css';

export function BoardListPage() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState('loading');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getPosts();
        setPosts(data);
        setStatus('success');
      } catch (error) {
        setStatus('error');
      }
    }

    loadPosts();
  }, []);

  return (
    <section className="board-list-page">
      <div className="board-list-page__header">
        <div>
          <p>Board</p>
          <h1>게시판</h1>
        </div>
        <Link className="board-list-page__write" to={isAuthenticated ? '/board/write' : '/login'}>
          글쓰기
        </Link>
      </div>

      {status === 'loading' && <p className="board-list-page__state">게시글을 불러오는 중입니다.</p>}
      {status === 'error' && <p className="board-list-page__state">게시글 API 연결을 확인해 주세요.</p>}

      <div className="board-list-page__posts">
        {posts.map((post) => (
          <Link className="board-list-page__post" to={`/board/${post.id}`} key={post.id}>
            <div>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
            </div>
            <span>{post.author}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
