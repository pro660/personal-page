import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import './styles/ToastContext.css';

const ToastContext = createContext(null);
const TOAST_DURATION = 3800;
const TOAST_EXIT_DURATION = 260;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const startDismissToast = useCallback((id) => {
    setToasts((currentToasts) =>
      currentToasts.map((toast) => (toast.id === id ? { ...toast, isLeaving: true } : toast))
    );

    window.setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
    }, TOAST_EXIT_DURATION);
  }, []);

  const showToast = useCallback((message, tone = 'success') => {
    const id = crypto.randomUUID();
    setToasts((currentToasts) => [...currentToasts, { id, message, tone, isLeaving: false }]);
    window.setTimeout(() => startDismissToast(id), TOAST_DURATION);
  }, [startDismissToast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" aria-live="polite">
        {toasts.map((toast) => (
          <div className={`toast toast--${toast.tone} ${toast.isLeaving ? 'is-leaving' : ''}`} key={toast.id}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
}
