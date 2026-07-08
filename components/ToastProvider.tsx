'use client';
import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';
type ToastType = 'success' | 'error' | 'info';
interface Toast { id: number; message: string; type: ToastType; }
const ToastCtx = createContext<{ toast: (msg: string, type?: ToastType) => void }>({ toast: () => {} });
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);
  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++counter.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);
  const icons = { success: <CheckCircle size={16}/>, error: <XCircle size={16}/>, info: <Info size={16}/> };
  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => <div key={t.id} className={`toast toast-${t.type}`}>{icons[t.type]}{t.message}</div>)}
      </div>
    </ToastCtx.Provider>
  );
}
export const useToast = () => useContext(ToastCtx);
