import { X } from 'lucide-react';
import React, { useState } from 'react';
import { apiService } from '../../../services/api';

interface CreateChapterProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
  onSuccess?: (message: string) => void;
}

const CreateChapter: React.FC<CreateChapterProps> = ({ 
  isOpen, 
  onClose, 
  courseId, 
  onSuccess 
}) => {
  const [chapterForm, setChapterForm] = useState({
    chapterName: '',
    order_index: 1
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setChapterForm(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const resetForm = () => {
    setChapterForm({
        chapterName: '',
        order_index: 1
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const chapterData = {
        ...chapterForm,
        courseId: courseId
      };

      await apiService.post('/teacher/chapters', chapterData);
      
      if (onSuccess) {
        onSuccess('Tạo chương trình học thành công!');
      }
      
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error creating chapter:', error);
      alert('Không thể tạo chương trình học. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={handleClose}></div>

      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Tạo chương trình học mới
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-md font-medium text-gray-900 mb-4">Thông tin chương trình học</h4>

              <div className="space-y-4">
                <div>
                  <label htmlFor="chapterName" className="block text-sm font-medium text-gray-700">
                    Tiêu đề chương trình học *
                  </label>
                  <input
                    type="text"
                    id="chapterName"
                    name="chapterName"
                    value={chapterForm.chapterName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Nhập tiêu đề chương trình học..."
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="order_index" className="block text-sm font-medium text-gray-700">
                    Thứ tự chương trình học
                  </label>
                  <input
                    type="number"
                    id="order_index"
                    name="order_index"
                    value={chapterForm.order_index}
                    onChange={handleInputChange}
                    min="1"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang tạo...
                  </>
                ) : (
                  'Tạo chương trình học'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateChapter;
