import { CheckCircle, Clock, RotateCcw, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer?: number;
}

interface ExamAttempt {
  id: number;
  examId: number;
  examTitle: string;
  duration: number;
  totalQuestions: number;
  startedAt: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';
  questions: Question[];
}

const ExamAttemptTestPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [examAttempt, setExamAttempt] = useState<ExamAttempt | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Load mock data
    loadMockData();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitQuiz(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining, showResults]);

  const loadMockData = () => {
    setTimeout(() => {
      const mockExamAttempt: ExamAttempt = {
        id: 123,
        examId: 1,
        examTitle: "Bài thi Toán học lớp 10 - Chương 1: Hàm số",
        duration: 45,
        totalQuestions: 5,
        startedAt: new Date().toISOString(),
        status: 'IN_PROGRESS',
        questions: [
          {
            id: 1,
            question: "Thủ đô của Việt Nam là gì?",
            options: ["Thành phố Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ"]
          },
          {
            id: 2,
            question: "Ai là tác giả của tác phẩm 'Truyện Kiều'?",
            options: ["Nguyễn Du", "Hồ Xuân Hương", "Nguyễn Trãi", "Lý Thái Tổ"]
          },
          {
            id: 3,
            question: "Việt Nam có bao nhiêu tỉnh thành?",
            options: ["61", "62", "63", "64"]
          },
          {
            id: 4,
            question: "Sông nào dài nhất Việt Nam?",
            options: ["Sông Hồng", "Sông Mê Kông", "Sông Đồng Nai", "Sông Cả"]
          },
          {
            id: 5,
            question: "Ngày Quốc khánh Việt Nam là ngày nào?",
            options: ["30/4", "2/9", "19/5", "20/11"]
          }
        ]
      };

      setExamAttempt(mockExamAttempt);
      setSelectedAnswers(Array(mockExamAttempt.questions.length).fill(null));
      setTimeRemaining(45 * 60); // 45 phút
      setLoading(false);
    }, 1000);
  };

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    if (showResults) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmitQuiz = async (isAutoSubmit: boolean = false) => {
    if (!examAttempt) return;
    
    if (!isAutoSubmit) {
      const allAnswered = selectedAnswers.every((answer) => answer !== null);
      if (!allAnswered) {
        const unanswered = selectedAnswers.filter(a => a === null).length;
        if (!confirm(`Bạn còn ${unanswered} câu chưa trả lời. Bạn có chắc muốn nộp bài?`)) {
          return;
        }
      }
    }

    setSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockResults = {
        ...examAttempt,
        questions: examAttempt.questions.map((q, index) => ({
          ...q,
          correctAnswer: index === 0 ? 1 : index === 1 ? 0 : index === 2 ? 2 : index === 3 ? 1 : 1
        }))
      };
      setExamAttempt(mockResults);
      setShowResults(true);
      setSubmitting(false);
    }, 1500);
  };

  const calculateScore = () => {
    if (!examAttempt) return 0;
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === examAttempt.questions[index].correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetQuiz = () => {
    navigate('/exams');
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

  if (!examAttempt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy bài thi</p>
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
  const progress = (answeredCount / examAttempt.questions.length) * 100;

  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / examAttempt.questions.length) * 100);

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 text-center border-b">
              <h1 className="text-3xl font-bold text-blue-600 mb-4">Kết Quả Bài Thi</h1>
              <h2 className="text-xl text-gray-700">{examAttempt.examTitle}</h2>
            </div>
            <div className="p-6 text-center space-y-6">
              <div className="text-6xl font-bold text-blue-600">
                {score}/{examAttempt.questions.length}
              </div>
              <div className="text-2xl text-gray-600">Điểm số: {percentage}%</div>

              <div className="space-y-4">
                {examAttempt.questions.map((question, index) => (
                  <div key={question.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm text-left flex-1">
                      <strong>Câu {index + 1}:</strong> {question.question}
                    </span>
                    {selectedAnswers[index] === question.correctAnswer ? (
                      <CheckCircle className="h-6 w-6 text-green-600 ml-4" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600 ml-4" />
                    )}
                  </div>
                ))}
              </div>

              <button 
                onClick={resetQuiz}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md flex items-center mx-auto"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Quay về danh sách bài thi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-blue-600">{examAttempt.examTitle}</h1>
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                timeRemaining < 300 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                <Clock className="h-4 w-4 mr-1" />
                {formatTime(timeRemaining)}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Đã trả lời: {answeredCount} / {examAttempt.questions.length} câu</span>
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
            {examAttempt.questions.map((question, questionIndex) => (
              <div key={question.id} className="space-y-4 p-6 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold">
                  <span className="text-blue-600 mr-2">Câu {questionIndex + 1}:</span>
                  {question.question}
                </div>

                <div className="grid gap-3">
                  {question.options.map((option, optionIndex) => (
                    <button
                      key={optionIndex}
                      className={`w-full text-left p-4 rounded-md border transition-colors ${
                        selectedAnswers[questionIndex] === optionIndex
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                      }`}
                      onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
                      disabled={showResults}
                    >
                      <span className="font-semibold mr-3">{String.fromCharCode(65 + optionIndex)}.</span>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-center pt-6">
              <button
                onClick={() => handleSubmitQuiz()}
                disabled={submitting || timeRemaining === 0}
                className={`font-medium py-3 px-8 rounded-md transition-colors ${
                  answeredCount < examAttempt.questions.length
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {submitting ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang nộp bài...
                  </span>
                ) : answeredCount < examAttempt.questions.length ? (
                  `Nộp bài (còn ${examAttempt.questions.length - answeredCount} câu)`
                ) : (
                  "Nộp bài thi"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamAttemptTestPage;
