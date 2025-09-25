import { BookOpen, CreditCard, DollarSign, X } from 'lucide-react';
import React, { useState } from 'react';
import { CourseEnrollmentRequest, EnrollmentStatus, EnrollmentType } from '../../types';

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string | null;
  price: number;
  isFree: boolean;
  level: number;
  estimatedDuration: number;
  teacher: {
    id: number;
    fullName: string;
  };
  subjectName: string;
  gradeName: string;
}

interface CourseEnrollmentProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (enrollmentData: CourseEnrollmentRequest) => Promise<void>;
}

const CourseEnrollment: React.FC<CourseEnrollmentProps> = ({
  course,
  isOpen,
  onClose,
  onEnroll
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) return `${remainingMinutes} phút`;
    if (remainingMinutes === 0) return `${hours} giờ`;
    return `${hours} giờ ${remainingMinutes} phút`;
  };

  const convertCourseLevel = (level: number) => {
    const levelMap: { [key: number]: string } = {
      0: 'Cơ bản',
      1: 'Trung bình',
      2: 'Nâng cao'
    };
    return levelMap[level] || 'Cơ bản';
  };

  const handleEnroll = async () => {
    try {
      setLoading(true);

      const enrollmentData: CourseEnrollmentRequest = {
        courseId: course.id,
        type: course.isFree ? EnrollmentType.SELF_ENROLLED : EnrollmentType.PURCHASED,
        paidAmount: course.isFree ? 0 : course.price,
        status: EnrollmentStatus.ACTIVE,
        progress: 0
      };

      await onEnroll(enrollmentData);
      onClose();
    } catch (error) {
      console.error('Error enrolling in course:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {course.isFree ? 'Đăng ký khóa học' : 'Mua khóa học'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Course Info */}
        <div className="p-6 border-b">
          <div className="flex gap-4">
            <img
              src={course.thumbnail || "https://placehold.co/120x80/0ea5e9/ffffff?text=Khóa+học"}
              alt={course.title}
              className="w-30 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {course.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <span>Giáo viên: {course.teacher.fullName}</span>
                <span>•</span>
                <span>{course.subjectName}</span>
                <span>•</span>
                <span>{course.gradeName}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {convertCourseLevel(course.level)}
                </span>
                <span>{formatDuration(course.estimatedDuration)}</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 mt-4">
            {course.description}
          </p>
        </div>

        {/* Pricing */}
        <div className="p-6 border-b">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">Giá khóa học:</span>
              <span className="text-2xl font-bold text-gray-900">
                {course.isFree ? (
                  <span className="text-green-600">Miễn phí</span>
                ) : (
                  `${formatPrice(course.price)}đ`
                )}
              </span>
            </div>
            {!course.isFree && (
              <>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Thuế VAT (10%):</span>
                  <span>{formatPrice(course.price * 0.1)}đ</span>
                </div>
                <hr className="my-2" />
                <div className="flex items-center justify-between font-semibold">
                  <span>Tổng thanh toán:</span>
                  <span className="text-lg text-blue-600">
                    {formatPrice(course.price * 1.1)}đ
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Payment Method (only for paid courses) */}
        {!course.isFree && (
          <div className="p-6 border-b">
            <h4 className="text-lg font-semibold mb-4">Phương thức thanh toán</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                  className="form-radio text-blue-600"
                />
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-gray-600" />
                  <span>Thẻ tín dụng / Thẻ ghi nợ</span>
                </div>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  checked={paymentMethod === 'bank'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'bank')}
                  className="form-radio text-blue-600"
                />
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-gray-600" />
                  <span>Chuyển khoản ngân hàng</span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 bg-gray-50 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <BookOpen className="h-4 w-4 inline mr-1" />
              Bạn sẽ có quyền truy cập vĩnh viễn vào khóa học này
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleEnroll}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    {course.isFree ? 'Đăng ký ngay' : 'Thanh toán'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEnrollment;
