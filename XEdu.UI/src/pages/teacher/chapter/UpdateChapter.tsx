import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../../../constants/api';
import { apiService } from '../../../services/api';

interface Chapter {
  id: number;
  chaptername: string;
  status: 0 | 1 | 2; // 0 = DRAFT, 1 = PUBLIC, 2 = PRIVATE
  orderindex: number;
  duration: number;
  type: 'TOPIC';
  countLessons: number;
}

interface UpdateChapterProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
  chapterData?: Chapter;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const UpdateChapter: React.FC<UpdateChapterProps> = ({
  isOpen,
  onClose,
  courseId,
  chapterData,
  onSuccess,
  onError
}) => {
  const [loading, setLoading] = useState(false);
  const [chapterForm, setChapterForm] = useState({
    chaptername: '',
    status: 0 as 0 | 1 | 2,
    orderindex: 0,
    type: 'TOPIC' as const
  });

  // Update form when chapterData changes
  useEffect(() => {
    if (chapterData) {
      setChapterForm({
        chaptername: chapterData.chaptername,
        status: chapterData.status,
        orderindex: chapterData.orderindex,
        type: chapterData.type
      });
    }
  }, [chapterData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setChapterForm(prev => ({
      ...prev,
      [name]: name === 'status' || name === 'orderindex' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapterData) return;

    setLoading(true);
    try {
      await apiService.put(`${API_ENDPOINTS.UPDATE_CHAPTER}`, {
        ...chapterForm,
        id: chapterData.id
      });
      
      onSuccess('Cập nhật chương thành công!');
      onClose();
    } catch (error: any) {
      console.error('Error updating chapter:', error);
      const errorMessage = error?.response?.data?.message || 'Không thể cập nhật chương. Vui lòng thử lại.';
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const convertDurationToString = (duration: number) => {
    if (duration < 60) {
      return `${duration} phút`
    } else {
      const hours = Math.floor(duration / 60);
      const minutes = Math.floor(duration - hours * 60);
      if (minutes === 0) {
        return `${hours} giờ`;
      }
      else {
        return `${hours} giờ ${minutes} phút`;
      }
    }
  }

  const handleClose = () => {
    onClose();
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0: return 'Nháp';
      case 1: return 'Công khai';
      case 2: return 'Riêng tư';
      default: return 'Nháp';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return 'bg-yellow-100 text-yellow-800';
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose}></div>

      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Chỉnh sửa chương
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="chaptername" className="block text-sm font-medium text-gray-700">
                Tên chương
              </label>
              <input
                type="text"
                id="chaptername"
                name="chaptername"
                value={chapterForm.chaptername}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                readOnly
              />
              <p className="mt-1 text-xs text-gray-500">Tên chương không thể thay đổi</p>
            </div>

            <div>
              <label htmlFor="orderindex" className="block text-sm font-medium text-gray-700">
                Thứ tự chương
              </label>
              <input
                type="number"
                id="orderindex"
                name="orderindex"
                value={chapterForm.orderindex}
                onChange={handleInputChange}
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                readOnly
              />
              <p className="mt-1 text-xs text-gray-500">Thứ tự chương không thể thay đổi</p>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Trạng thái *
              </label>
              <select
                id="status"
                name="status"
                value={chapterForm.status}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              >
                <option value={0}>Nháp</option>
                <option value={1}>Công khai</option>
                <option value={2}>Riêng tư</option>
              </select>
              <div className="mt-2 flex items-center">
                <span className="text-sm text-gray-500 mr-2">Trạng thái hiện tại:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(chapterForm.status)}`}>
                  {getStatusLabel(chapterForm.status)}
                </span>
              </div>
            </div>

            {chapterData && (
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Thông tin chương</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>ID:</strong> {chapterData.id}</p>
                  <p><strong>Số bài học:</strong> {chapterData.countLessons} bài</p>
                  <p><strong>Thời lượng:</strong> {convertDurationToString(chapterData.duration)}</p>
                  <p><strong>Loại:</strong> {chapterData.type === 'TOPIC' ? 'Chủ đề' : 'Nội dung'}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang cập nhật...
                  </>
                ) : (
                  'Cập nhật chương'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateChapter;
