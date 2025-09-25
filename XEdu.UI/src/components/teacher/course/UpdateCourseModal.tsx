import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../../../constants/api';
import { apiService } from '../../../services/api';

interface CourseFormData {
  title: string;
  description: string;
  objectives: string;
  thumbnail: string;
  price: number;
  isFree: boolean;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedDuration: number;
  subjectId?: number;
  gradeId?: number;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

interface Course {
  id: number;
  title: string;
  description: string;
  objectives?: string;
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

interface UpdateCourseModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const UpdateCourseModal: React.FC<UpdateCourseModalProps> = ({ 
  course, 
  isOpen, 
  onClose, 
  onUpdate 
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    objectives: '',
    thumbnail: '',
    price: 0,
    isFree: true,
    level: 'BEGINNER',
    estimatedDuration: 60,
    subjectId: undefined,
    gradeId: undefined,
    status: 'DRAFT',
  });

  useEffect(() => {
    if (course && isOpen) {
      const levelMap: { [key: number]: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' } = {
        0: 'BEGINNER',
        1: 'INTERMEDIATE',
        2: 'ADVANCED'
      };

      const statusMap: { [key: number]: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' } = {
        0: 'DRAFT',
        1: 'PUBLISHED',
        2: 'ARCHIVED'
      };

      setFormData({
        title: course.title,
        description: course.description,
        objectives: course.objectives || '',
        thumbnail: course.thumbnail,
        price: course.price,
        isFree: course.isFree,
        level: levelMap[course.level] || 'BEGINNER',
        estimatedDuration: course.estimatedDuration,
        subjectId: course.subjectId || undefined,
        gradeId: course.gradeId || undefined,
        status: statusMap[course.status] || 'DRAFT'
      });
    }
  }, [course, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked
        : type === 'number'
        ? Number(value)
        : value
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setLoading(true);
    try {
      const levelMap = {
        'BEGINNER': 0,
        'INTERMEDIATE': 1,
        'ADVANCED': 2
      };
      if (formData.isFree == true) {
        formData.price = 0;
      }
      const courseData = {
        id: course.id,
        title: formData.title,
        description: formData.description,
        objectives: formData.objectives,
        thumbnail: formData.thumbnail,
        price: formData.price,
        isFree: formData.isFree,
        level: levelMap[formData.level],
        estimatedDuration: formData.estimatedDuration,
      };
      
      console.log('Sending course data:', courseData);

      await apiService.put(API_ENDPOINTS.TEACHER_UPDATE_COURSE, courseData);
      alert('Cập nhật khóa học thành công!');
      onUpdate();
    } catch (error: any) {
      console.error('Error updating course:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.Message || error.message || 'Unknown error';
      alert('Có lỗi xảy ra: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
           onClick={onClose}></div>
      
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Chỉnh sửa khóa học: {course.title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleUpdate} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Thông tin cơ bản</h4>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Tên khóa học *
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Mô tả khóa học *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="objectives" className="block text-sm font-medium text-gray-700">
                        Mục tiêu khóa học
                      </label>
                      <textarea
                        id="objectives"
                        name="objectives"
                        rows={2}
                        value={formData.objectives}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Level and Duration */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Chi tiết khóa học</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                        Mức độ
                      </label>
                      <select
                        id="level"
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="BEGINNER">Cơ bản</option>
                        <option value="INTERMEDIATE">Trung bình</option>
                        <option value="ADVANCED">Nâng cao</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700">
                        Thời lượng ước tính (phút)
                      </label>
                      <input
                        type="number"
                        id="estimatedDuration"
                        name="estimatedDuration"
                        value={formData.estimatedDuration}
                        onChange={handleInputChange}
                        min="1"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Hình ảnh</h4>
                  
                  <div>
                    <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
                      URL hình thumbnail
                    </label>
                    <input
                      type="url"
                      id="thumbnail"
                      name="thumbnail"
                      value={formData.thumbnail}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {formData.thumbnail && (
                      <div className="mt-2">
                        <img
                          src={formData.thumbnail}
                          alt="Preview"
                          className="h-20 w-32 object-cover rounded border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Giá khóa học</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isFree"
                        name="isFree"
                        checked={formData.isFree}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isFree" className="ml-2 block text-sm text-gray-900">
                        Khóa học miễn phí
                      </label>
                    </div>

                    {!formData.isFree && (
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                          Giá (VNĐ)
                        </label>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={formData.price || ''}
                          onChange={handleInputChange}
                          onFocus={(e) => {
                            if (e.target.value === '0') {
                              e.target.value = '';
                              setFormData(prev => ({...prev, price: 0}));
                            }
                          }}
                          min="0"
                          placeholder="Nhập giá khóa học"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 disabled:opacity-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                  </button>
                </div>
              </form>
            </div>
          </div>
      </div>
  );
};

export default UpdateCourseModal;
