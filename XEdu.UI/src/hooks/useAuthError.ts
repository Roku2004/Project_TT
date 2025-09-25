import { useState, useCallback } from 'react';

interface AuthErrorState {
  isModalOpen: boolean;
  message: string;
}

export const useAuthError = () => {
  const [authError, setAuthError] = useState<AuthErrorState>({
    isModalOpen: false,
    message: ''
  });

  const handleAuthError = useCallback((error: any, customMessage?: string) => {
    if (error.response?.status === 403 || error.status === 403) {
      setAuthError({
        isModalOpen: true,
        message: customMessage || "Vui lòng đăng nhập hoặc đăng ký để sử dụng tính năng này"
      });
      return true;
    }
    return false;
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthError({
      isModalOpen: false,
      message: ''
    });
  }, []);

  const handle403Error = useCallback((message?: string) => {
    setAuthError({
      isModalOpen: true,
      message: message || "Vui lòng đăng nhập hoặc đăng ký để sử dụng tính năng này"
    });
  }, []);

  return {
    authError,
    handleAuthError,
    closeAuthModal,
    handle403Error
  };
};