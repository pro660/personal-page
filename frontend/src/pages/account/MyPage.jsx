import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyProfile } from '../../api/userApi';
import { StatusMessage } from '../../components/common/StatusMessage';
import './styles/MyPage.css';

export function MyPage() {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getMyProfile();
        setProfile(data);
        setStatus('success');
      } catch (error) {
        setStatus('error');
      }
    }

    loadProfile();
  }, []);

  if (status === 'loading') {
    return <StatusMessage>내 정보를 불러오는 중입니다.</StatusMessage>;
  }

  if (status === 'error' || !profile) {
    return <StatusMessage tone="error">마이페이지 정보를 불러오지 못했습니다.</StatusMessage>;
  }

  return (
    <section className="my-page">
      <p>My Page</p>
      <h2>{profile.username}</h2>
      <div className="my-page__summary">
        <div>
          <span>Email</span>
          <strong>{profile.email}</strong>
        </div>
        <div>
          <span>Posts</span>
          <strong>{profile.postCount}</strong>
        </div>
        <div>
          <span>Comments</span>
          <strong>{profile.commentCount}</strong>
        </div>
      </div>
      <div className="my-page__actions">
        <Link to="/account/password">비밀번호 변경</Link>
        <Link to="/account/delete">회원 탈퇴</Link>
      </div>
    </section>
  );
}
