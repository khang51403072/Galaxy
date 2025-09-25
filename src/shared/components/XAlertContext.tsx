import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import XAlert from './XAlert';
import XConfirmDialog from './XConfirmDialog';

export type XAlertOptions = {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
};

// Type mới cho Confirm Dialog
export type XConfirmOptions = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  childrenBottom?: React.ReactNode;
  childrenTop?: React.ReactNode;
};


export type XAlertContextType = {
  showAlert: (options: XAlertOptions) => void;
  showConfirm: (options: XConfirmOptions) => void;
};

const XDialogContext = createContext<XAlertContextType | undefined>(undefined);

export function useXAlert() {
  const ctx = useContext(XDialogContext);
  if (!ctx) throw new Error('useXAlert must be used within XAlertProvider');
  return ctx;
}

export function XDialogProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<XAlertOptions | null>(null);
  const [confirm, setConfirm] = useState<XConfirmOptions | null>(null);
  const showAlert = useCallback((options: XAlertOptions) => setAlert(options), [alert]);
  
  const showConfirm = useCallback((options: XConfirmOptions) => setConfirm(options), [confirm]);
  

  const handleCloseAlert = () => {
    // Gọi callback onClose của alert trước khi set state
    alert?.onClose?.(); 
    setAlert(null);
  };
  
  const handleConfirm = () => {
    // Gọi callback onConfirm của dialog
    confirm?.onConfirm();
    setConfirm(null);
  };

  const handleCancel = () => {
    // Gọi callback onCancel (nếu có)
    confirm?.onCancel?.();
    setConfirm(null);
  };

  return (
    <XDialogContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      {/* Render Alert */}
      {alert && (
        <XAlert
          title={alert.title}
          message={alert.message}
          type={alert.type}
          onClose={handleCloseAlert}
        />
      )}
      
      {/* 4. Render Confirm Dialog */}
      {confirm && (
        <XConfirmDialog
          visible={true}
          title={confirm.title}
          message={confirm.message}
          confirmText={confirm.confirmText}
          cancelText={confirm.cancelText}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          childrenBottom={confirm.childrenBottom}
          childrenTop={confirm.childrenTop}
        />
      )}
    </XDialogContext.Provider>
  );
} 