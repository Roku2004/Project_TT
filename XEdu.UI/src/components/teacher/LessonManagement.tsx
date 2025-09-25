import { Edit, Eye, FileText, Plus, Trash2, Video, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../../constants/api';
import CreateChapter from '../../pages/teacher/chapter/CreateChapter';
import UpdateChapter from '../../pages/teacher/chapter/UpdateChapter';
import { apiService } from '../../services/api';
import CreateLesson from './lesson/CreateLesson';

interface Lesson {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  type: 0 | 1;
  videoUrl?: string;
  content?: string;
  attachmentUrl?: string;
  externalLink?: string;
  duration: number;
  isFree: boolean;
  published: boolean;
  createdAt: string;
  chapterId?: number;
}

interface Chapter {
  id: number;
  chaptername: string;
  status: 0 | 1 | 2; // 0 = DRAFT, 1 = PUBLIC, 2 = PRIVATE
  orderindex: number;
  duration: number;
  type: 'TOPIC';
  countLessons: number;
}

interface LessonManagementProps {
  courseId: number;
  courseName: string;
}

const LessonManagement: React.FC<LessonManagementProps> = ({ courseId, courseName }) => {
  const [lessons, setLessons] = useState<Record<number, Lesson[]>>({});
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showCreateChapterModal, setShowCreateChapterModal] = useState(false);
  const [showUpdateChapterModal, setShowUpdateChapterModal] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchChapter(courseId);
    setExpandedChapters(new Set());
  }, [courseId]);

  useEffect(() => {
    if (chapters.length > 0) {
      expandedChapters.forEach(chapterId => {
        if (!lessons[chapterId]) {
          fetchLessons(chapterId);
        }
      });
    }
  }, [chapters]); 

  const fetchLessons = async (chapterId: number) => {
    if (!chapterId) return;

    try {
      const response = await apiService.get<any>(API_ENDPOINTS.GET_LESSONS(chapterId));
      const lessonData = response?.response || [];

      setLessons(prev => ({
        ...prev,
        [chapterId]: lessonData
      }));
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  const refreshLessons = (chapterIds: number[]) => {
    chapterIds.forEach(chapterId => {
      fetchLessons(chapterId);
    });
  };
  const fetchChapter = async (courseId: number) => {
    try {
      setLoading(true);
      const data = await apiService.get<any>(API_ENDPOINTS.GET_CHAPTERS(courseId));
      const response = data.response;
      setChapters(response || []);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    } finally {
      setLoading(false);
    }
  }

  const openEditModal = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setShowEditModal(true);
  };

  const openEditChapterModal = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setShowUpdateChapterModal(true);
  };

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(chapterId)) {
        newExpanded.delete(chapterId);
      } else {
        newExpanded.add(chapterId);
        if (!lessons[chapterId]) {
          fetchLessons(chapterId);
        }
      }
      return newExpanded;
    });
  };

  const getLessonsForChapter = (chapterId: number) => {
    return lessons[chapterId] || [];
  };

  const handleDeleteLesson = async (lessonId: number, chapterId: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài học này?')) return;

    try {
      await apiService.delete(API_ENDPOINTS.DELETE_LESSON(lessonId));
      // Refresh chapters and lessons after deletion
      fetchChapter(courseId);
      refreshLessons([chapterId]);
      setSuccessMessage('Xóa bài học thành công!');
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert('Không thể xóa bài học.');
    }
  };

  const convertDurationToString = (duration: number) => {
    if (duration < 60) {
      return `${duration} phút`
    } else {
      const hours = Math.floor(duration / 60);
      const minutes = Math.floor(duration - hours * 60);
      if (minutes === 0) {
        return `${hours} giờ`;
      }
      else {
        return `${hours} giờ ${minutes} phút`;
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{successMessage}</p>
          </div>
          <div className="ml-auto">
            <button
              onClick={() => setSuccessMessage('')}
              className="text-green-500 hover:text-green-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
          <div className="ml-auto">
            <button
              onClick={() => setErrorMessage('')}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Quản lý bài học</h3>
          <p className="text-sm text-gray-500">Khóa học: {courseName}</p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateChapterModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tạo chương
          </button>

          <button
            onClick={() => {
              if (chapters.length > 0) {
                setSelectedChapterId(chapters[0].id); // Default to first chapter, or could show a chapter selector
                setShowCreateModal(true);
              } else {
                alert('Vui lòng tạo chương trước khi tạo bài học');
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tạo bài học
          </button>
        </div>
      </div>


      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  BÀI HỌC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  LOẠI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  THỜI LƯỢNG
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TRẠNG THÁI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  THAO TÁC
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chapters.map((chapter, chapterIndex) => {
                const isExpanded = expandedChapters.has(chapter.id);
                const chapterLessons = getLessonsForChapter(chapter.id);

                return (
                  <React.Fragment key={`chapter-${chapter.id}`}>
                    {/* Chapter Row */}
                    <tr className="hover:bg-gray-50 bg-gray-25">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <span>{chapterIndex + 1}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() => toggleChapter(chapter.id)}
                            className="mr-2 text-gray-500 hover:text-gray-700"
                          >
                            {isExpanded ? (
                              <span className="text-sm">
                                <img width="12" height="12" src="https://img.icons8.com/ios/50/expand-arrow--v2.png" alt="expand-arrow--v2" />
                              </span>
                            ) : (
                              <span className="text-sm">
                                <img width="12" height="12" src="https://img.icons8.com/ios/50/forward.png" alt="forward" />
                              </span>
                            )}
                          </button>
                          <img width="20" height="20" src="https://img.icons8.com/windows/32/folder-tree.png" alt="folder-tree" className='mr-2' />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Chương {chapter.orderindex}. {chapter.chaptername}
                              <span className="ml-2 px-2 py-1 text-xs font-medium border border-gray-300 bg-white text-gray-800 rounded-full ">
                                {chapter.countLessons} bài
                              </span>

                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {chapter.type === 'TOPIC' ? (
                          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                            CHỦ ĐỀ
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                            NỘI DUNG
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {convertDurationToString(chapter.duration)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {chapter.status === 0 ? (
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                            Nháp
                          </span>
                        ) : chapter.status === 1 ? (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                            Công khai
                          </span>
                        ) : chapter.status === 2 ? (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                            Riêng tư
                          </span>
                        ) : null}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900" title="Xem">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openEditChapterModal(chapter)}
                            className="text-green-600 hover:text-green-900"
                            title="Chỉnh sửa"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            title="Xóa"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Lessons under this chapter - only show if expanded */}
                    {isExpanded && chapterLessons.map((lesson: Lesson, lessonIndex: number) => (
                      <tr key={`lesson-${lesson.id}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="pl-8">
                            {chapterIndex + 1}.{lessonIndex + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="pl-8">
                            <div className="text-sm font-medium text-gray-900">{lesson.title}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {lesson.type === 0 ? (
                              <>
                                <Video className="h-4 w-4 mr-2 text-red-500" />
                                <span className="text-sm text-gray-900">Video</span>
                              </>
                            ) : lesson.type === 1 ? (
                              <>
                                <FileText className="h-4 w-4 mr-2 text-blue-500" />
                                <span className="text-sm text-gray-900">Bài đọc</span>
                              </>
                            ) : (
                              <>
                                <FileText className="h-4 w-4 mr-2 text-green-500" />
                                <span className="text-sm text-gray-900">Bài tập</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {convertDurationToString(lesson.duration)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-1">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${lesson.published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                              }`}>
                              {lesson.published ? 'Xuất bản' : 'Nháp'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900" title="Xem">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(lesson)}
                              className="text-green-600 hover:text-green-900"
                              title="Chỉnh sửa"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLesson(lesson.id, chapter.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Xóa"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {chapters.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có chương nào</h3>
            <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách tạo chương đầu tiên.</p>
          </div>
        )}
      </div>

      <CreateLesson
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setSelectedChapterId(null);
        }}
        courseId={courseId}
        chapterId={selectedChapterId || undefined}
        onSuccess={(message, chapterId) => {
          setSuccessMessage(message);
          // Refresh chapters to update lesson count and duration
          fetchChapter(courseId);
          // Refresh lessons for the specific chapter where lesson was created
          if (chapterId) {
            refreshLessons([chapterId]);
          }
          // Auto-hide success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000);
        }}
      />

      <CreateLesson
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedLesson(null);
        }}
        courseId={courseId}
        lessonData={selectedLesson && selectedLesson.chapterId ? {
          ...selectedLesson,
          type: selectedLesson.type === 0 ? 'VIDEO' as const : 'DOCUMENT' as const,
          chapterId: selectedLesson.chapterId
        } : undefined}
        onSuccess={(message, chapterId) => {
          setSuccessMessage(message);
          // Refresh chapters and the specific lesson's chapter
          fetchChapter(courseId);
          const targetChapterId = chapterId || selectedLesson?.chapterId;
          if (targetChapterId) {
            refreshLessons([targetChapterId]);
          }
          // Auto-hide success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000);
        }}
      />

      <CreateChapter
        isOpen={showCreateChapterModal}
        onClose={() => setShowCreateChapterModal(false)}
        courseId={courseId}
        onSuccess={(message) => {
          setSuccessMessage(message);
          fetchChapter(courseId); // Refresh chapters after creation
          // Auto-hide success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000);
        }}
      />

      <UpdateChapter
        isOpen={showUpdateChapterModal}
        onClose={() => {
          setShowUpdateChapterModal(false);
          setSelectedChapter(null);
        }}
        courseId={courseId}
        chapterData={selectedChapter || undefined}
        onSuccess={(message) => {
          setSuccessMessage(message);
          fetchChapter(courseId); // Refresh chapters after update
          // Auto-hide success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000);
        }}
        onError={(message) => {
          setErrorMessage(message);
          // Auto-hide error message after 5 seconds
          setTimeout(() => {
            setErrorMessage('');
          }, 5000);
        }}
      />
    </div>
  );
};

export default LessonManagement;
