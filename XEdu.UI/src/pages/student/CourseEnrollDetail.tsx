import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { API_ENDPOINTS } from '../../constants/api';
import { apiService } from '../../services/api';
import LessonDetail from '../LessonDetail';

interface CourseProgress {
    courseName: string;
    lessonCompleted: number;
    totalLessons: number;
    progress: number;
    courseDescription: string;
}

interface Lesson {
    id: number;
    title: string;
    description: string;
    orderIndex: number;
    type: 'VIDEO' | 'DOCUMENT' | 'LINK';
    videoUrl: string;
    content: string;
    attachmentUrl: string;
    externalLink: string;
    duration: number;
    isFree: boolean;
    published: boolean;
    createdAt: string;
    chapterId: number;
    completed: boolean;
    nextLesson: { id: number; title: string };
    prevLesson: { id: number; title: string };
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


const CourseEnrollDetail: React.FC = () => {
    const { courseId } = useParams();
    const location = useLocation();

    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

    const handleLessonClick = async (lessonId: number) => {
        try {
            const response = await apiService.get<any>(API_ENDPOINTS.LESSON_DETAIL(lessonId));
            setCurrentLesson({ 
                ...response.response,
                id: lessonId,
                completed: lessons[response.response.chapterId]?.some(lesson => lesson.completed)
            });
        } catch (error) {
            console.error('Error fetching lesson:', error);
        }
    };
    const initialProgress = location.state?.courseProgress;
    const [lessons, setLessons] = useState<Record<number, Lesson[]>>({});
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [courseProgress, setCourseProgress] = useState<CourseProgress>(initialProgress || {
        courseName: '',
        lessonCompleted: 0,
        totalLessons: 0,
        progress: 0,
        courseDescription: ''
    });

    const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (courseId) {
            fetchChapter(Number(courseId));
        }
    }, [courseId]);

    // Tính tổng số bài học khi chapters thay đổi
    useEffect(() => {
        if (chapters.length > 0) {
            const totalLessons = chapters.reduce((sum, chapter) => sum + chapter.countLessons, 0);
            setCourseProgress(prev => ({
                ...prev,
                totalLessons: totalLessons
            }));
        }
    }, [chapters]);

    useEffect(() => {
        // Fetch lessons for expanded chapters
        expandedChapters.forEach(chapterId => {
            if (!lessons[chapterId]) {
                fetchLessons(chapterId);
            }
        });
    }, [expandedChapters]);

    const fetchChapter = async (courseId: number) => {
        try {
            const data = await apiService.get<any>(API_ENDPOINTS.GET_CHAPTERS(courseId));
            const response = data.response;
            setChapters(response || []);
        } catch (error) {
            console.error('Error fetching chapters:', error);
        }
    };

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

    const toggleChapter = (chapterId: number) => {
        setExpandedChapters(prev => {
            const newExpanded = new Set(prev);
            if (newExpanded.has(chapterId)) {
                newExpanded.delete(chapterId);
            } else {
                newExpanded.add(chapterId);
            }
            return newExpanded;
        });
    };



    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-100 bg-white border-r border-gray-200 overflow-y-auto">
                {/* Course Header */}
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-semibold text-gray-900">{courseProgress.courseName}</h1>
                    <div className="mt-2">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Tiến độ</span>
                            <span>{courseProgress.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${courseProgress.progress}%` }}
                            />
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                            {courseProgress.lessonCompleted}/{courseProgress.totalLessons} bài
                        </div>
                    </div>
                </div>

                {/* Course Navigation */}
                <div className="py-4">
                    {/* Course Content */}
                    {chapters.map((chapter) => {
                        const isExpanded = expandedChapters.has(chapter.id);
                        const chapterLessons = lessons[chapter.id] || [];

                        return (
                            <div key={`chapter-${chapter.id}`} className="px-4 mb-4">
                                <div className="flex items-center">
                                    <button
                                        onClick={() => toggleChapter(chapter.id)}
                                        className="mr-2 text-gray-500 hover:text-gray-700"
                                    >
                                        {isExpanded ? (
                                            <span className="text-sm">
                                                <img width="15" height="15" src="https://img.icons8.com/ios/50/expand-arrow--v2.png" alt="expand-arrow--v2" />
                                            </span>
                                        ) : (
                                            <span className="text-sm">
                                                <img width="15" height="15" src="https://img.icons8.com/ios/50/forward.png" alt="forward" />
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

                                {isExpanded && (
                                    <div className="space-y-1 ml-8">
                                        {chapterLessons.map((lesson: Lesson) => (
                                            <div
                                                key={`lesson-${lesson.id}`}
                                                className={`flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer
                          ${currentLesson?.id === lesson.id ? 'bg-blue-50' : ''}`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center transition
                            ${lesson.completed == true ? 'bg-green-500' : 'border-2 border-gray-300'}`}>
                                                        {lesson.completed && (
                                                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <span 
                                                        className={`text-sm ${lesson.completed ? 'text-gray-600' : 'text-gray-900'} hover:text-blue-600 cursor-pointer`}
                                                        onClick={() => handleLessonClick(lesson.id)}
                                                    >
                                                        {lesson.title}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500">{lesson.duration} phút</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                {currentLesson ? <LessonDetail courseProgress={courseProgress} currentLesson={currentLesson} fetchLessons={fetchLessons} onLessonChange={handleLessonClick} /> :
                <div className="p-4 text-gray-500">Chọn một bài học để xem chi tiết</div>}
            </div>
        </div>
    );
};

export default CourseEnrollDetail;
