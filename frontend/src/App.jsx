import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './layouts/MainLayout';

// Lazy load all pages for optimal bundle and load performance
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const ProblemsPage = lazy(() => import('./pages/ProblemsPage'));
const ProblemDetailPage = lazy(() => import('./pages/ProblemDetailPage'));
const ContestsPage = lazy(() => import('./pages/ContestsPage'));
const ContestDetailPage = lazy(() => import('./pages/ContestDetailPage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const AssignmentsPage = lazy(() => import('./pages/AssignmentsPage'));
const AssignmentDetailPage = lazy(() => import('./pages/AssignmentDetailPage'));
const RankingsPage = lazy(() => import('./pages/RankingsPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'));
const TeacherCoursesPage = lazy(() => import('./pages/TeacherCoursesPage'));
const TeacherAssignmentsPage = lazy(() => import('./pages/TeacherAssignmentsPage'));
const TeacherStudentsPage = lazy(() => import('./pages/TeacherStudentsPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ClassroomPage = lazy(() => import('./pages/ClassroomPage'));

// Fallback Loading Screen
function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <div className="text-xs uppercase font-mono text-gray-500 tracking-widest">
        Loading CodeArena...
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  // Open the dark competitive dashboard by default.
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },

  // Main Authenticated Application Routes (inside MainLayout)
  {
    element: <MainLayout />,
    children: [
      {
        path: '/dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <StudentDashboard />
          </Suspense>
        ),
      },
      {
        path: '/problems',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProblemsPage />
          </Suspense>
        ),
      },
      {
        path: '/problems/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProblemDetailPage />
          </Suspense>
        ),
      },
      {
        path: '/contests',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContestsPage />
          </Suspense>
        ),
      },
      {
        path: '/contests/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContestDetailPage />
          </Suspense>
        ),
      },
      {
        path: '/courses',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CoursesPage />
          </Suspense>
        ),
      },
      {
        path: '/courses/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CourseDetailPage />
          </Suspense>
        ),
      },
      {
        path: '/courses/:courseId/lessons/:lessonId',
        element: (
          <Suspense fallback={<PageLoader />}>
            <LessonPage />
          </Suspense>
        ),
      },
      {
        path: '/assignments',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AssignmentsPage />
          </Suspense>
        ),
      },
      {
        path: '/assignments/:id',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AssignmentDetailPage />
          </Suspense>
        ),
      },
      {
        path: '/rankings',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RankingsPage />
          </Suspense>
        ),
      },
      {
        path: '/profile/:username',
        element: (
          <Suspense fallback={<PageLoader />}>
            <UserProfilePage />
          </Suspense>
        ),
      },

      // Teacher Portal
      {
        path: '/teacher',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TeacherDashboard />
          </Suspense>
        ),
      },
      {
        path: '/teacher/courses',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TeacherCoursesPage />
          </Suspense>
        ),
      },
      {
        path: '/teacher/assignments',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TeacherAssignmentsPage />
          </Suspense>
        ),
      },
      {
        path: '/teacher/students',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TeacherStudentsPage />
          </Suspense>
        ),
      },

      // Admin & Classroom
      {
        path: '/admin',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminDashboard />
          </Suspense>
        ),
      },
      {
        path: '/classroom',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ClassroomPage />
          </Suspense>
        ),
      },

      // Catch-all redirect to dashboard
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}
