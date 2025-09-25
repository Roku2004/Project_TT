import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AuthRequiredModal from './components/common/AuthRequiredModal';
import Test403Component from './components/common/Test403Component';
import TestComponent from './components/common/TestComponent';
import Layout from './components/layout/Layout';
import { AuthProvider } from './contexts/AuthContext';
import { AuthErrorProvider, useAuthErrorContext } from './contexts/AuthErrorContext';
import { useApiAuthHandler } from './hooks/useApiAuthHandler';
import AdminDashboard from './pages/admin/AdminDashboard';
import CoursesPage from './pages/CoursesPage';
import ExamAttemptPage from './pages/ExamAttemptPage';
import ExamAttemptTestPage from './pages/ExamAttemptTestPage';
import ExamsPage from './pages/ExamsPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MyCoursesPage from './pages/MyCoursesPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import CourseEnrollDetail from './pages/student/CourseEnrollDetail';
import CreateCourse from './pages/teacher/course/CreateCourse';
import CreateExam from './pages/teacher/exam/CreateExam';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
// import LessonDetail from './pages/LessonDetail';

const AppContent: React.FC = () => {
  const { isAuthModalOpen, authMessage, hideAuthModal, showAuthModal } = useAuthErrorContext();
  
  // Setup API auth handler
  useApiAuthHandler(showAuthModal);
  
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/exam-attempt/:studentExamId" element={<ExamAttemptPage />} />
          <Route path="/exam-test" element={<ExamAttemptTestPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-courses" element={<MyCoursesPage />} />
          <Route path="/courses/:courseId/learn" element={<CourseEnrollDetail />} />
          {/* <Route path="/courses/:courseId/learn/:lessonId" element={<LessonDetail />} /> */}

          {/* Teacher routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/courses/create" element={<CreateCourse />} />
          <Route path="/teacher/exams/create" element={<CreateExam />} />
          <Route path="/test" element={<TestComponent />} />
          <Route path="/test-403" element={<Test403Component />} />
        </Routes>
      </Layout>
      
      <AuthRequiredModal
        isOpen={isAuthModalOpen}
        onClose={hideAuthModal}
        message={authMessage}
      />
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AuthErrorProvider>
        <AppContent />
      </AuthErrorProvider>
    </AuthProvider>
  );
}

export default App;
