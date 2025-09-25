import React from 'react';
import { useAuthErrorContext } from '../../contexts/AuthErrorContext';

const Test403Component: React.FC = () => {
  const { showAuthModal } = useAuthErrorContext();

  const handleTest403 = () => {
    showAuthModal('Đây là test popup lỗi 403 - Bạn cần đăng nhập để truy cập tính năng này');
  };

  const handleTestSpecificMessage = () => {
    showAuthModal('Bạn cần đăng nhập để tham gia bài thi này');
  };

  const handleTestDefault = () => {
    showAuthModal();
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-center">Test 403 Auth Modal</h2>
      
      <div className="space-y-3">
        <button
          onClick={handleTest403}
          className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Test 403 với thông báo tùy chỉnh
        </button>
        
        <button
          onClick={handleTestSpecificMessage}
          className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Test với thông báo bài thi
        </button>
        
        <button
          onClick={handleTestDefault}
          className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Test với thông báo mặc định
        </button>
      </div>
      
      <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
        <p><strong>Hướng dẫn test:</strong></p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Nhấn các nút để hiển thị popup</li>
          <li>Popup sẽ có nút "Đăng nhập" và "Đăng ký"</li>
          <li>Các nút sẽ điều hướng đến trang tương ứng</li>
        </ul>
      </div>
    </div>
  );
};

export default Test403Component;