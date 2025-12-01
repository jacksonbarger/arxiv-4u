'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type'], duration?: number) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast['type'] = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, duration);
    }
  };

  const hideToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={hideToast} />
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

function ToastContainer({ toasts, onClose }: { toasts: Toast[]; onClose: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => onClose(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger exit animation before removal
    if (toast.duration && toast.duration > 0) {
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
      }, toast.duration - 300);
      return () => clearTimeout(exitTimer);
    }
  }, [toast.duration]);

  const colors = {
    success: {
      bg: '#DAF4EF',
      border: '#10B981',
      icon: '✓',
      iconBg: '#10B981',
    },
    error: {
      bg: '#FEE2E2',
      border: '#EF4444',
      icon: '✕',
      iconBg: '#EF4444',
    },
    warning: {
      bg: '#FEF3C7',
      border: '#F59E0B',
      icon: '⚠',
      iconBg: '#F59E0B',
    },
    info: {
      bg: '#DBEAFE',
      border: '#3B82F6',
      icon: 'ℹ',
      iconBg: '#3B82F6',
    },
  };

  const style = colors[toast.type];

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl shadow-2xl border-2 backdrop-blur-sm transition-all duration-300 ${
        isExiting ? 'animate-slideOutRight opacity-0' : 'animate-slideInRight'
      }`}
      style={{
        backgroundColor: style.bg,
        borderColor: style.border,
      }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold"
        style={{ backgroundColor: style.iconBg }}
      >
        {style.icon}
      </div>
      <p className="flex-1 text-sm font-medium" style={{ color: '#4A5568' }}>
        {toast.message}
      </p>
      <button
        onClick={onClose}
        className="p-1 rounded-full hover:bg-black/10 transition-colors"
        aria-label="Close"
      >
        <svg className="w-4 h-4" style={{ color: '#718096' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// Convenience hooks for common toast types
export function useSuccessToast() {
  const { showToast } = useToast();
  return (message: string) => showToast(message, 'success');
}

export function useErrorToast() {
  const { showToast } = useToast();
  return (message: string) => showToast(message, 'error');
}
