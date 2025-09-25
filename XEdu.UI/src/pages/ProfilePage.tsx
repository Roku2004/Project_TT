import {
  Award,
  BookOpen,
  Calendar,
  Camera,
  Clock,
  Edit,
  FileText,
  Mail,
  Phone,
  Save,
  Shield,
  TrendingUp,
  User,
  Users,
  X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../constants/api';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  role: number; // Backend trả về role dưới dạng số: 0=ADMIN, 1=TEACHER, 2=STUDENT
  avatar?: string;
  phone?: string;
  active: boolean; // Backend trả về 'active' thay vì 'emailVerified'
  createdAt?: string; // Optional vì backend có thể không trả về
}

interface UserStats {
  coursesCount?: number;
  examsCount?: number;
  studentsCount?: number;
  lessonsCount?: number;
  enrolledCoursesCount?: number;
  completedExamsCount?: number;
  totalUsers?: number;
  totalCourses?: number;
  totalExams?: number;
}

const ProfilePage: React.FC = () => {
  const { state, updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    avatar: ''
  });

  useEffect(() => {
    fetchProfile();
    fetchUserStats();
  }, []);

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile for role:', state.user?.role); // Debug log
      
      const apiResponse = await apiService.get<any>(API_ENDPOINTS.ME);
      
      // Extract data from ApiResponse wrapper - backend returns { data: {...}, success: bool, message: string }
      const response = apiResponse.response || apiResponse;
      
      console.log('Profile API Response:', apiResponse); // Debug log
      console.log('Extracted profile:', response); // Debug log
      
      setProfile(response);
      setEditForm({
        fullName: response.fullName || '',
        phone: response.phone || '',
        avatar: response.avatar || ''
      });
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      
      // More detailed error logging
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        
        // Check if it's an authorization issue
        if (error.response.status === 403) {
          console.error('403 Forbidden - User does not have permission to access profile');
        } else if (error.response.status === 401) {
          console.error('401 Unauthorized - User is not authenticated');
        }
      } else if (error.request) {
        console.error('Request was made but no response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    if (!state.user?.role) return;

    try {
      switch (state.user.role) {
        case 'TEACHER':
          const [coursesApiRes, examsApiRes] = await Promise.all([
            apiService.get<any>('/Course/courses'),
            apiService.get<any>('/Exam/exams')
          ]);
          
          console.log('Profile - Courses API response:', coursesApiRes); // Debug log
          console.log('Profile - Exams API response:', examsApiRes); // Debug log
          
          const totalCoursesCount = coursesApiRes.response?.totalElements || 0;
          const totalExamsCount = examsApiRes.response?.totalElements || 0;
          
          console.log('Profile - Total courses count:', totalCoursesCount); // Debug log
          console.log('Profile - Total exams count:', totalExamsCount); // Debug log
          
          setStats({
            coursesCount: totalCoursesCount,
            examsCount: totalExamsCount
          });
          break;
        
        case 'STUDENT':
          // Add student-specific stats here
          setStats({
            enrolledCoursesCount: 0,
            completedExamsCount: 0
          });
          break;
        
        case 'ADMIN':
          // Add admin-specific stats here
          setStats({
            totalUsers: 0,
            totalCourses: 0,
            totalExams: 0
          });
          break;
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setUpdating(true);
      console.log('Updating profile with data:', editForm); // Debug log
      
      // Backend expects UpdateProfileRequest structure
      const updateRequest = {
        fullName: editForm.fullName,
        phone: editForm.phone,
        avatar: editForm.avatar,
        updatedAt: new Date().toISOString()
      };
      
      const apiResponse = await apiService.put<any>(API_ENDPOINTS.UPDATE_PROFILE, updateRequest);
      
      // Extract response from ApiResponse wrapper
      console.log('Update profile API response:', apiResponse); // Debug log
      
      // Backend returns ApiResponse<String> with success message
      if (apiResponse.success || apiResponse.data) {
        const updatedProfile = {
          ...profile,
          fullName: editForm.fullName,
          phone: editForm.phone,
          avatar: editForm.avatar
        };
        
        setProfile(updatedProfile);
        
        // Update user in AuthContext to sync with navbar
        updateUser({
          fullName: editForm.fullName
        });
        
        setIsEditing(false);
        console.log('Profile updated successfully'); // Debug log
        
        // Show success message
        alert('Cập nhật thông tin thành công!');
      } else {
        throw new Error(apiResponse.message || 'Update failed');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      let errorMessage = 'Không thể cập nhật thông tin. Vui lòng thử lại.';
      
      if (error.response) {
        console.error('Update error response:', error.response.data);
        
        if (error.response.status === 403) {
          errorMessage = 'Bạn không có quyền cập nhật thông tin này.';
        } else if (error.response.status === 401) {
          errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      alert(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const getRoleColor = (role: number) => {
    switch (role) {
      case 0: return 'bg-red-100 text-red-800';
      case 1: return 'bg-blue-100 text-blue-800';
      case 2: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: number) => {
    switch (role) {
      case 0: return <Shield className="h-4 w-4" />;
      case 1: return <BookOpen className="h-4 w-4" />;
      case 2: return <User className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleDisplayName = (role: number) => {
    switch (role) {
      case 0 : return 'Quản trị viên';
      case 1 : return 'Giáo viên';
      case 2 : return 'Học sinh';
      default: return `Role ${role}`;
    }
  };

  const renderStatsCards = () => {
    if (!state.user?.role) return null;

    const role = state.user.role;
    
    if (role === 'TEACHER') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Khóa học</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.coursesCount || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Bài thi</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.examsCount || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Học sinh</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.studentsCount || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Bài học</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.lessonsCount || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (role === 'STUDENT') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Khóa học đã đăng ký</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.enrolledCoursesCount || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Bài thi đã hoàn thành</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.completedExamsCount || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tiến độ học tập</dt>
                  <dd className="text-lg font-medium text-gray-900">75%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (role === 'ADMIN') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tổng người dùng</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalUsers || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tổng khóa học</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalCourses || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tổng bài thi</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalExams || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Không thể tải thông tin profile</h2>
          <p className="text-gray-500">Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-8">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.fullName} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700">
                    <Camera className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                {!isEditing ? (
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{profile.fullName}</h1>
                    <p className="text-gray-600 flex items-center mt-1">
                      <Mail className="h-4 w-4 mr-2" />
                      {profile.email}
                      {profile.active && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Tài khoản hoạt động
                        </span>
                      )}
                    </p>
                    {profile.phone && (
                      <p className="text-gray-600 flex items-center mt-1">
                        <Phone className="h-4 w-4 mr-2" />
                        {profile.phone}
                      </p>
                    )}
                    <div className="flex items-center mt-2 space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(profile.role)}`}>
                        {getRoleIcon(profile.role)}
                        <span className="ml-1">{getRoleDisplayName(profile.role)}</span>
                      </span>
                      <span className="text-gray-500 text-sm flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {profile.createdAt ? 
                          `Tham gia ${new Date(profile.createdAt).toLocaleDateString('vi-VN')}` : 
                          'Ngày tham gia: Không rõ'
                        }
                      </span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                      <input
                        type="text"
                        required
                        value={editForm.fullName}
                        onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">URL Avatar</label>
                      <input
                        type="url"
                        value={editForm.avatar}
                        onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={updating}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {updating ? 'Đang lưu...' : 'Lưu thay đổi'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Hủy
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Role-specific Stats */}
        {renderStatsCards()}

        {/* Additional Profile Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Account Security */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Bảo mật tài khoản</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Trạng thái tài khoản</p>
                  <p className="text-sm text-gray-500">Tài khoản của bạn có đang hoạt động</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  profile.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {profile.active ? 'Hoạt động' : 'Bị khóa'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Đổi mật khẩu</p>
                  <p className="text-sm text-gray-500">Cập nhật mật khẩu của bạn</p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Thay đổi
                </button>
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Hoạt động gần đây</h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">Đăng nhập vào hệ thống</p>
                    <p className="text-sm text-gray-500">2 giờ trước</p>
                  </div>
                </div>
                
                {state.user?.role === 'TEACHER' && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">Tạo khóa học mới</p>
                      <p className="text-sm text-gray-500">1 ngày trước</p>
                    </div>
                  </div>
                )}
                
                {state.user?.role === 'STUDENT' && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Award className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">Hoàn thành bài thi</p>
                      <p className="text-sm text-gray-500">3 ngày trước</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;