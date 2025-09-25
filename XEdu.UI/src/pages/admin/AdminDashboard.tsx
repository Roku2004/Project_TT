import React, { useState, useEffect } from 'react';
import { 
  Users, 
  User,
  BookOpen, 
  FileText, 
  BarChart3, 
  Settings, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  UserCheck,
  UserX,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';

interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalExams: number;
  totalSubjects: number;
  totalGrades: number;
  totalClassrooms: number;
  usersThisMonth: number;
  coursesThisMonth: number;
  activeUsers: number;
  pendingApprovals: number;
}

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  active: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface Course {
  id: number;
  title: string;
  teacherName: string;
  subjectName: string;
  gradeName: string;
  status: string;
  studentsCount: number;
  createdAt: string;
}

interface Subject {
  id: number;
  name: string;
  description: string;
  icon: string;
  active: boolean;
  coursesCount: number;
}

interface Grade {
  id: number;
  name: string;
  gradeLevel: number;
  description: string;
  active: boolean;
  studentsCount: number;
}

const AdminDashboard: React.FC = () => {
  const { state } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses' | 'subjects' | 'grades' | 'settings'>('overview');
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalExams: 0,
    totalSubjects: 0,
    totalGrades: 0,
    totalClassrooms: 0,
    usersThisMonth: 0,
    coursesThisMonth: 0,
    activeUsers: 0,
    pendingApprovals: 0
  });
  
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, coursesRes, subjectsRes, gradesRes] = await Promise.all([
        apiService.get<AdminStats>('/admin/stats'),
        apiService.get<{ content: User[] }>('/admin/users'),
        apiService.get<{ content: Course[] }>('/admin/courses'),
        apiService.get<Subject[]>('/public/subjects'),
        apiService.get<Grade[]>('/public/grades')
      ]);

      setStats(statsRes || {
        totalUsers: usersRes.content?.length || 0,
        totalCourses: coursesRes.content?.length || 0,
        totalExams: 0,
        totalSubjects: subjectsRes?.length || 0,
        totalGrades: gradesRes?.length || 0,
        totalClassrooms: 0,
        usersThisMonth: 0,
        coursesThisMonth: 0,
        activeUsers: 0,
        pendingApprovals: 0
      });
      
      setUsers(usersRes.content || []);
      setCourses(coursesRes.content || []);
      setSubjects(subjectsRes || []);
      setGrades(gradesRes || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusChange = async (userId: number, active: boolean) => {
    try {
      await apiService.put(`/admin/users/${userId}/status`, { active });
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Không thể cập nhật trạng thái người dùng.');
    }
  };

  const handleCourseStatusChange = async (courseId: number, status: string) => {
    try {
      await apiService.put(`/admin/courses/${courseId}/status`, { status });
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating course status:', error);
      alert('Không thể cập nhật trạng thái khóa học.');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'TEACHER': return 'bg-blue-100 text-blue-800';
      case 'STUDENT': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
            <dd className="text-lg font-medium text-gray-900">{value.toLocaleString()}</dd>
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

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Tổng người dùng"
          value={stats.totalUsers}
          icon={<Users className="h-6 w-6" />}
          color="text-blue-600"
          trend={`+${stats.usersThisMonth} tháng này`}
        />
        <StatsCard
          title="Tổng khóa học"
          value={stats.totalCourses}
          icon={<BookOpen className="h-6 w-6" />}
          color="text-green-600"
          trend={`+${stats.coursesThisMonth} tháng này`}
        />
        <StatsCard
          title="Tổng bài thi"
          value={stats.totalExams}
          icon={<FileText className="h-6 w-6" />}
          color="text-purple-600"
        />
        <StatsCard
          title="Người dùng hoạt động"
          value={stats.activeUsers}
          icon={<UserCheck className="h-6 w-6" />}
          color="text-orange-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hoạt động gần đây</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <UserCheck className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">Người dùng mới đăng ký</p>
                <p className="text-sm text-gray-500">2 phút trước</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <BookOpen className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">Khóa học mới được tạo</p>
                <p className="text-sm text-gray-500">15 phút trước</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <FileText className="h-5 w-5 text-purple-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">Bài thi mới được xuất bản</p>
                <p className="text-sm text-gray-500">1 giờ trước</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cảnh báo hệ thống</h3>
          <div className="space-y-3">
            {stats.pendingApprovals > 0 && (
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800">
                    {stats.pendingApprovals} khóa học cần phê duyệt
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">
                  Hệ thống hoạt động bình thường
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const UsersTab = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả vai trò</option>
              <option value="STUDENT">Học sinh</option>
              <option value="TEACHER">Giáo viên</option>
              <option value="ADMIN">Quản trị</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Xuất Excel
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Thêm người dùng
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tham gia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lần đăng nhập cuối
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users
                .filter(user => 
                  user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .filter(user => selectedRole === '' || user.role === selectedRole)
                .map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role === 'ADMIN' ? 'Quản trị' : user.role === 'TEACHER' ? 'Giáo viên' : 'Học sinh'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.active ? 'Hoạt động' : 'Tạm khóa'}
                      </span>
                      {user.emailVerified && (
                        <div className="text-xs text-green-600">✓ Email đã xác thực</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('vi-VN') : 'Chưa đăng nhập'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" title="Xem chi tiết">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900" title="Chỉnh sửa">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleUserStatusChange(user.id, !user.active)}
                        className={`${user.active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        title={user.active ? 'Khóa tài khoản' : 'Kích hoạt tài khoản'}
                      >
                        {user.active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
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

  const CoursesTab = () => (
    <div className="space-y-6">
      {/* Courses Management */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Quản lý khóa học</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Thêm khóa học
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khóa học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giáo viên
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
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{course.title}</div>
                    <div className="text-sm text-gray-500">{course.gradeName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.teacherName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.subjectName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.studentsCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(course.status)}`}>
                      {course.status === 'PUBLISHED' ? 'Đã xuất bản' : course.status === 'DRAFT' ? 'Nháp' : 'Lưu trữ'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" title="Xem chi tiết">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900" title="Chỉnh sửa">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleCourseStatusChange(course.id, course.status === 'PUBLISHED' ? 'ARCHIVED' : 'PUBLISHED')}
                        className="text-yellow-600 hover:text-yellow-900" 
                        title={course.status === 'PUBLISHED' ? 'Lưu trữ' : 'Xuất bản'}
                      >
                        <Settings className="h-4 w-4" />
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
                  Bảng điều khiển quản trị
                </h2>
                <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Shield className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    Xin chào, {state.user?.fullName} - Quản trị viên
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
              { id: 'users', name: 'Người dùng', icon: Users },
              { id: 'courses', name: 'Khóa học', icon: BookOpen },
              { id: 'subjects', name: 'Môn học', icon: FileText },
              { id: 'grades', name: 'Khối lớp', icon: Calendar },
              { id: 'settings', name: 'Cài đặt', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`${
                    activeTab === tab.id
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
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'courses' && <CoursesTab />}
        {activeTab === 'subjects' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quản lý môn học</h3>
            <p className="text-gray-500">Tính năng đang được phát triển...</p>
          </div>
        )}
        {activeTab === 'grades' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quản lý khối lớp</h3>
            <p className="text-gray-500">Tính năng đang được phát triển...</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cài đặt hệ thống</h3>
            <p className="text-gray-500">Tính năng đang được phát triển...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;