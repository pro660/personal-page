import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getPosts } from '../../api/boardApi';
import { StatusMessage } from '../../components/common/StatusMessage';
import { useAuth } from '../../contexts/AuthContext';
import './styles/BoardListPage.css';

const PAGE_SIZE = 6;

export function BoardListPage() {
  const [posts, setPosts] = useState([]);
  const [pageInfo, setPageInfo] = useState({ number: 0, totalPages: 0, totalElements: 0 });
  const [keywordInput, setKeywordInput] = useState('');
  const [status, setStatus] = useState('loading');
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const page = Number(searchParams.get('page') || 0);
  const keyword = searchParams.get('keyword') || '';

  useEffect(() => {
    setKeywordInput(keyword);
  }, [keyword]);

  useEffect(() => {
    async function loadPosts() {
      setStatus('loading');

      try {
        const data = await getPosts({ page, size: PAGE_SIZE, keyword });
        setPosts(data.content || []);
        setPageInfo({
          number: data.number || 0,
          totalPages: data.totalPages || 0,
          totalElements: data.totalElements || 0,
        });
        setStatus('success');
      } catch (error) {
        setStatus('error');
      }
    }

    loadPosts();
  }, [page, keyword]);

  function handleSearch(event) {
    event.preventDefault();
    const nextParams = {};

    if (keywordInput.trim()) {
      nextParams.keyword = keywordInput.trim();
    }

    setSearchParams(nextParams);
  }

  function movePage(nextPage) {
    const nextParams = {};

    if (keyword) {
      nextParams.keyword = keyword;
    }

    if (nextPage > 0) {
      nextParams.page = String(nextPage);
    }

    setSearchParams(nextParams);
  }

  return (
    <section className="board-list-page">
      <div className="board-list-page__header">
        <div>
          <p>Board</p>
          <h2>게시판</h2>
        </div>
        <Link className="board-list-page__write" to={isAuthenticated ? '/board/write' : '/login'}>
          글쓰기
        </Link>
      </div>

      <form className="board-list-page__search" onSubmit={handleSearch}>
        <input
          value={keywordInput}
          onChange={(event) => setKeywordInput(event.target.value)}
          placeholder="제목 또는 내용 검색"
        />
        <button type="submit">검색</button>
      </form>

      {status === 'loading' && <StatusMessage>게시글을 불러오는 중입니다.</StatusMessage>}
      {status === 'error' && (
        <StatusMessage title="게시글 API 연결 실패" tone="error">
          백엔드 서버와 데이터베이스 상태를 확인해 주세요.
        </StatusMessage>
      )}

      {status === 'success' && posts.length === 0 && (
        <StatusMessage title="게시글이 없습니다.">
          첫 게시글을 작성해서 게시판 흐름을 확인해 보세요.
        </StatusMessage>
      )}

      <div className="board-list-page__posts">
        {posts.map((post) => (
          <Link className="board-list-page__post" to={`/board/${post.id}`} key={post.id}>
            <div>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
            </div>
            <span>작성자 : {post.author}</span>
          </Link>
        ))}
      </div>

      {status === 'success' && pageInfo.totalElements > 0 && (
        <div className="board-list-page__pagination">
          <button type="button" onClick={() => movePage(pageInfo.number - 1)} disabled={pageInfo.number === 0}>
            이전
          </button>
          <span>
            {pageInfo.number + 1} / {Math.max(pageInfo.totalPages, 1)}
          </span>
          <button
            type="button"
            onClick={() => movePage(pageInfo.number + 1)}
            disabled={pageInfo.number + 1 >= pageInfo.totalPages}
          >
            다음
          </button>
        </div>
      )}
    </section>
  );
}
