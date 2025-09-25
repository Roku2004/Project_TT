import { AlertTriangle, BookOpen, Clock, Filter, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../constants/api';
import { apiService } from '../services/api';
import { CourseEnrollmentRequest, User } from '../types';
import CourseEnrollment from './student/CourseEnrollment';
interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string | null;
  price: number;
  isFree: boolean;
  level: number;
  estimatedDuration: number;
  teacher: User;
  subjectName: string;
  gradeName: string;
  createdAt: string;
}

interface CoursePage {
  content: Course[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  first: boolean;
  last: boolean;
}

interface Subject {
  id: number;
  name: string;
}

interface Grade {
  id: number;
  gradeLevel: number;
}

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  
  // Enrollment modal state
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const fetchCourses = async (page = 0, search = '', subjectId = '', gradeId = '') => {
    try {
      setLoading(true);
      const params: any = {
        page: page.toString(),
        size: '15'
      };

      if (search) params.search = search;
      if (subjectId) params.subjectId = subjectId;
      if (gradeId) params.gradeId = gradeId;
      console.log('fetchExams params:', params); // Debug log
      console.log('API endpoint:', API_ENDPOINTS.COURSES); // Debug log
      const response = await apiService.get<any>(API_ENDPOINTS.COURSES, params);
      console.log('fetchExams response:', response); // Debug log
      console.log('Response content:', response.response?.content); // Debug log
      // if (!response.ok) {
      //   throw new Error('Không thể tải danh sách khóa học');
      // }
      const data: CoursePage = await response.response;
      setCourses(data.content);
      setTotalPages(data.totalPages);
      setCurrentPage(data.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const convertCourseLevel = (level: number) => {
    const levelMap: { [key: number]: string } = {
      0: 'Cơ bản',
      1: 'Trung bình',
      2: 'Nâng cao'
    };
    return levelMap[level] || level;
  };

  useEffect(() => {
    fetchCourses();
    fetchSubjects();
    fetchGrades();
  }, []);

  // Auto filter when dropdown values change
  useEffect(() => {
    if (selectedSubject !== '' || selectedGrade !== '') {
      fetchCourses(0, searchTerm, selectedSubject, selectedGrade);
    }
  }, [selectedSubject, selectedGrade]);

  const fetchSubjects = async () => {
    try {
      const data = await apiService.get<any>(API_ENDPOINTS.SUBJECTS);
      if (data.response && Array.isArray(data.response)) {
        setSubjects(data.response);
      } else if (data.response && data.response.content && Array.isArray(data.response.content)) {
        setSubjects(data.response.content);
      } else {
        console.warn('Unexpected subjects response structure:', data);
        setSubjects([]);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects([]);
    }
  };

  const fetchGrades = async () => {
    try {
      const data = await apiService.get<any>(API_ENDPOINTS.GRADES);
      if (data.response && Array.isArray(data.response)) {
        setGrades(data.response);
      } else if (data.response && data.response.content && Array.isArray(data.response.content)) {
        setGrades(data.response.content);
      } else {
        console.warn('Unexpected grades response structure:', data);
        setGrades([]);
      }
    } catch (error) {
      console.error('Error fetching grades:', error);
      setGrades([]);
    }
  };

  const handleSubmitCourse = async (enrollmentData: CourseEnrollmentRequest) => {
    try {
      const response = await apiService.post<any>(API_ENDPOINTS.CREATE_COURSE_ENROLLMENT, enrollmentData);
      
      if (response.success) {
        alert('Đăng ký khóa học thành công!');
        fetchCourses();
      } else {
        throw new Error('Failed to enroll in course');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Có lỗi xảy ra khi đăng ký khóa học. Vui lòng thử lại!');
    }
  };

  const handleOpenEnrollmentModal = (course: Course) => {
    setSelectedCourse(course);
    setIsEnrollmentModalOpen(true);
  };

  const handleCloseEnrollmentModal = () => {
    setIsEnrollmentModalOpen(false);
    setSelectedCourse(null);
  };


  const handleSearch = () => {
    setCurrentPage(0);
    fetchCourses(0, searchTerm, selectedSubject, selectedGrade);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSubject('');
    setSelectedGrade('');
    setCurrentPage(0);
    fetchCourses(0, '', '', '');
  };

  const handlePageChange = (page: number) => {
    fetchCourses(page, searchTerm, selectedSubject, selectedGrade);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) return `${remainingMinutes} phút`;
    if (remainingMinutes === 0) return `${hours} giờ`;
    return `${hours} giờ ${remainingMinutes} phút`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <AlertTriangle className="mx-auto h-16 w-16" />
          </div>
          <p className="text-red-600 font-semibold">{error}</p>
          <button
            onClick={() => fetchCourses()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Khóa học</h1>
          <p className="text-gray-600">
            Khám phá hàng ngàn khóa học chất lượng cao từ các giáo viên hàng đầu
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tìm kiếm khóa học..."
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả môn học</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id.toString()}>
                  {subject.name}
                </option>
              ))}
            </select>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả lớp</option>
              {grades.map((grade) => (
                <option key={grade.id} value={grade.id.toString()}>
                  Lớp {grade.id}
                </option>
              ))}
            </select>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Lọc
            </button>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Đặt lại
            </button>
          </div>
        </div>

        {/* Course Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <BookOpen className="mx-auto h-16 w-16" />
            </div>
            <p className="text-gray-500 text-lg">Không tìm thấy khóa học nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={course.thumbnail || "https://placehold.co/300x200/0ea5e9/ffffff?text=Khóa+học"}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {course.subjectName}
                    </span>
                    <span className="text-xs text-gray-500">{course.gradeName}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span className="mr-4">Giáo viên: {course.teacher.fullName}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {convertCourseLevel(course.level)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDuration(course.estimatedDuration)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {course.isFree ? (
                        <span className="text-lg font-bold text-green-600">Miễn phí</span>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(course.price)}đ
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleOpenEnrollmentModal(course)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      {course.isFree ? 'Đăng ký ngay' : 'Mua ngay'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages >= 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Trước
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    i === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === totalPages - 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Sau
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Course Enrollment Modal */}
      {selectedCourse && (
        <CourseEnrollment
          course={selectedCourse}
          isOpen={isEnrollmentModalOpen}
          onClose={handleCloseEnrollmentModal}
          onEnroll={handleSubmitCourse}
        />
      )}
    </div>
  );
};

export default CoursesPage;