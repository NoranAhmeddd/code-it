import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AppProvider } from "./app/context/AppContext";
import MainLayout from "./app/layouts/MainLayout";

// Lazy load all pages for optimal bundle and initial load speed
const StudentDashboard = lazy(() => import("./app/pages/StudentDashboard"));
const ProblemsPage = lazy(() => import("./app/pages/ProblemsPage"));
const ProblemDetailPage = lazy(() => import("./app/pages/ProblemDetailPage"));
const ContestsPage = lazy(() => import("./app/pages/ContestsPage"));
const ContestDetailPage = lazy(() => import("./app/pages/ContestDetailPage"));
const CoursesPage = lazy(() => import("./app/pages/CoursesPage"));
const CourseDetailPage = lazy(() => import("./app/pages/CourseDetailPage"));
const LessonPage = lazy(() => import("./app/pages/LessonPage"));
const AssignmentsPage = lazy(() => import("./app/pages/AssignmentsPage"));
const AssignmentDetailPage = lazy(() => import("./app/pages/AssignmentDetailPage"));
const RankingsPage = lazy(() => import("./app/pages/RankingsPage"));
const UserProfilePage = lazy(() => import("./app/pages/UserProfilePage"));
const TeacherDashboard = lazy(() => import("./app/pages/TeacherDashboard"));
const TeacherCoursesPage = lazy(() => import("./app/pages/TeacherCoursesPage"));
const TeacherAssignmentsPage = lazy(() => import("./app/pages/TeacherAssignmentsPage"));
const TeacherStudentsPage = lazy(() => import("./app/pages/TeacherStudentsPage"));
const AdminDashboard = lazy(() => import("./app/pages/AdminDashboard"));
const ClassroomPage = lazy(() => import("./app/pages/ClassroomPage"));
const BlogsPage = lazy(() => import("./app/pages/BlogsPage"));
const ContributePage = lazy(() => import("./app/pages/ContributePage"));
const LandingPage = lazy(() => import("./app/pages/LandingPage"));

// Lightweight Fallback Loading Spinner
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
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/landing",
    element: (
      <Suspense fallback={<PageLoader />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/dashboard",
        element: (
          <Suspense fallback={<PageLoader />}>
            <StudentDashboard />
          </Suspense>
        ),
      },
      {
        path: "/problems",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProblemsPage />
          </Suspense>
        ),
      },
      {
        path: "/problems/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProblemDetailPage />
          </Suspense>
        ),
      },
      {
        path: "/contests",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContestsPage />
          </Suspense>
        ),
      },
      {
        path: "/contests/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContestDetailPage />
          </Suspense>
        ),
      },
      {
        path: "/courses",
        element: (
          <Suspense fallback={<PageLoader />}>
            <CoursesPage />
          </Suspense>
        ),
      },
      {
        path: "/courses/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <CourseDetailPage />
          </Suspense>
        ),
      },
      {
        path: "/courses/:courseId/lessons/:lessonId",
        element: (
          <Suspense fallback={<PageLoader />}>
            <LessonPage />
          </Suspense>
        ),
      },
      {
        path: "/assignments",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AssignmentsPage />
          </Suspense>
        ),
      },
      {
        path: "/assignments/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AssignmentDetailPage />
          </Suspense>
        ),
      },
      {
        path: "/rankings",
        element: (
          <Suspense fallback={<PageLoader />}>
            <RankingsPage />
          </Suspense>
        ),
      },
      {
        path: "/blogs",
        element: (
          <Suspense fallback={<PageLoader />}>
            <BlogsPage />
          </Suspense>
        ),
      },
      {
        path: "/blogs/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <BlogsPage />
          </Suspense>
        ),
      },
      {
        path: "/contribute",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContributePage />
          </Suspense>
        ),
      },
      {
        path: "/profile/:username",
        element: (
          <Suspense fallback={<PageLoader />}>
            <UserProfilePage />
          </Suspense>
        ),
      },
      {
        path: "/teacher",
        element: (
          <Suspense fallback={<PageLoader />}>
            <TeacherDashboard />
          </Suspense>
        ),
      },
      {
        path: "/teacher/courses",
        element: (
          <Suspense fallback={<PageLoader />}>
            <TeacherCoursesPage />
          </Suspense>
        ),
      },
      {
        path: "/teacher/assignments",
        element: (
          <Suspense fallback={<PageLoader />}>
            <TeacherAssignmentsPage />
          </Suspense>
        ),
      },
      {
        path: "/teacher/students",
        element: (
          <Suspense fallback={<PageLoader />}>
            <TeacherStudentsPage />
          </Suspense>
        ),
      },
      {
        path: "/admin",
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminDashboard />
          </Suspense>
        ),
      },
      {
        path: "/classroom",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ClassroomPage />
          </Suspense>
        ),
      },
      {
        path: "*",
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
