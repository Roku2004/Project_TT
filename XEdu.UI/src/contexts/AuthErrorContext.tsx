import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthErrorContextType {
  isAuthModalOpen: boolean;
  authMessage: string;
  showAuthModal: (message?: string) => void;
  hideAuthModal: () => void;
}

const AuthErrorContext = createContext<AuthErrorContextType | undefined>(undefined);

export const useAuthErrorContext = () => {
  const context = useContext(AuthErrorContext);
  if (context === undefined) {
    throw new Error('useAuthErrorContext must be used within an AuthErrorProvider');
  }
  return context;
};

interface AuthErrorProviderProps {
  children: ReactNode;
}

export const AuthErrorProvider: React.FC<AuthErrorProviderProps> = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  const showAuthModal = (message: string = "Vui lòng đăng nhập hoặc đăng ký để sử dụng tính năng này") => {
    setAuthMessage(message);
    setIsAuthModalOpen(true);
  };

  const hideAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthMessage('');
  };

  return (
    <AuthErrorContext.Provider
      value={{
        isAuthModalOpen,
        authMessage,
        showAuthModal,
        hideAuthModal,
      }}
    >
      {children}
    </AuthErrorContext.Provider>
  );
};