import './styles/ApiStatusNotice.css';

export function ApiStatusNotice({ status }) {
  if (status !== 'error') {
    return null;
  }

  return (
    <section className="api-status-notice">
      <h3>API Connection Error</h3>
      <br/>
        <strong>If the problem persists, Please check your network connection or contact support.</strong>
    </section>
  );
}
