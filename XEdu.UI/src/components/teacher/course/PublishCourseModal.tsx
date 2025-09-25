import { CheckCircle, X } from 'lucide-react';
import React, { useState } from 'react';
import { API_ENDPOINTS } from '../../../constants/api';
import { apiService } from '../../../services/api';

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  isFree: boolean;
  level: number;
  estimatedDuration: number;
  subjectName: string;
  gradeName: string;
  subjectId?: number;
  gradeId?: number;
  status: number;
  studentsCount?: number;
  lessonsCount?: number;
  createdAt: string;
}

interface PublishCourseModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onPublish: () => void;
}

const PublishCourseModal: React.FC<PublishCourseModalProps> = ({ 
  course, 
  isOpen, 
  onClose, 
  onPublish 
}) => {
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    setLoading(true);
    try {
      const publishData = {
        id: course.id,
        published: true,
        status: 1 
      };
      
      console.log('Publishing course:', publishData);

      await apiService.put(API_ENDPOINTS.TEACHER_PUBLISH_COURSE, publishData);
      alert('Xuất bản khóa học thành công!');
      onPublish();
    } catch (error: any) {
      console.error('Error publishing course:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.Message || error.message || 'Unknown error';
      alert('Có lỗi xảy ra khi xuất bản: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
           onClick={onClose}></div>
      
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Xuất bản khóa học
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="px-6 py-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-md font-medium text-gray-900 mb-2">
                Xác nhận xuất bản khóa học
              </h4>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <img
                      className="h-8 w-8 rounded object-cover"
                      src={course.thumbnail || 'https://placehold.co/32x32/0ea5e9/ffffff?text=C'}
                      alt=""
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{course.title}</div>
                      <div className="text-xs text-gray-500">{course.subjectName} - {course.gradeName}</div>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="mb-2">Bạn có chắc chắn muốn xuất bản khóa học này không?</p>
                  <p className="text-xs text-gray-500">
                    Sau khi xuất bản, khóa học sẽ được hiển thị công khai và học sinh có thể đăng ký tham gia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handlePublish}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xuất bản...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Xuất bản
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishCourseModal;
