import { AlertCircle, Award, Clock, FileText, Filter, Play, Search, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';
import { useAuthErrorContext } from '../contexts/AuthErrorContext';
import { apiService } from '../services/api';
import { User } from '../types';
import { handleAuthError } from '../utils/authUtils';
import { Link, Navigate, Router, useNavigate } from 'react-router-dom';

interface Exam {
  id: number;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  subjectName: string;
  gradeName: string;
  fullName: string;
  status: string;
  createdAt: string;
}

interface StudentExam {
  id: number;
  status: string;
  score?: number;
  completedAt?: string;
  attemptNumber: number;
}

interface Subject {
  id: number;
  name: string;
}

interface Grade {
  id: number;
  name: string;
}

const ExamsPage: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [studentExams, setStudentExams] = useState<Record<number, StudentExam[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showAuthModal } = useAuthErrorContext();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  
  const navigate = useNavigate();
  useEffect(() => {
    fetchExams();
    fetchSubjects();
    fetchGrades();
    //fetchStudentExams();
  }, []);

  // Auto filter when dropdown values change
  useEffect(() => {
    if (selectedSubject !== '' || selectedGrade !== '') {
      fetchExams(0, searchTerm, selectedSubject, selectedGrade);
    }
  }, [selectedSubject, selectedGrade]);

  const fetchExams = async (page = 0, search = '', subjectId = '', gradeId = '') => {
    try {
      setLoading(true);
      
      const params: any = {
        page: page.toString(),
        size: '12'
      };
      
      if (search) params.search = search;
      if (subjectId) params.subjectId = subjectId;
      if (gradeId)  params.gradeId = gradeId;
         

      console.log('fetchExams params:', params); // Debug log
      console.log('API endpoint:', API_ENDPOINTS.EXAMS); // Debug log

      const data = await apiService.get<any>(API_ENDPOINTS.EXAMS, params);
      console.log('fetchExams response:', data); // Debug log
      console.log('Response content:', data.response?.content); // Debug log
      
      if (data.response?.content) {
        setExams(data.response.content);
        setTotalPages(data.response.totalPages || 0);
        setCurrentPage(data.response.page || 0);
      } else {
        console.warn('No content in response, setting empty exams');
        setExams([]);
        setTotalPages(0);
        setCurrentPage(0);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Bạn cần đăng nhập để xem danh sách bài thi');
      } else {
        setError('Không thể tải danh sách bài thi');
      }
      console.error('Lỗi khi tải exams:', err);
      console.error('Error response:', err.response?.data); // Debug log
      console.error('Error status:', err.response?.status); // Debug log
    } finally {
      setLoading(false);
    }
  };

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

  // const fetchStudentExams = async () => {
  //   try {
  //     const token = localStorage.getItem('accessToken');
  //     if (!token) return;
      
  //     const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EXAM_QUESTIONS}`, {
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       // Group student exams by exam ID
  //       const grouped = data.reduce((acc: Record<number, StudentExam[]>, attempt: StudentExam & {examId: number}) => {
  //         if (!acc[attempt.examId]) acc[attempt.examId] = [];
  //         acc[attempt.examId].push(attempt);
  //         return acc;
  //       }, {});
  //       setStudentExams(grouped);
  //     }
  //   } catch (err) {
  //     console.error('Lỗi khi tải lịch sử thi:', err);
  //   }
  // };

  const handleStartExam = async (examId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        showAuthModal('Bạn cần đăng nhập để tham gia bài thi này');
        return;
      }
      
      const formData = new FormData();
      formData.append('examId', examId.toString());
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.EXAM_START}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });
      
      console.log('Response status:', response.status); // Debug log
      
      if (response.ok) {
        const data = await response.json();
        console.log('Start exam response:', data); // Debug log
        
        const studentExamId = data?.response?.id || data?.id;
        alert(`Bắt đầu bài thi! ID attempt: ${studentExamId}`);
        navigate(`/exam-attempt/${studentExamId}`);
        //fetchStudentExams();
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        setError(errorData.message || 'Không thể bắt đầu bài thi');
      }
    } catch (err: any) {
      if (handleAuthError(err, showAuthModal, 'exam')) {
        return;
      }
      
      // Hiển thị chi tiết lỗi validation nếu có
      const errorData = err?.response?.data;
      let errorMsg = 'Có lỗi xảy ra khi bắt đầu bài thi';
      
      if (errorData?.errors) {
        // ASP.NET validation errors format
        const validationErrors = Object.values(errorData.errors).flat().join(', ');
        errorMsg = `Lỗi validation: ${validationErrors}`;
      } else if (errorData?.title) {
        errorMsg = errorData.title;
      } else if (errorData?.message) {
        errorMsg = errorData.message;
      }
      
      setError(errorMsg);
      console.error('Lỗi khi start exam:', err);
      console.error('Chi tiết lỗi:', errorData);
    }
  };

  const handleSearch = () => {
    setCurrentPage(0);
    fetchExams(0, searchTerm, selectedSubject, selectedGrade);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSubject('');
    setSelectedGrade('');
    setCurrentPage(0);
    fetchExams(0, '', '', '');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchExams(page, searchTerm, selectedSubject, selectedGrade);
  };

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours} giờ ${mins} phút` : `${hours} giờ`;
    }
    return `${minutes} phút`;
  };

  const getExamStatusBadge = (exam: Exam, attempts: StudentExam[] = []) => {
    const latestAttempt = attempts.sort((a, b) => b.attemptNumber - a.attemptNumber)[0];
    
    if (!latestAttempt) {
      return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Chưa làm</span>;
    }

    switch (latestAttempt.status) {
      case 'COMPLETED':
        const passed = latestAttempt.score && latestAttempt.score >= exam.passingScore;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            passed 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {passed ? 'Đã qua' : 'Chưa đạt'} ({latestAttempt.score}%)
          </span>
        );
      case 'IN_PROGRESS':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Đang làm</span>;
      case 'EXPIRED':
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">Hết thời gian</span>;
      default:
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Chưa làm</span>;
    }
  };

  const canTakeExam = (exam: Exam, attempts: StudentExam[] = []) => {
    if (exam.status !== 'PUBLISHED') return false;
    
    const inProgress = attempts.some(a => a.status === 'IN_PROGRESS');
    
    if (inProgress) return false;
    // For now, allow unlimited retakes until we add maxAttempts to the exam response
    // if (exam.maxAttempts && completedAttempts >= exam.maxAttempts) return false;
    
    return true;
  };

  // NOTE: filtering handled server-side in fetchExams, no client-side filtering needed

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Đang tải danh sách bài thi...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Bài thi trực tuyến</h1>
          <p className="text-lg text-gray-600">
            Tham gia các bài thi để kiểm tra kiến thức
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

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
                placeholder="Tìm kiếm bài thi..."
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

        {/* Exams Grid */}
        {exams.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Không có bài thi nào</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedSubject || selectedGrade ? 'Không có bài thi nào phù hợp với bộ lọc.' : 'Hiện chưa có bài thi nào được công bố.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => {
              const attempts = studentExams[exam.id] || [];
              return (
                <div key={exam.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {exam.title}
                      </h3>
                      {getExamStatusBadge(exam, attempts)}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {exam.description}
                    </p>

                    <div className="space-y-2 mb-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        <span>{exam.subjectName} - {exam.gradeName}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Giáo viên: {exam.fullName}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{formatDuration(exam.duration)}</span>
                      </div>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-2" />
                        <span>{exam.totalQuestions} câu hỏi • Điểm qua: {Math.round(exam.passingScore * 100)}%</span>
                      </div>
                    </div>

                    {attempts.length > 0 && (
                      <div className="mb-4 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        Số lần làm: {attempts.filter(a => a.status === 'COMPLETED').length}
                      </div>
                    )}

                    <button
                      onClick={() => handleStartExam(exam.id)}
                      disabled={!canTakeExam(exam, attempts)}
                      className={`w-full flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors ${
                        canTakeExam(exam, attempts)
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {attempts.some(a => a.status === 'IN_PROGRESS') 
                        ? 'Tiếp tục làm bài'
                        : attempts.filter(a => a.status === 'COMPLETED').length > 0
                        ? 'Làm lại'
                        : 'Bắt đầu thi'
                      }
                    </button>
                  </div>
                </div>
              );
            })}
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
    </div>
  );
};

export default ExamsPage;