import React, { createContext, useRef } from 'react';
import { Toast } from 'primereact/toast';

export const ToastContext = createContext({});

export const ToastProvider = ({ children }) => {
  const toastRef = useRef();

    const showSuccess = (message, sticky = false) => {
        toastRef.current.show({
            severity: 'success',
            summary: 'Notificación',
            detail: <div dangerouslySetInnerHTML={{ __html: `<strong>${message}</strong>` }} />,
            life: 3000,
            sticky: sticky
        });
    }

    const showInfo = (message, sticky = false) => {
        toastRef.current.show({
            severity: 'info',
            summary: 'Notificación',
            detail: <div dangerouslySetInnerHTML={{ __html: `<strong>${message}</strong>` }} />,
            life: 3000,
            sticky: sticky
        });
    }

    const showWarn = (message, sticky = false) => {
        toastRef.current.show({
            severity: 'warn',
            summary: 'Notificación',
            detail: <div dangerouslySetInnerHTML={{ __html: `<strong>${message}</strong>` }} />,
            life: 3000,
            sticky: sticky
        });
    }

    const showError = (message, sticky = false) => {
        toastRef.current.show({
            severity: 'error',
            summary: 'Notificación',
            detail: <div dangerouslySetInnerHTML={{ __html: `<strong>${message}</strong>` }} />,
            life: 3000,
            sticky: sticky
        });
    }

    return (
        <ToastContext.Provider 
            value={{
                showSuccess,
                showInfo,
                showWarn,
                showError,
            }}
        >
            {children}
            <Toast ref={toastRef} position="top-right" />
        </ToastContext.Provider>
    );
};