import { useCallback, useMemo, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { ToastContext } from './useToast';

let toastId = 0;

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const toast = useCallback(
    (message, type = 'info') => {
      const id = ++toastId;
      setToasts((current) => [...current, { id, message, type }]);
      timers.current[id] = setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast, addToast: toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((t) => (
          <div className={`toast toast-${t.type}`} key={t.id} role="status">
            <span className="toast-icon">
              {t.type === 'success' && <CheckCircle2 size={18} color="#16a34a" />}
              {t.type === 'error' && <AlertCircle size={18} color="#ef4444" />}
              {t.type === 'info' && <Info size={18} color="#2563eb" />}
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}