import React, { createContext, useContext, useState, ReactNode } from 'react';
import XAlert from './XAlert';

export type XAlertOptions = {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
};

export type XAlertContextType = {
  showAlert: (options: XAlertOptions) => void;
};

const XAlertContext = createContext<XAlertContextType | undefined>(undefined);

export function useXAlert() {
  const ctx = useContext(XAlertContext);
  if (!ctx) throw new Error('useXAlert must be used within XAlertProvider');
  return ctx;
}

export function XAlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<XAlertOptions | null>(null);

  const showAlert = (options: XAlertOptions) => setAlert(options);

  const handleClose = () => {
    setAlert(null);
    alert?.onClose?.();
  };

  return (
    <XAlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <XAlert
          title={alert.title}
          message={alert.message}
          type={alert.type}
          onClose={handleClose}
        />
      )}
    </XAlertContext.Provider>
  );
} 