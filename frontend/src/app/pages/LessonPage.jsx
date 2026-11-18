import React, { useState } from "react";
import { useParams, Link } from "@/app/router-compat";
import mockData from "../data/mockData";
import { useCourseProgress } from "../hooks/useCourseProgress";
import { CheckCircle, Play, ChevronLeft, ChevronRight, Copy, Check, FileText } from "lucide-react";

export default function LessonPage() {
  const { courseId, lessonId } = useParams();
  const course = mockData.courses.find((c) => c.id === courseId) || mockData.courses[0];
  const lesson = mockData.lessons.find((l) => l.id === lessonId) || mockData.lessons[0];

  const { isCompleted, markComplete } = useCourseProgress(course.id, course.totalLessons);
  const completed = isCompleted(lesson.id);

  const [selectedLang, setSelectedLang] = useState("cpp");
  const [copied, setCopied] = useState(false);

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentCode =
    lesson.codeExamples?.find((c) => c.language === selectedLang)?.code ||
    lesson.codeExamples?.[0]?.code ||
    "";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2">
          <Link
            to={`/courses/${course.id}`}
            className="text-indigo-600 hover:underline font-medium"
          >
            {course.title}
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">{lesson.title}</span>
        </div>

        <button
          onClick={() => markComplete(lesson.id)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-semibold transition ${
            completed
              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          <CheckCircle size={14} />
          <span>{completed ? "Lesson Completed ✓" : "Mark Completed"}</span>
        </button>
      </div>

      {/* Main Lesson Content Card */}
      <div className="edu-card p-6 md:p-8 space-y-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {lesson.type} Module • {lesson.duration}
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">{lesson.title}</h1>
        </div>

        {/* Video Player Placeholder if Video */}
        {lesson.type === "video" && (
          <div className="w-full aspect-video bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white relative shadow-sm">
            <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center cursor-pointer hover:bg-indigo-500 transition shadow">
              <Play size={24} fill="white" className="ml-1" />
            </div>
            <div className="absolute bottom-3 left-4 text-xs text-slate-400">
              Interactive Academic Lecture Video • 1080p
            </div>
          </div>
        )}

        {/* Reading Text Content */}
        <div className="text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-line border-t border-slate-100 pt-4">
          {lesson.content}
        </div>

        {/* Code Snippet Box */}
        {lesson.codeExamples && lesson.codeExamples.length > 0 && (
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Implementation Reference</span>
              <div className="flex items-center space-x-2">
                {lesson.codeExamples.map((ex) => (
                  <button
                    key={ex.language}
                    onClick={() => setSelectedLang(ex.language)}
                    className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                      selectedLang === ex.language
                        ? "bg-indigo-600 text-white"
                        : "text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {ex.language.toUpperCase()}
                  </button>
                ))}
                <button
                  onClick={() => handleCopy(currentCode)}
                  className="p-1 hover:bg-slate-200 rounded text-slate-600 ml-2"
                  title="Copy"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
            <pre className="p-4 bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed">
              <code>{currentCode}</code>
            </pre>
          </div>
        )}

        {/* Bottom Pagination */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 text-xs">
          {lesson.prevLessonId ? (
            <Link
              to={`/courses/${course.id}/lessons/${lesson.prevLessonId}`}
              className="flex items-center space-x-1 text-slate-600 hover:text-slate-950 font-semibold"
            >
              <ChevronLeft size={16} />
              <span>Previous Lesson</span>
            </Link>
          ) : (
            <div></div>
          )}

          {lesson.nextLessonId ? (
            <Link
              to={`/courses/${course.id}/lessons/${lesson.nextLessonId}`}
              className="flex items-center space-x-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded shadow-sm"
            >
              <span>Next Lesson</span>
              <ChevronRight size={16} />
            </Link>
          ) : (
            <Link
              to={`/courses/${course.id}`}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded border border-slate-300"
            >
              Return to Syllabus
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
