import StatusModal from "@/components/StatusModal";
import React, { createContext, ReactNode, useContext, useState } from "react";

type StatusType = 'loading' | 'success' | 'error' | 'idle';

interface StatusContextType {
    showLoading: (message?: string) => void;
    showSuccess: (message: string, onSuccess?: () => void, buttonText?: string) => void;
    showError: (message: string) => void;
    hideStatus: () => void;
}

const StatusContext = createContext<StatusContextType | null>(null);

export function StatusProvider({ children }: { children: ReactNode }) {
    const [visible, setVisible] = useState(false);
    const [status, setStatus] = useState<StatusType>('idle');
    const [message, setMessage] = useState('');
    const [onSuccessCallback, setOnSuccessCallback] = useState<(() => void) | undefined>(undefined);
    const [successButtonText, setSuccessButtonText] = useState('Done');

    const showLoading = (msg: string = 'Processing...') => {
        setStatus('loading');
        setMessage(msg);
        setVisible(true);
    };

    const showSuccess = (msg: string, onSuccess?: () => void, buttonText: string = 'Done') => {
        setStatus('success');
        setMessage(msg);
        setOnSuccessCallback(() => onSuccess);
        setSuccessButtonText(buttonText);
        setVisible(true);
    };

    const showError = (msg: string) => {
        setStatus('error');
        setMessage(msg);
        setVisible(true);
    };

    const hideStatus = () => {
        setVisible(false);
        // Reset state after animation
        setTimeout(() => {
            setStatus('idle');
            setMessage('');
            setOnSuccessCallback(undefined);
        }, 300);
    };

    const handleSuccessPress = () => {
        if (onSuccessCallback) {
            onSuccessCallback();
        }
        hideStatus();
    };

    return (
        <StatusContext.Provider value={{ showLoading, showSuccess, showError, hideStatus }}>
            {children}
            <StatusModal
                visible={visible}
                status={status}
                message={message}
                onClose={hideStatus}
                onSuccess={handleSuccessPress}
                successButtonText={successButtonText}
            />
        </StatusContext.Provider>
    );
}

export const useStatus = (): StatusContextType => {
    const context = useContext(StatusContext);
    if (!context) {
        throw new Error('useStatus must be used within a StatusProvider');
    }
    return context;
};
