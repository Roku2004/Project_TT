import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Download,
  FileText
} from "lucide-react";
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_ENDPOINTS } from '../constants/api';
import { apiService } from '../services/api';

interface CourseProgress {
  courseName: string;
  lessonCompleted: number;
  totalLessons: number;
  progress: number;
  courseDescription: string;
}

interface Lesson {
  id: number;
  attachmentUrl: string | null;
  content: string;
  description: string;
  externalLink: string | null;
  title: string;
  videoUrl: string | null;
  type: 'VIDEO' | 'DOCUMENT' | 'LINK';
  completed?: boolean;
  nextLesson?: { id: number; title: string };
  prevLesson?: { id: number; title: string };
  chapterId: number;
}

interface LessonDetailProps {
  courseProgress: CourseProgress;
  currentLesson: Lesson;
  fetchLessons: (chapterId: number) => void;
  onLessonChange: (lessonId: number) => void;
};

const LessonDetail: React.FC<LessonDetailProps> = ({ courseProgress: course, currentLesson: lesson, fetchLessons, onLessonChange }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const handleMarkComplete = async () => {
    const formComplete = {
      courseId: Number(courseId),
      lessonsCompleted: 1,
      totalLessons: course.totalLessons,
      lessonId: lesson.id
    };
    try {
      await apiService.put(API_ENDPOINTS.MARK_LESSON_COMPLETE, formComplete);
      alert("Bài học đã được đánh dấu hoàn thành");
      fetchLessons(lesson.chapterId);
    } catch (error) {
      console.error('Error marking lesson as complete:', error);
      console.log("formdata", formComplete);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {/* <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-6 border-l border-gray-200" />
              <div>
                <h1 className="font-semibold">{lesson.title}</h1>
                <p className="text-sm text-gray-500">{lesson.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {lesson.completed && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Đã hoàn thành
                </span>
              )}
            </div>
          </div>
        </div>
      </header> */}

      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Content Based on Type */}
            {lesson.type === 'VIDEO' && lesson.videoUrl && (
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <iframe className="w-full h-full" src={lesson.videoUrl}>
                </iframe>
              </div>
            )}

            {/* Lesson Content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Nội dung bài học</h2>
              </div>

              <div className="space-y-6">
                {/* Description */}
                {lesson.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Mô tả</h3>
                    <div dangerouslySetInnerHTML={{ __html: lesson.description }} />
                  </div>
                )}

                {/* Content */}
                <div>
                  <div className="prose max-w-none">
                    {lesson.content}
                  </div>
                </div>

                {/* Attachment */}
                {lesson.attachmentUrl && (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">Tài liệu đính kèm</span>
                      </div>
                      <a
                        href={lesson.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-gray-100 rounded inline-flex items-center"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                )}

                {/* External Link */}
                {lesson.externalLink && (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">Tài liệu tham khảo</span>
                      </div>
                      <a
                        href={lesson.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Mở liên kết
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            {/* <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Tiến độ</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {courseProgress.progress}%
                    </div>
                    <div className="text-sm text-gray-500">
                      Hoàn thành khóa học
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${courseProgress.progress}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-500 text-center">
                    {courseProgress.completedLessons}/{courseProgress.totalLessons} bài đã hoàn thành
                  </div>
                </div>
              </div>
            </div> */}

            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-6 border-l border-gray-200" />
                  <div>
                    <h1 className="font-semibold">{lesson.title}</h1>
                    <div dangerouslySetInnerHTML={{ __html: lesson.description }} />
                  </div>
                </div>

                {/* <div className="flex items-center gap-2">
                  {lesson.completed == true && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Đã hoàn thành
                    </span>
                  )}
                </div> */}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="space-y-3">
                {!lesson.completed && (
                  <button
                    onClick={handleMarkComplete}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Đánh dấu hoàn thành
                  </button>
                )}
                <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Ghi chú
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;
