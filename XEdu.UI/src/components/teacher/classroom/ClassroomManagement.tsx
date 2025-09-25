import { BookOpen, Eye, Mail, Plus, Trash2, UserPlus, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../../../constants/api';
import { apiService } from '../../../services/api';
import ContentDistribution from '../ContentDistribution';
interface Classroom {
  id: number;
  name: string;
  description: string;
  classCode: string;
  teacherName: string;
  subject: Subject;
  grade: Grade;
  maxStudents: number;
  currentStudentCount: number;
  active: boolean;
  createdAt: string;
}

interface Subject {
  id: number;
  name: string;
  icon: string;
  description: string;
}

interface Grade {
  id: number;
  name: string;
}

interface ClassroomStudent {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  role: string;
  joinedAt: string;
}

const ClassroomManagement: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [classroomStudents, setClassroomStudents] = useState<ClassroomStudent[]>([]);
  const [newStudentEmail, setNewStudentEmail] = useState('');

  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    subjectId: '',
    gradeId: '',
    maxStudents: '50'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classroomsRes, subjectsRes, gradesRes] = await Promise.all([
        apiService.get<any>(API_ENDPOINTS.CLASSROOMS),
        apiService.get<any>(API_ENDPOINTS.SUBJECTS),
        apiService.get<any>(API_ENDPOINTS.GRADES)
      ]);     // Debug log

      setClassrooms(classroomsRes.response.content || []);
      setSubjects(subjectsRes.response || []);
      setGrades(gradesRes.response || []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClassroom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: createForm.name,
        description: createForm.description,
        subjectId: createForm.subjectId ? parseInt(createForm.subjectId) : null,
        gradeId: createForm.gradeId ? parseInt(createForm.gradeId) : null,
        maxStudents: parseInt(createForm.maxStudents)
      };

      await apiService.post(API_ENDPOINTS.CREATECLASSROOM, payload);
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        description: '',
        subjectId: '',
        gradeId: '',
        maxStudents: '50'
      });
      fetchData();
    } catch (error) {
      console.error('Error creating classroom:', error);
      alert('Không thể tạo lớp học. Vui lòng thử lại.');
    }
  };

  const handleViewStudents = async (classroom: Classroom) => {
    try {
      setSelectedClassroom(classroom);
      const classId = classroom.id;
      const response = await apiService.get<any>(API_ENDPOINTS.STUDENTS_IN_CLASS(classId));
      setClassroomStudents(response.response || []);
      setShowStudentsModal(true);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Không thể tải danh sách học sinh.');
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassroom || !newStudentEmail.trim()) return;

    try {
      await apiService.post(API_ENDPOINTS.ADD_STUDENT, {
        classid: selectedClassroom.id,
        studentEmail: newStudentEmail.trim()
      });
      
      setNewStudentEmail('');
      handleViewStudents(selectedClassroom);
      fetchData();
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Không thể thêm học sinh. Vui lòng kiểm tra email và thử lại.');
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    if (!selectedClassroom || !window.confirm('Bạn có chắc muốn xóa học sinh này khỏi lớp?')) return;

    try {
      await apiService.delete(API_ENDPOINTS.REMOVE_STUDENT(selectedClassroom.id, studentId));
      handleViewStudents(selectedClassroom);
      fetchData();
    } catch (error) {
      console.error('Error removing student:', error);
      alert('Không thể xóa học sinh khỏi lớp.');
    }
  };

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
        <h3 className="text-lg font-medium text-gray-900">Quản lý lớp học</h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tạo lớp học
        </button>
      </div>

      {/* Classrooms Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên lớp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã lớp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Môn học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khối
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Học sinh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {classrooms.map((classroom) => (
                <tr key={classroom.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{classroom.name}</div>
                      <div className="text-sm text-gray-500">{classroom.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-mono bg-gray-100 rounded">
                      {classroom.classCode}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {classroom.subject?.name || '--'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {classroom.grade?.id || '--'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-400" />
                      {classroom.currentStudentCount}/{classroom.maxStudents}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewStudents(classroom)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Xem học sinh"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleViewStudents(classroom)}
                        className="text-green-600 hover:text-green-900"
                        title="Thêm học sinh"
                      >
                        <UserPlus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedClassroom(classroom);
                          setShowContentModal(true);
                        }}
                        className="text-purple-600 hover:text-purple-900"
                        title="Phân phối nội dung"
                      >
                        <BookOpen className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900" title="Xóa lớp">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {classrooms.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có lớp học nào</h3>
            <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách tạo lớp học đầu tiên.</p>
          </div>
        )}
      </div>

      {/* Create Classroom Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Tạo lớp học mới</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleCreateClassroom} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên lớp học <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Ví dụ: Toán 12A1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    rows={3}
                    placeholder="Mô tả về lớp học..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Môn học</label>
                    <select
                      value={createForm.subjectId}
                      onChange={(e) => setCreateForm({ ...createForm, subjectId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="">Chọn môn học</option>
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Khối</label>
                    <select
                      value={createForm.gradeId}
                      onChange={(e) => setCreateForm({ ...createForm, gradeId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="">Chọn khối</option>
                      {grades.map((grade) => (
                        <option key={grade.id} value={grade.id}>{grade.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số học sinh tối đa</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={createForm.maxStudents}
                    onChange={(e) => setCreateForm({ ...createForm, maxStudents: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="50"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all shadow-sm hover:shadow-md"
                  >
                    Tạo lớp học
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Students Management Modal */}
      {showStudentsModal && selectedClassroom && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Quản lý học sinh - {selectedClassroom.name}
                </h3>
                <button
                  onClick={() => setShowStudentsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Add Student Form */}
              <form onSubmit={handleAddStudent} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <input
                      type="email"
                      required
                      value={newStudentEmail}
                      onChange={(e) => setNewStudentEmail(e.target.value)}
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Email học sinh..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Thêm học sinh
                  </button>
                </div>
              </form>

              {/* Students Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Học sinh
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày tham gia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {classroomStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{student.studentName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            {student.studentEmail}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(student.joinedAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleRemoveStudent(student.studentId)}
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

              {classroomStudents.length === 0 && (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có học sinh nào</h3>
                  <p className="mt-1 text-sm text-gray-500">Thêm học sinh bằng email ở trên.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Distribution Modal */}
      {showContentModal && selectedClassroom && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-4/5 max-w-6xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Phân phối nội dung - {selectedClassroom.name}
                </h3>
                <button
                  onClick={() => setShowContentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <ContentDistribution 
                classroomId={selectedClassroom.id}
                classroomName={selectedClassroom.name}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassroomManagement;