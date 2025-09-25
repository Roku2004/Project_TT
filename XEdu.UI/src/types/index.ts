// API Response types
export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface ValidationErrorResponse extends ApiResponse {
  errors: Record<string, string>;
}

// User types
export interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  avatar?: string;
  phone?: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface UserSummary {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface JwtAuthenticationResponse {
  accessToken: string;
  tokenType: string;
  user: UserSummary;
}

// Course types
export interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  price: number;
  isFree: boolean;
  level: string;
  estimatedDuration?: number;
  teacherName: string;
  subjectName: string;
  gradeName: string;
  createdAt: string;
}

export interface CourseDetail extends Course {
  objectives?: string;
  lessons: Lesson[];
  teacher: UserSummary;
  subject: Subject;
  grade: Grade;
}

export interface Lesson {
  id: number;
  title: string;
  description?: string;
  orderIndex: number;
  type: string;
  videoUrl?: string;
  duration?: number;
  isFree: boolean;
  published: boolean;
}

// Exam types
export interface Exam {
  id: number;
  title: string;
  description?: string;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  status: string;
}

export interface StudentExam {
  id: number;
  examId: number;
  examTitle: string;
  duration: number;
  totalQuestions: number;
  attemptNumber: number;
  startedAt: string;
  status: string;
}

export interface Question {
  id: number;
  questionText: string;
  type: string;
  points: number;
  imageUrl?: string;
  answers: Answer[];
}

export interface Answer {
  id: number;
  answerText: string;
  isCorrect: boolean;
  orderIndex: number;
}

// Admin types
export interface Subject {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  active: boolean;
}

export interface Grade {
  id: number;
  name: string;
  description?: string;
  gradeLevel: number;
  active: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
  totalCourses: number;
}

// Course Enrollment types
export interface CourseEnrollment {
  id: number;
  course: Course;
  userId: number;
  type: EnrollmentType;
  paidAmount: number;
  status: EnrollmentStatus;
  progress: number;
  enrolledAt: string;
  completedAt?: string;
}

export interface CourseEnrollmentRequest {
  courseId: number;
  type: number;
  paidAmount: number;
  status: number;
  progress: number;
}

export enum EnrollmentType {
  SELF_ENROLLED = 0,
  TEACHER_ASSIGNED = 1,
  PURCHASED = 2
}

export enum EnrollmentStatus {
  ACTIVE = 0,
  COMPLETED = 1,
  DROPPED = 2,
  SUSPENDED = 3
}
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}