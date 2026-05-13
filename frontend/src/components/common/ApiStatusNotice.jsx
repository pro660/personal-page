import './styles/ApiStatusNotice.css';

export function ApiStatusNotice({ status }) {
  if (status !== 'error') {
    return null;
  }

  return (
    <section className="api-status-notice">
      Spring Boot 서버 또는 MySQL 연결을 확인해 주세요. 백엔드는
      <code> backend/.gradlew.bat bootRun</code>으로 실행합니다.
    </section>
  );
}
