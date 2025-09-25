import { BookOpen, Clock } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../constants/api';
import { apiService } from '../services/api';

const MyCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async (page = 0) => {
    try {
      setLoading(true);
      const params: any = {
        page: page.toString(),
        size: '15'
      };
      const response = await apiService.get<any>(API_ENDPOINTS.MY_COURSES, params);
      const data = response.response?.content || [];
      console.log("my courses data", response.response);
      setTotalPages(response.response.totalPages);
      setCurrentPage(response.response.page);
      setCourses(data);
    } catch (err) {
      setError('Không thể tải danh sách khóa học của bạn');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchMyCourses(page);
  };

  const convertCourseLevel = (level: string) => {
    const levelMap: { [key: string]: string } = {
      'BEGINNER': 'Cơ bản',
      'INTERMEDIATE': 'Trung bình',
      'ADVANCED': 'Nâng cao'
    };
    return levelMap[level] || level;
  };

  const convertCourseStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'ACTIVE': 'Đang hoạt động',
      'COMPLETED': 'Đã hoàn thành',
      'DROPPED': 'Đã bỏ',
      'SUSPENDED': 'Tạm dừng'
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải khóa học của bạn...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <BookOpen className="mx-auto h-16 w-16" />
          </div>
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Khóa học của tôi</h1>
          <p className="text-gray-600">
            Danh sách các khóa học bạn đã đăng ký hoặc mua
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <BookOpen className="mx-auto h-16 w-16" />
            </div>
            <p className="text-gray-500 text-lg">Bạn chưa có khóa học nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.courseId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div onClick={() => navigate(`/courses/${course.courseId}/learn`, {
                  state: {
                    courseProgress: {
                      courseName: course.courseName,
                      courseDescription: course.courseDescription,
                      lessonCompleted: course.lessonCompleted || 0,
                      totalLessons: course.totalLessons || 0,
                      progress: course.progress || 0
                    }
                  }
                })}>
                  <div className="relative">
                    <img
                      src={course.courseImage || "https://placehold.co/300x200/0ea5e9/ffffff?text=Khóa+học"}
                      alt={course.courseName}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <span className="text-white text-xs font-medium bg-blue-600/80 px-2 py-1 rounded">
                        {convertCourseLevel(course.courseLevel)}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      <div className="line-clamp-2">
                        {course.courseName}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-4">Giáo viên: {course.teacherId || 'Chưa có thông tin'}</span>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Tiến độ</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${course.progress || 0}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Đăng ký: {formatDate(course.enrolledAt)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-medium ${course.status === 'COMPLETED' ? 'text-green-600' :
                          course.status === 'ACTIVE' ? 'text-blue-600' :
                            'text-gray-600'
                          }`}>
                          {convertCourseStatus(course.status)}
                        </span>
                        {/* <button 
                        onClick={() => navigate(`/courses/${course.courseId}/learn`, {
                          state: {
                            courseProgress: {
                              courseName: course.courseName,
                              courseDescription: course.courseDescription,
                              lessonCompleted: course.lessonCompleted || 0,
                              totalLessons: course.totalLessons || 0,
                              progress: course.progress || 0
                            }
                          }
                        })}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Vào học
                      </button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {totalPages >= 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className={`px-3 py-2 text-sm font-medium rounded-md ${currentPage === 0
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
                  className={`px-3 py-2 text-sm font-medium rounded-md ${i === currentPage
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
                className={`px-3 py-2 text-sm font-medium rounded-md ${currentPage === totalPages - 1
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
    </div>
  );
};

export default MyCoursesPage;
