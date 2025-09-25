import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../../../constants/api';
import { apiService } from '../../../services/api';

interface CreateLessonProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
  chapterId?: number;
  onSuccess: (message: string, chapterId?: number) => void;
  lessonData?: {
    id: number;
    title: string;
    description: string;
    orderIndex: number;
    type: 'VIDEO' | 'DOCUMENT';
    videoUrl?: string;
    content?: string;
    attachmentUrl?: string;
    externalLink?: string;
    duration: number;
    isFree: boolean;
    published: boolean;
    chapterId: number;
  };
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

const CreateLesson: React.FC<CreateLessonProps> = ({
  isOpen,
  onClose,
  courseId,
  onSuccess,
  lessonData
}) => {
  const [lessonForm, setLessonForm] = useState({
    chapterId: lessonData?.chapterId || 0,
    title: lessonData?.title || '',
    description: lessonData?.description || '',
    orderIndex: lessonData?.orderIndex || 0,
    type: lessonData?.type || 'VIDEO' as 'VIDEO' | 'DOCUMENT',
    videoUrl: lessonData?.videoUrl || '',
    content: lessonData?.content || '',
    attachmentUrl: lessonData?.attachmentUrl || '',
    externalLink: lessonData?.externalLink || '',
    duration: lessonData?.duration || 0,
    isFree: lessonData?.isFree || false,
    published: lessonData?.published || false
  });
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string>('');

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

  useEffect(() => {
      fetchChapter(courseId);
  }, [isOpen, courseId]);


  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setLessonForm(prev => {
      const newForm = {
        ...prev,
        [name]: type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
            ? Number(value)
            : value
      };

      // Auto-calculate orderIndex when chapter is selected
      if (name === 'chapterId' && value !== '0') {
        const selectedChapter = chapters.find(ch => ch.id === Number(value));
        if (selectedChapter) {
          newForm.orderIndex = selectedChapter.countLessons + 1;
        }
      }

      return newForm;
    });
  }, [chapters]);

  const resetForm = () => {
    setLessonForm({
      chapterId: lessonData?.chapterId || 0,
      title: '',
      description: '',
      orderIndex: 0, // Keep as 0, will be calculated when chapter is selected
      type: 'VIDEO',
      videoUrl: '',
      content: '',
      attachmentUrl: '',
      externalLink: '',
      duration: 0,
      isFree: false,
      published: false
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const form = {
          ...lessonForm,
          type: lessonForm.type === 'VIDEO' ? 0 : 1
        };
        await apiService.post(API_ENDPOINTS.TEACHER_ADD_LESSON, form);
        onSuccess('Thêm bài học thành công!', lessonForm.chapterId);

      resetForm();
      onClose();
    } catch (error) {
      console.error('Error with lesson:', error);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={handleClose}></div>

      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-center">
            {/* <h3 className="text-lg leading-6 font-medium text-gray-900">
              {isEdit ? 'Chỉnh sửa bài học' : 'Tạo bài học mới'}
            </h3> */}
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-md font-medium text-gray-900 mb-4">Thông tin cơ bản</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label htmlFor="orderIndex" className="block text-sm font-medium text-gray-700">
                    Bài số *
                  </label>
                  <input
                    type="number"
                    id="orderIndex"
                    name="orderIndex"
                    value={lessonForm.orderIndex || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    min="1"
                    placeholder="Bài số ..."
                  />
                </div>

                <div>
                  <label htmlFor="chapterId" className="block text-sm font-medium text-gray-700">
                    Chương *
                  </label>
                  <select
                    id="chapterId"
                    name="chapterId"
                    value={lessonForm.chapterId || 0}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value={0}>Chọn chương</option>
                    {chapters.map((chapter) =>(
                      <option key={chapter.id} value={chapter.id}>
                        Chương {chapter.orderindex}. {chapter.chaptername}
                      </option>
                    ))}
                  </select>
                </div>


                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Tiêu đề bài học *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={lessonForm.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Tiêu đề bài học..."
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Loại bài học *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={lessonForm.type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="VIDEO">Video (YouTube)</option>
                    <option value="DOCUMENT">Văn bản</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Mô tả bài học
                </label>
                <div className="mt-1">
                  <CKEditor
                    editor={ClassicEditor as any}
                    data={lessonForm.description}
                    onChange={(_, editor) => {
                      const data = editor.getData();
                      setLessonForm(prev => ({
                        ...prev,
                        description: data
                      }));
                    }}
                  />
                </div>
              </div>
            </div>

            {lessonForm.type === 'VIDEO' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-900 mb-4">Nội dung Video</h4>

                <div>
                  <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">
                    Link YouTube *
                  </label>
                  <input
                    type="url"
                    id="videoUrl"
                    name="videoUrl"
                    value={lessonForm.videoUrl}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
              </div>
            )}

            {lessonForm.type === 'DOCUMENT' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-900 mb-4">Nội dung Văn bản</h4>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Nội dung bài học *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={12}
                    value={lessonForm.content}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                    required
                    placeholder="Nội dung bài học..."
                  />
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <h4 className="text-md font-medium text-gray-900">Tài liệu tham khảo</h4>
              </div>

              <div className="mb-4">
                <label htmlFor="attachmentUrl" className="block text-sm font-medium text-gray-700">
                  Tải tệp từ máy
                </label>
                <input
                  type="file"
                  id="attachmentUrl"
                  name="attachmentUrl"
                  value={lessonForm.attachmentUrl}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                  onChange={handleInputChange}
                  className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div>
                <label htmlFor="attachmentUrl" className="block text-sm font-medium text-gray-700">
                  Hoặc nhập liên kết tài liệu
                </label>
                <input
                  type="url"
                  id="attachmentUrl"
                  name="attachmentUrl"
                  value={lessonForm.attachmentUrl}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://server.com/files/report.pdf"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-md font-medium text-gray-900 mb-4">Liên kết ngoài</h4>

              <div>
                <label htmlFor="externalLink" className="block text-sm font-medium text-gray-700">
                  Liên kết ngoài
                </label>
                <input
                  type="url"
                  id="externalLink"
                  name="externalLink"
                  value={lessonForm.externalLink}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://wikipedia.org/wiki/..."
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-md font-medium text-gray-900 mb-4">Cài đặt bài học</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                    Thời gian(phút)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={lessonForm.duration || ''}
                    onChange={handleInputChange}
                    min="0"
                    placeholder='Thời gian'
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center justify-center pt-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isFree"
                      name="isFree"
                      checked={lessonForm.isFree}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isFree" className="ml-2 block text-sm text-gray-900">
                      Miễn phí
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-center pt-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="published"
                      name="published"
                      checked={lessonForm.published}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                      Đã xuất bản
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
               Tạo bài học
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateLesson;
