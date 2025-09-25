export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5204/api';

export const API_ENDPOINTS = {
  // Auth (Xog)
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ME: '/profile/profile',
  UPDATE_PROFILE: '/profile/update-profile',

  // Public
  PUBLIC_COURSES_FEATURED: '/public/courses/featured',
  PUBLIC_COURSES_POPULAR: '/public/courses/popular',
  // PUBLIC_SUBJECTS: '/public/subjects',
  // PUBLIC_GRADES: '/public/grades',
  PUBLIC_COURSE_DETAILS: (id: number) => `/public/courses/${id}`,
  PUBLIC_SYSTEM_INFO: '/public/system/info',

  // Courses
  // COURSES: '/courses',
  COURSES:`/course/getCourses`,
  COURSES_FREE: '/courses/free',
  COURSES_SEARCH: '/courses/search',
  COURSE_DETAILS: (id: number) => `/courses/${id}`,
  COURSE_LESSONS: (id: number) => `/courses/${id}/lessons`,
  COURSE_ENROLL: (id: number) => `/courses/${id}/enroll`,
  COURSE_PURCHASE: (id: number) => `/courses/${id}/purchase`,
  MY_COURSES: '/course/my-courses',

  //CourseEnrollment
  CREATE_COURSE_ENROLLMENT:`/courseEnroll/addEnroll`,
  MARK_LESSON_COMPLETE: `/courseEnroll/updateProgress`,
  
  // Exams
  EXAMS: '/exam/getAllExams', 
  EXAM_DETAILS: (studentExamId: number) => `/exam/getExamById?studentExamId=${studentExamId}`,//xog be
  EXAM_START:`/exam/startExam`, //xog be, chưa test kết nối api vs fe
  EXAM_QUESTIONS: (studentExamId: number) => `/exam/attempt/questions?studentExamId=${studentExamId}`, //xog be , fe chưa lm
  EXAM_SUBMIT_ANSWER: `/exam/attempt/answer`, //xog be, fe chưa có giao diện
  EXAM_SUBMIT:`/exam/attempt/submit`, //xog be, fe chưa có giao diện
  // EXAM_RESULT: (studentExamId: number) => `/exams/attempt/${studentExamId}/result`,
  EXAM_RESULT: (examId: number) => `/exam/attempt/result/${examId}`, //xog be chưa lm fe
  MY_EXAM_ATTEMPTS: '/exams/my-attempts',

  // Teacher
  // TEACHER_CREATE_COURSE: '/teacher/courses',
  // TEACHER_UPDATE_COURSE: (id: number) => `/teacher/courses/${id}`,
  // TEACHER_PUBLISH_COURSE: (id: number) => `/teacher/courses/${id}/publish`,
// TEACHER_ADD_LESSON: (courseId: number) => `/teacher/courses/${courseId}/lessons`,
//TEACHER_EXAMS: '/teacher/exams',
//TEACHER_CREATE_EXAM: '/teacher/exams',
//TEACHER_PUBLISH_EXAM: (id: number) => `/teacher/exams/${id}/publish`,

  TEACHER_COURSES: '/course/courses',
  TEACHER_CREATE_COURSE: '/course/createCourse',
  TEACHER_UPDATE_COURSE:  `/course/updateCourse`,
  TEACHER_PUBLISH_COURSE:  `/course/publishCourse`,  
  TEACHER_ADD_LESSON: `/course/createLesson`,
  TEACHER_EXAMS: '/exam/exams',//xog be
  TEACHER_CREATE_EXAM: '/exam/createExam',//xog be
  TEACHER_PUBLISH_EXAM: `/exam/publishExam`,//xog be

  // Admin(tạm thời chưa làm)
  ADMIN_USERS: '/admin/users',
  ADMIN_SUBJECTS: '/admin/subjects',
  ADMIN_CREATE_SUBJECT: '/admin/subjects',
  ADMIN_UPDATE_SUBJECT: (id: number) => `/admin/subjects/${id}`,
  ADMIN_GRADES: '/admin/grades',
  ADMIN_CREATE_GRADE: '/admin/grades',
  ADMIN_DASHBOARD_STATS: '/admin/dashboard/stats',

  //Classroom
  CREATECLASSROOM: '/classroom/createClass',//xog be
  CLASSROOMS: '/classroom/classrooms',//xog be

  //Subjects
  SUBJECTS: '/subject/subjects',

  //Grades
  GRADES: '/grade/grades',

  //Classroom Students (xog be + fe)
  ADD_STUDENT: '/classStudent/addStudent',
  STUDENTS_IN_CLASS: (classId: number) => `/classStudent/studentsInClass?classId=${classId}`,
  REMOVE_STUDENT: (classId: number, studentId: number) => `/classStudent/removeStudent?classId=${classId}&studentId=${studentId}`,

  //Chapter
  CREATE_CHAPTER: '/chapter/CreateChapter',
  GET_CHAPTERS: (courseId: number) => `/chapter/GetChapters?courseId=${courseId}`,
  UPDATE_CHAPTER:`/chapter/UpdateChapter`,
  DELETE_CHAPTER: (id: number) => `/chapter/deleteChapter/${id}`,

  //Lesson
  GET_LESSONS: (chapterId: number) => `/lesson/lessons?chapterId=${chapterId}`,
  LESSON_DETAIL: (id: number) => `/lesson/lessonDetail?lessonId=${id}`,
  UPDATE_LESSON: (id: number) => `/lesson/UpdateLesson/${id}`,
  DELETE_LESSON: (id: number) => `/lesson/DeleteLesson/${id}`,

  //LessonComplete
  LESSON_COMPLETE:(courseId:number) => `/enrollLesson/getCompletedLessons?courseId=${courseId}`,

} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;