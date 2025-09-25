import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, FileText, Calendar, Clock, Trash2, CheckCircle } from 'lucide-react';
import { apiService } from '../../services/api';

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  subjectName: string;
  gradeName: string;
}

interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  subjectName: string;
  gradeName: string;
}

interface ClassroomCourse {
  id: number;
  courseId: number;
  courseTitle: string;
  courseThumbnail: string;
  assignedAt: string;
  dueDate?: string;
  active: boolean;
}

interface ClassroomExam {
  id: number;
  examId: number;
  examTitle: string;
  examDuration: number;
  totalQuestions: number;
  assignedAt: string;
  dueDate?: string;
  active: boolean;
  allowRetake: boolean;
  maxAttempts: number;
}

interface ContentDistributionProps {
  classroomId: number;
  classroomName: string;
}

const ContentDistribution: React.FC<ContentDistributionProps> = ({ classroomId, classroomName }) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'exams'>('courses');
  const [assignedCourses, setAssignedCourses] = useState<ClassroomCourse[]>([]);
  const [assignedExams, setAssignedExams] = useState<ClassroomExam[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [assignForm, setAssignForm] = useState({
    contentId: '',
    dueDate: '',
    allowRetake: false,
    maxAttempts: 1
  });

  useEffect(() => {
    fetchData();
  }, [classroomId, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'courses') {
        const [assigned, available] = await Promise.all([
          apiService.get<ClassroomCourse[]>(`/teacher/classrooms/${classroomId}/courses`),
          apiService.get<Course[]>(`/teacher/classrooms/${classroomId}/available-courses`)
        ]);
        setAssignedCourses(assigned || []);
        setAvailableCourses(available || []);
      } else {
        const [assigned, available] = await Promise.all([
          apiService.get<ClassroomExam[]>(`/teacher/classrooms/${classroomId}/exams`),
          apiService.get<Exam[]>(`/teacher/classrooms/${classroomId}/available-exams`)
        ]);
        setAssignedExams(assigned || []);
        setAvailableExams(available || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignForm.contentId) return;

    try {
      const endpoint = activeTab === 'courses' 
        ? `/teacher/classrooms/${classroomId}/courses`
        : `/teacher/classrooms/${classroomId}/exams`;

      const payload = activeTab === 'courses' 
        ? {
            courseId: parseInt(assignForm.contentId),
            dueDate: assignForm.dueDate || null
          }
        : {
            examId: parseInt(assignForm.contentId),
            dueDate: assignForm.dueDate || null,
            allowRetake: assignForm.allowRetake,
            maxAttempts: assignForm.maxAttempts
          };

      await apiService.post(endpoint, payload);
      
      setShowAssignModal(false);
      setAssignForm({
        contentId: '',
        dueDate: '',
        allowRetake: false,
        maxAttempts: 1
      });
      fetchData();
    } catch (error) {
      console.error('Error assigning content:', error);
      alert('Không thể phân phối nội dung. Vui lòng thử lại.');
    }
  };

  const handleRemoveContent = async (contentId: number) => {
    if (!window.confirm(`Bạn có chắc muốn xóa ${activeTab === 'courses' ? 'khóa học' : 'bài thi'} này khỏi lớp?`)) return;

    try {
      const endpoint = activeTab === 'courses'
        ? `/teacher/classrooms/${classroomId}/courses/${contentId}`
        : `/teacher/classrooms/${classroomId}/exams/${contentId}`;

      await apiService.delete(endpoint);
      fetchData();
    } catch (error) {
      console.error('Error removing content:', error);
      alert('Không thể xóa nội dung khỏi lớp.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const AssignModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Phân phối {activeTab === 'courses' ? 'khóa học' : 'bài thi'}
          </h3>
          <form onSubmit={handleAssignContent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Chọn {activeTab === 'courses' ? 'khóa học' : 'bài thi'} *
              </label>
              <select
                required
                value={assignForm.contentId}
                onChange={(e) => setAssignForm({ ...assignForm, contentId: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Chọn...</option>
                {(activeTab === 'courses' ? availableCourses : availableExams).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} {item.subjectName && `- ${item.subjectName}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Hạn chót (tuỳ chọn)</label>
              <input
                type="datetime-local"
                value={assignForm.dueDate}
                onChange={(e) => setAssignForm({ ...assignForm, dueDate: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {activeTab === 'exams' && (
              <>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={assignForm.allowRetake}
                      onChange={(e) => setAssignForm({ ...assignForm, allowRetake: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">Cho phép thi lại</span>
                  </label>
                </div>

                {assignForm.allowRetake && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số lần thi tối đa</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={assignForm.maxAttempts}
                      onChange={(e) => setAssignForm({ ...assignForm, maxAttempts: parseInt(e.target.value) || 1 })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Phân phối
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Phân phối nội dung</h3>
          <p className="text-sm text-gray-500">Lớp: {classroomName}</p>
        </div>
        <button
          onClick={() => setShowAssignModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          disabled={(activeTab === 'courses' ? availableCourses : availableExams).length === 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          Phân phối {activeTab === 'courses' ? 'khóa học' : 'bài thi'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('courses')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'courses'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BookOpen className="h-4 w-4 inline mr-2" />
            Khóa học ({assignedCourses.length})
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'exams'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            Bài thi ({assignedExams.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {activeTab === 'courses' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khóa học
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày phân phối
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hạn chót
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
                {assignedCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          className="h-10 w-10 rounded object-cover" 
                          src={course.courseThumbnail || 'https://placehold.co/40x40/0ea5e9/ffffff?text=Course'} 
                          alt="" 
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{course.courseTitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(course.assignedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.dueDate ? (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {formatDate(course.dueDate)}
                        </div>
                      ) : (
                        '--'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        course.active 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {course.active ? 'Hoạt động' : 'Tạm dừng'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleRemoveContent(course.courseId)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa khỏi lớp"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bài thi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày phân phối
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hạn chót
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cài đặt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignedExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{exam.examTitle}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {exam.examDuration} phút • {exam.totalQuestions} câu
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(exam.assignedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {exam.dueDate ? (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {formatDate(exam.dueDate)}
                        </div>
                      ) : (
                        '--'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        {exam.allowRetake && (
                          <div className="flex items-center text-xs text-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Thi lại: {exam.maxAttempts} lần
                          </div>
                        )}
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          exam.active 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {exam.active ? 'Hoạt động' : 'Tạm dừng'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleRemoveContent(exam.examId)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa khỏi lớp"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {((activeTab === 'courses' && assignedCourses.length === 0) || 
          (activeTab === 'exams' && assignedExams.length === 0)) && (
          <div className="text-center py-12">
            {activeTab === 'courses' ? (
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            ) : (
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
            )}
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Chưa có {activeTab === 'courses' ? 'khóa học' : 'bài thi'} nào
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Phân phối {activeTab === 'courses' ? 'khóa học' : 'bài thi'} cho lớp học.
            </p>
          </div>
        )}
      </div>

      {/* Assign Modal */}
      {showAssignModal && <AssignModal />}
    </div>
  );
};

export default ContentDistribution;