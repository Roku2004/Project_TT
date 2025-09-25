import { AxiosError } from 'axios';

export const isAuthRequired = (error: any): boolean => {
  return error?.response?.status === 403 || error?.status === 403;
};

export const getAuthRequiredMessage = (context: string = ''): string => {
  const messages: Record<string, string> = {
    exam: 'Bạn cần đăng nhập để tham gia bài thi',
    course: 'Bạn cần đăng nhập để truy cập khóa học này',
    profile: 'Bạn cần đăng nhập để xem thông tin cá nhân',
    enrollment: 'Bạn cần đăng nhập để đăng ký khóa học',
    default: 'Vui lòng đăng nhập hoặc đăng ký để sử dụng tính năng này'
  };
  
  return messages[context] || messages.default;
};

export const handleAuthError = (
  error: any, 
  showAuthModal: (message?: string) => void,
  context: string = ''
): boolean => {
  if (isAuthRequired(error)) {
    showAuthModal(getAuthRequiredMessage(context));
    return true;
  }
  return false;
};