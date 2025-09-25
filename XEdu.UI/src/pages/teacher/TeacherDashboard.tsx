import {
  Award,
  BarChart3,
  BookOpen,
  BookOpenCheck,
  Calendar,
  Clock,
  Edit,
  Eye,
  FileText,
  Plus,
  Trash2,
  TrendingUp,
  Upload,
  Users
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ClassroomManagement from '../../components/teacher/classroom/ClassroomManagement';
import PublishCourseModal from '../../components/teacher/course/PublishCourseModal';
import UpdateCourseModal from '../../components/teacher/course/UpdateCourseModal';
import LessonManagement from '../../components/teacher/LessonManagement';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';

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

interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  subjectName: string;
  gradeName: string;
  status: string;
  attemptsCount?: number;
  averageScore?: number;
  createdAt: string;
}

interface DashboardStats {
  totalCourses: number;
  totalExams: number;
  totalStudents: number;
  totalLessons: number;
  coursesThisMonth: number;
  examsThisMonth: number;
}

const TeacherDashboard: React.FC = () => {
  const { state } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'exams' | 'classes' | 'lessons'>('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalExams: 0,
    totalStudents: 0,
    totalLessons: 0,
    coursesThisMonth: 0,
    examsThisMonth: 0
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseForLessons, setSelectedCourseForLessons] = useState<Course | null>(null);
  const [selectedCourseForUpdate, setSelectedCourseForUpdate] = useState<Course | null>(null);
  const [selectedCourseForPublish, setSelectedCourseForPublish] = useState<Course | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Pagination state
  const [coursePagination, setCoursePagination] = useState({
    currentPage: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
    isLast: false,
    isFirst: true
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (page: number = 0, size: number = 10) => {
    try {
      setLoading(true);

      const [coursesApiRes, examsApiRes] = await Promise.all([
        apiService.get<any>(`/Course/courses?page=${page}&size=${size}`),
        apiService.get<any>('/Exam/exams')
      ]);

      console.log('Courses API response:', coursesApiRes); // Debug log
      console.log('Exams API response:', examsApiRes); // Debug log

      const coursesData = coursesApiRes.response?.content || [];
      const examsData = examsApiRes.response?.content || [];

      console.log('Courses data extracted:', coursesData); // Debug log
      console.log('Exams data extracted:', examsData); // Debug log

      setCourses(coursesData);
      setExams(examsData);

      // Update pagination info
      const coursesResponse = coursesApiRes.response;
      setCoursePagination({
        currentPage: coursesResponse?.page || 0,
        pageSize: coursesResponse?.size || 10,
        totalPages: coursesResponse?.totalPages || 0,
        totalElements: coursesResponse?.totalElements || 0,
        isLast: coursesResponse?.last || false,
        isFirst: coursesResponse?.first || true
      });

      // Calculate stats using totalElements from PagedResult
      const totalCoursesCount = coursesApiRes.response?.totalElements || coursesData.length || 0;
      const totalExamsCount = examsApiRes.response?.totalElements || examsData.length || 0;

      console.log('Total courses count:', totalCoursesCount); // Debug log
      console.log('Total exams count:', totalExamsCount); // Debug log

      setStats({
        totalCourses: totalCoursesCount,
        totalExams: totalExamsCount,
        totalStudents: 0, // Will be calculated from enrollments
        totalLessons: coursesData.reduce((sum: number, course: any) => sum + (course.lessonsCount || 0), 0) || 0,
        coursesThisMonth: coursesData.filter((course: any) =>
          new Date(course.createdAt).getMonth() === new Date().getMonth()
        ).length || 0,
        examsThisMonth: examsData.filter((exam: any) =>
          new Date(exam.createdAt).getMonth() === new Date().getMonth()
        ).length || 0
      });
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);

      // More detailed error logging
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchDashboardData(newPage, coursePagination.pageSize);
  };

  const Pagination: React.FC = () => {
    if (coursePagination.totalPages <= 1) return null;

    const currentPage = coursePagination.currentPage;
    const totalPages = coursePagination.totalPages;

    console.log('Pagination debug:', { currentPage, totalPages, isFirst: coursePagination.isFirst, isLast: coursePagination.isLast }); // Debug log

    return (
      <div className="mt-8 mb-6 flex justify-center">
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
    );
  };

  const StatsCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    trend?: string;
    color: string;
  }> = ({ title, value, icon, trend, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${color}`}>
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-lg font-medium text-gray-900">{value}</dd>
          </dl>
        </div>
        {trend && (
          <div className="flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            {trend}
          </div>
        )}
      </div>
    </div>
  );

  const QuickActions = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Tác vụ nhanh</h3>
      <div className="grid grid-cols-2 gap-4">
        <Link to="/teacher/courses/create" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Plus className="h-8 w-8 text-blue-600 mr-3" />
          <div className="text-left">
            <div className="font-medium text-gray-900">Tạo khóa học</div>
            <div className="text-sm text-gray-500">Tạo khóa học mới</div>
          </div>
        </Link>
        <Link to="/teacher/exams/create" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Plus className="h-8 w-8 text-green-600 mr-3" />
          <div className="text-left">
            <div className="font-medium text-gray-900">Tạo bài thi</div>
            <div className="text-sm text-gray-500">Tạo bài thi mới</div>
          </div>
        </Link>
        <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Users className="h-8 w-8 text-purple-600 mr-3" />
          <div className="text-left">
            <div className="font-medium text-gray-900">Tạo lớp học</div>
            <div className="text-sm text-gray-500">Quản lý lớp học</div>
          </div>
        </button>
        <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <BarChart3 className="h-8 w-8 text-orange-600 mr-3" />
          <div className="text-left">
            <div className="font-medium text-gray-900">Xem báo cáo</div>
            <div className="text-sm text-gray-500">Thống kê chi tiết</div>
          </div>
        </button>
      </div>
    </div>
  );

  const CoursesTable = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Khóa học của tôi</h3>
          <Link to="/teacher/courses/create" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Tạo khóa học
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khóa học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Môn học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Học sinh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-500">Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Chưa có khóa học nào
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded object-cover"
                          src={course.thumbnail || 'https://placehold.co/40x40/0ea5e9/ffffff?text=Course'}
                          alt=""
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{course.title}</div>
                          <div className="text-sm text-gray-500">{course.gradeName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.subjectName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.studentsCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${course.status === 1
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {course.status === 1 ? 'Đã xuất bản' : 'Nháp'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${course.price !== 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {course.price !== 0 ? course.price + ' Đ' : 'Miễn phí'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {course.status === 0 && (
                          <button 
                            onClick={() => {
                              setSelectedCourseForPublish(course);
                              setShowPublishModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900" 
                            title="Xuất bản"
                          >
                            <Upload className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedCourseForLessons(course);
                            setActiveTab('lessons');
                          }}
                          className="text-purple-600 hover:text-purple-900"
                          title="Quản lý bài học"
                        >
                          <BookOpenCheck className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedCourseForUpdate(course);
                            setShowUpdateModal(true);
                          }}
                          className="text-green-600 hover:text-green-900" 
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900" title="Xóa">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination />
    </div>
  );

  const ExamsTable = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Bài thi của tôi</h3>
          <Link to="/teacher/exams/create" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Tạo bài thi
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bài thi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Môn học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Câu hỏi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lượt thi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điểm TB
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{exam.title}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {exam.duration} phút
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exam.subjectName} - {exam.gradeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exam.totalQuestions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exam.attemptsCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exam.averageScore ? `${exam.averageScore.toFixed(1)}%` : '--'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  Trang giáo viên
                </h2>
                <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    Xin chào, {state.user?.fullName}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Tổng quan', icon: BarChart3 },
              { id: 'courses', name: 'Khóa học', icon: BookOpen },
              { id: 'exams', name: 'Bài thi', icon: FileText },
              { id: 'classes', name: 'Lớp học', icon: Users },
              ...(selectedCourseForLessons ? [{ id: 'lessons', name: `Bài học - ${selectedCourseForLessons.title}`, icon: BookOpenCheck }] : [])
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Tổng khóa học"
                value={stats.totalCourses}
                icon={<BookOpen className="h-6 w-6" />}
                color="text-blue-600"
              />
              <StatsCard
                title="Tổng bài thi"
                value={stats.totalExams}
                icon={<FileText className="h-6 w-6" />}
                color="text-green-600"
              />
              <StatsCard
                title="Học sinh"
                value={stats.totalStudents}
                icon={<Users className="h-6 w-6" />}
                color="text-purple-600"
              />
              <StatsCard
                title="Bài học"
                value={stats.totalLessons}
                icon={<Award className="h-6 w-6" />}
                color="text-orange-600"
              />
            </div>

            <QuickActions />

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Khóa học gần đây</h3>
                <div className="space-y-3">
                  {courses.slice(0, 3).map((course) => (
                    <div key={course.id} className="flex items-center space-x-3">
                      <img
                        className="h-8 w-8 rounded object-cover"
                        src={course.thumbnail || 'https://placehold.co/32x32/0ea5e9/ffffff?text=C'}
                        alt=""
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {course.title}
                        </p>
                        <p className="text-xs text-gray-500">{course.subjectName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Bài thi gần đây</h3>
                <div className="space-y-3">
                  {exams.slice(0, 3).map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {exam.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {exam.totalQuestions} câu hỏi • {exam.duration} phút
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {exam.attemptsCount || 0} lượt
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && <CoursesTable />}
        {activeTab === 'exams' && <ExamsTable />}
        {activeTab === 'classes' && <ClassroomManagement />}
        {activeTab === 'lessons' && selectedCourseForLessons && (
          <LessonManagement
            courseId={selectedCourseForLessons.id}
            courseName={selectedCourseForLessons.title}
          />
        )}
      </div>

      {/* Update Course Modal */}
      {selectedCourseForUpdate && (
        <UpdateCourseModal
          course={selectedCourseForUpdate}
          isOpen={showUpdateModal}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedCourseForUpdate(null);
          }}
          onUpdate={() => {
            fetchDashboardData(); // Refresh data after update
            setShowUpdateModal(false);
            setSelectedCourseForUpdate(null);
          }}
        />
      )}

      {/* Publish Course Modal */}
      {selectedCourseForPublish && (
        <PublishCourseModal
          course={selectedCourseForPublish}
          isOpen={showPublishModal}
          onClose={() => {
            setShowPublishModal(false);
            setSelectedCourseForPublish(null);
          }}
          onPublish={() => {
            fetchDashboardData(); // Refresh data after publish
            setShowPublishModal(false);
            setSelectedCourseForPublish(null);
          }}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;