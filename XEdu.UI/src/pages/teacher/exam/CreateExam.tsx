import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Plus, Trash2, Edit2 } from 'lucide-react';
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

interface Question {
  id?: number;
  questionText: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  points: number;
  imageUrl?: string;
  answers: Answer[];
}

interface Answer {
  id?: number;
  answerText: string;
  isCorrect: boolean;
}

interface ExamFormData {
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  allowRetake: boolean;
  maxAttempts: number;
  subjectId: number;
  gradeId: number;
}

const CreateExam: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    questionText: '',
    type: 'MULTIPLE_CHOICE',
    points: 1,
    answers: [
      { answerText: '', isCorrect: false },
      { answerText: '', isCorrect: false },
      { answerText: '', isCorrect: false },
      { answerText: '', isCorrect: false }
    ]
  });
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  
  const [formData, setFormData] = useState<ExamFormData>({
    title: '',
    description: '',
    duration: 60,
    totalQuestions: 10,
    passingScore: 0.6,
    shuffleQuestions: true,
    shuffleAnswers: true,
    allowRetake: false,
    maxAttempts: 1,
    subjectId: 0,
    gradeId: 0
  });

  useEffect(() => {
    fetchSubjects();
    fetchGrades();
  }, []);

  const fetchSubjects = async () => {
    try {
      const data = await apiService.get<Subject[]>('/public/subjects');
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchGrades = async () => {
    try {
      const data = await apiService.get<Grade[]>('/public/grades');
      setGrades(data);
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

  const handleQuestionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setCurrentQuestion(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleAnswerChange = (index: number, field: 'answerText' | 'isCorrect', value: string | boolean) => {
    setCurrentQuestion(prev => ({
      ...prev,
      answers: prev.answers.map((answer, i) => 
        i === index 
          ? { ...answer, [field]: value }
          : field === 'isCorrect' && currentQuestion.type === 'MULTIPLE_CHOICE' 
            ? { ...answer, isCorrect: false } // Only one correct answer for multiple choice
            : answer
      )
    }));
  };

  const addAnswer = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      answers: [...prev.answers, { answerText: '', isCorrect: false }]
    }));
  };

  const removeAnswer = (index: number) => {
    if (currentQuestion.answers.length > 2) {
      setCurrentQuestion(prev => ({
        ...prev,
        answers: prev.answers.filter((_, i) => i !== index)
      }));
    }
  };

  const saveQuestion = () => {
    if (!currentQuestion.questionText || !currentQuestion.answers.some(a => a.answerText && a.isCorrect)) {
      alert('Vui lòng điền đầy đủ câu hỏi và chọn ít nhất một đáp án đúng');
      return;
    }

    if (editingQuestionIndex !== null) {
      setQuestions(prev => prev.map((q, i) => i === editingQuestionIndex ? currentQuestion : q));
      setEditingQuestionIndex(null);
    } else {
      setQuestions(prev => [...prev, currentQuestion]);
    }

    setCurrentQuestion({
      questionText: '',
      type: 'MULTIPLE_CHOICE',
      points: 1,
      answers: [
        { answerText: '', isCorrect: false },
        { answerText: '', isCorrect: false },
        { answerText: '', isCorrect: false },
        { answerText: '', isCorrect: false }
      ]
    });
    setShowQuestionForm(false);
  };

  const editQuestion = (index: number) => {
    setCurrentQuestion(questions[index]);
    setEditingQuestionIndex(index);
    setShowQuestionForm(true);
  };

  const deleteQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.subjectId || !formData.gradeId) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (!isDraft && questions.length === 0) {
      alert('Vui lòng thêm ít nhất một câu hỏi');
      return;
    }

    setLoading(true);
    try {
      const examData = {
        ...formData,
        status: isDraft ? 'DRAFT' : 'PUBLISHED',
        questions: questions
      };
      
      await apiService.post('/teacher/exams', examData);
      alert(isDraft ? 'Lưu bản nháp thành công!' : 'Tạo bài thi thành công!');
      navigate('/teacher/dashboard');
    } catch (error: any) {
      alert('Có lỗi xảy ra: ' + (error.response?.data?.message || error.message));
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
              <h1 className="text-2xl font-bold text-gray-900">Tạo bài thi mới</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Exam Basic Info */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Thông tin bài thi</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Tên bài thi *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="VD: Kiểm tra giữa kỳ Toán 10"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Mô tả bài thi *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mô tả nội dung và yêu cầu của bài thi..."
                    required
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
              </div>
            </div>

            {/* Questions Section */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Câu hỏi ({questions.length})
                </h2>
                <button
                  type="button"
                  onClick={() => setShowQuestionForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm câu hỏi
                </button>
              </div>

              {/* Question List */}
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-2">
                          Câu {index + 1}: {question.questionText}
                        </h3>
                        <div className="text-sm text-gray-500 mb-2">
                          Loại: {question.type === 'MULTIPLE_CHOICE' ? 'Trắc nghiệm' : 
                                question.type === 'TRUE_FALSE' ? 'Đúng/Sai' : 'Tự luận'} • 
                          Điểm: {question.points}
                        </div>
                        <div className="space-y-1">
                          {question.answers.map((answer, aIndex) => (
                            <div key={aIndex} className={`text-sm ${answer.isCorrect ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                              {answer.isCorrect ? '✓' : '○'} {answer.answerText}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          type="button"
                          onClick={() => editQuestion(index)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteQuestion(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Question Form Modal */}
              {showQuestionForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-full overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">
                        {editingQuestionIndex !== null ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}
                      </h3>
                      <button
                        onClick={() => {
                          setShowQuestionForm(false);
                          setEditingQuestionIndex(null);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Nội dung câu hỏi *
                        </label>
                        <textarea
                          name="questionText"
                          value={currentQuestion.questionText}
                          onChange={handleQuestionInputChange}
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập nội dung câu hỏi..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Loại câu hỏi
                          </label>
                          <select
                            name="type"
                            value={currentQuestion.type}
                            onChange={handleQuestionInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="MULTIPLE_CHOICE">Trắc nghiệm</option>
                            <option value="TRUE_FALSE">Đúng/Sai</option>
                            <option value="SHORT_ANSWER">Tự luận ngắn</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Điểm
                          </label>
                          <input
                            type="number"
                            name="points"
                            value={currentQuestion.points}
                            onChange={handleQuestionInputChange}
                            min="1"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center">
                          <label className="block text-sm font-medium text-gray-700">
                            Đáp án
                          </label>
                          {currentQuestion.type === 'MULTIPLE_CHOICE' && (
                            <button
                              type="button"
                              onClick={addAnswer}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Thêm đáp án
                            </button>
                          )}
                        </div>
                        
                        <div className="space-y-2 mt-2">
                          {currentQuestion.answers.map((answer, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type={currentQuestion.type === 'MULTIPLE_CHOICE' ? 'radio' : 'checkbox'}
                                name="correct"
                                checked={answer.isCorrect}
                                onChange={(e) => handleAnswerChange(index, 'isCorrect', e.target.checked)}
                                className="h-4 w-4 text-blue-600"
                              />
                              <input
                                type="text"
                                value={answer.answerText}
                                onChange={(e) => handleAnswerChange(index, 'answerText', e.target.value)}
                                className="flex-1 border border-gray-300 rounded-md py-1 px-2 text-sm"
                                placeholder={`Đáp án ${index + 1}`}
                              />
                              {currentQuestion.answers.length > 2 && currentQuestion.type === 'MULTIPLE_CHOICE' && (
                                <button
                                  type="button"
                                  onClick={() => removeAnswer(index)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowQuestionForm(false);
                            setEditingQuestionIndex(null);
                          }}
                          className="bg-gray-200 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-300"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={saveQuestion}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                          Lưu câu hỏi
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Exam Settings */}
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Cài đặt bài thi</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                    Thời gian (phút)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="1"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="passingScore" className="block text-sm font-medium text-gray-700">
                    Điểm đạt (%)
                  </label>
                  <input
                    type="number"
                    id="passingScore"
                    name="passingScore"
                    value={formData.passingScore * 100}
                    onChange={(e) => setFormData(prev => ({...prev, passingScore: Number(e.target.value) / 100}))}
                    min="0"
                    max="100"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="shuffleQuestions"
                      name="shuffleQuestions"
                      checked={formData.shuffleQuestions}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="shuffleQuestions" className="ml-2 block text-sm text-gray-900">
                      Trộn câu hỏi
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="shuffleAnswers"
                      name="shuffleAnswers"
                      checked={formData.shuffleAnswers}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="shuffleAnswers" className="ml-2 block text-sm text-gray-900">
                      Trộn đáp án
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allowRetake"
                      name="allowRetake"
                      checked={formData.allowRetake}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="allowRetake" className="ml-2 block text-sm text-gray-900">
                      Cho phép làm lại
                    </label>
                  </div>
                </div>

                {formData.allowRetake && (
                  <div>
                    <label htmlFor="maxAttempts" className="block text-sm font-medium text-gray-700">
                      Số lần làm tối đa
                    </label>
                    <input
                      type="number"
                      id="maxAttempts"
                      name="maxAttempts"
                      value={formData.maxAttempts}
                      onChange={handleInputChange}
                      min="1"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={loading}
                  className="w-full bg-gray-200 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center justify-center disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Lưu bản nháp
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e, false)}
                  disabled={loading}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center disabled:opacity-50"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Xuất bản bài thi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateExam;