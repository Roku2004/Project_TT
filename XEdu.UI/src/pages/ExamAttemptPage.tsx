import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { API_ENDPOINTS } from '../constants/api';

interface Answer {
  answerId: number;
  answerText: string;
  orderIndex: number;
}

interface Question {
  questionId: number;
  questionType: string;
  points: number;
  questionText: string;
  answers: Answer[];
  questionCount: number;
}

const ExamAttemptPage: React.FC = () => {
  const { studentExamId } = useParams<{ studentExamId: string }>();
  const navigate = useNavigate();
  
  const [questionList, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  useEffect(() => {
    if (studentExamId) {
      fetchQuestions();
      getExamDescription();
    }
  }, [studentExamId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await apiService.get<any>(API_ENDPOINTS.EXAM_QUESTIONS(Number(studentExamId)));
      
      if (data.success && data.response) {
        const question = data.response;

        setQuestions(question.map((q: any) => ({
          questionId: q.questionId,
          questionType: q.questionType,
          points: q.points,
          questionText: q.questionText,
          answers: q.answers.sort((a: any, b: any) => a.orderIndex - b.orderIndex),
          questionCount: q.questionCount
        })));
        
        setSelectedAnswers(Array(questionList.length).fill(null));
      }
    } catch (err: any) {
      setError('Không thể tải bài thi');
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getExamDescription = async () => {
    try {
      const data = await apiService.get<any>(API_ENDPOINTS.EXAM_DETAILS(Number(studentExamId)));
      const description = data.response;
      console.log(description);
      setDescription(description);
    } catch (err) {
      console.error('Error fetching exam details:', err);
      return null;
    }
  }

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải bài thi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/exams')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Quay về danh sách bài thi
          </button>
        </div>
      </div>
    );
  }

  if (questionList.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy câu hỏi nào</p>
          <button 
            onClick={() => navigate('/exams')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Quay về danh sách bài thi
          </button>
        </div>
      </div>
    );
  }

  const answeredCount = selectedAnswers.filter((answer) => answer !== null).length;
  const progress = (answeredCount / questionList.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-blue-600">{description}</h1>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Đã trả lời: {answeredCount} / {questionList.length} câu</span>
                <span>{Math.round(progress)}% hoàn thành</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {questionList.map((question, questionIndex) => (
              <div key={questionIndex} className="space-y-4 p-6 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold">
                  <span className="text-blue-600 mr-2">Câu {questionIndex + 1}:</span>
                  {question.questionText}
                </div>

                <div className="grid gap-3">
                  {question.answers.map((answer, optionIndex) => (
                    <button
                      key={optionIndex}
                      className={`w-full text-left p-4 rounded-md border transition-colors ${
                        selectedAnswers[questionIndex] === optionIndex
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                      }`}
                      onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
                    >
                      <span className="font-semibold mr-3">{String.fromCharCode(65 + optionIndex)}.</span>
                      {answer.answerText}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-center pt-6">
              <button
                onClick={() => {
                  console.log('Selected answers:', selectedAnswers);
                  alert(`Đã chọn ${answeredCount}/${questionList.length} câu trả lời!`);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors"
              >
                Xem kết quả đã chọn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamAttemptPage;
