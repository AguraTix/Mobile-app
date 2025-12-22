import React, { createContext, ReactNode, useCallback, useContext, useState } from "react";

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastNotification {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    toasts: ToastNotification[];
    addToast: (message: string, type?: ToastType, duration?: number) => string;
    removeToast: (id: string) => void;
    clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastNotification[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const addToast = useCallback(
        (message: string, type: ToastType = 'info', duration = 3000): string => {
            const id = `${Date.now()}-${Math.random()}`;
            const toastNotification: ToastNotification = { id, type, message, duration };

            setToasts((prev) => [...prev, toastNotification]);

            if (duration > 0) {
                setTimeout(() => {
                    removeToast(id);
                }, duration);
            }

            return id;
        },
        [removeToast]
    );

    const clearToasts = useCallback(() => {
        setToasts([]);
    }, []);

    const value: ToastContextType = {
        toasts,
        addToast,
        removeToast,
        clearToasts,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
