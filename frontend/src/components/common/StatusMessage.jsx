import './styles/StatusMessage.css';

export function StatusMessage({ title, tone = 'default', children }) {
  return (
    <div className={`status-message status-message--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      {title && <strong>{title}</strong>}
      {children && <p>{children}</p>}
    </div>
  );
}
