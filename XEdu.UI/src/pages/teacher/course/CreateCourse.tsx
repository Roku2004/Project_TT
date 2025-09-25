import { ArrowLeft, Eye, Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../../constants/api';
import { apiService } from '../../../services/api';

interface Subject {
  id: number;
  name: string;
}

interface Grade {
  id: number;
  name: string;
  gradeLevel: number;
}

interface CourseFormData {
  title: string;
  description: string;
  objectives: string;
  thumbnail: string;
  price: number;
  isFree: boolean;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedDuration: number;
  subjectId: number;
  gradeId: number;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

const CreateCourse: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    objectives: '',
    thumbnail: '',
    price: 0,
    isFree: true,
    level: 'BEGINNER',
    estimatedDuration: 60,
    subjectId: 0,
    gradeId: 0,
    status: 'DRAFT',
  });

  useEffect(() => {
    fetchSubjects();
    fetchGrades();
  }, []);

  const fetchSubjects = async () => {
    try {
      const data = await apiService.get<any>(API_ENDPOINTS.SUBJECTS);
      setSubjects(data.response);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchGrades = async () => {
    try {
      const data = await apiService.get<any>(API_ENDPOINTS.GRADES);
      setGrades(data.response);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.subjectId || !formData.gradeId) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setLoading(true);
    try {
      // Convert data to match backend expectations
      const levelMap = {
        'BEGINNER': 0,
        'INTERMEDIATE': 1,
        'ADVANCED': 2
      };

      const statusMap = {
        'DRAFT': 0,
        'PUBLISHED': 1,
        'ARCHIVED': 2
      };

      const status = isDraft ? 'DRAFT' : 'PUBLISHED';

      const courseData = {
        title: formData.title,
        description: formData.description,
        objectives: formData.objectives,
        thumbnail: formData.thumbnail,
        price: formData.price,
        isFree: formData.isFree,
        level: levelMap[formData.level],
        estimatedDuration: formData.estimatedDuration,
        subjectId: parseInt(formData.subjectId.toString()),
        gradeId: parseInt(formData.gradeId.toString()),
        topicId: null, // Default topic ID - you might want to make this configurable
        status: statusMap[status]
      };

      console.log('Sending course data:', courseData); // Debug log
      console.log('API endpoint:', API_ENDPOINTS.TEACHER_CREATE_COURSE); // Debug log

      await apiService.post(API_ENDPOINTS.TEACHER_CREATE_COURSE, courseData);
      alert(isDraft ? 'Lưu bản nháp thành công!' : 'Xuất bản khóa học thành công!');
      navigate('/teacher/dashboard');
    } catch (error: any) {
      console.error('Full error details:', error); // Enhanced error logging
      console.error('Error response:', error.response?.data); // Backend error details
      console.error('Error status:', error.response?.status); // HTTP status

      const errorMessage = error.response?.data?.message || error.response?.data?.Message || error.message || 'Unknown error';
      alert('Có lỗi xảy ra: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/teacher/dashboard')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Tạo khóa học mới</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Thông tin cơ bản</h2>

            <div className="grid grid-cols-1 gap-6">
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
                  placeholder="VD: Toán học lớp 10 cơ bản"
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
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mô tả chi tiết về nội dung và mục tiêu của khóa học..."
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
                  rows={3}
                  value={formData.objectives}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Học sinh sẽ học được những gì sau khi hoàn thành khóa học..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700">
                    Môn học *
                  </label>
                  <select
                    id="subjectId"
                    name="subjectId"
                    value={formData.subjectId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value={0}>Chọn môn học</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="gradeId" className="block text-sm font-medium text-gray-700">
                    Lớp *
                  </label>
                  <select
                    id="gradeId"
                    name="gradeId"
                    value={formData.gradeId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value={0}>Chọn lớp</option>
                    {grades.map((grade) => (
                      <option key={grade.id} value={grade.id}>
                        {grade.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          {/* Media */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Hình ảnh khóa học</h2>

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
                placeholder="https://example.com/image.jpg"
              />
              {formData.thumbnail && (
                <div className="mt-2">
                  <img
                    src={formData.thumbnail}
                    alt="Preview"
                    className="h-32 w-48 object-cover rounded border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Giá khóa học</h2>

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
                        setFormData(prev => ({ ...prev, price: 0 }));
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
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={loading}
              className="bg-gray-200 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              Lưu bản nháp
            </button>
            <button
              type="submit"
              onClick={(e) => handleSubmit(e, false)}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              Xuất bản
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;