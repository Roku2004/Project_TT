import { useEffect } from 'react';
import { apiService } from '../services/api';

export const useApiAuthHandler = (showAuthModal: (message?: string) => void) => {
  useEffect(() => {
    apiService.setAuthRequiredHandler(showAuthModal);
  }, [showAuthModal]);
};