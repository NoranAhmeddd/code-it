import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import mockData from '../data/mockData';
import { useCourseProgress } from '../hooks/useCourseProgress';
import { CheckCircle, Play, FileText, ChevronRight, Clock, BookOpen, Star } from 'lucide-react';

export default function CourseDetailPage() {
  const { id } = useParams();
  const course = mockData.courses.find((c) => c.id === id) || mockData.courses[0];
  const { isCompleted, getProgress } = useCourseProgress(course.id, course.totalLessons);

  const [activeTab, setActiveTab] = useState('curriculum');
  const progress = getProgress();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Standard LMS Course Overview Card */}
      <div className="edu-card p-6 md:p-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-0.5 rounded border border-indigo-200">
            {course.category}
          </span>
          <span className="text-slate-500 capitalize">{course.difficulty} Level</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          {course.title}
        </h1>

        <p className="text-sm text-slate-700 leading-relaxed max-w-4xl">
          {course.description}
        </p>

        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-600 border-t border-slate-100">
          <div>Instructor: <strong className="text-slate-800">{course.instructor}</strong></div>
          <div>Rating: <strong className="text-amber-600">{course.rating} / 5.0</strong> ({course.ratingCount} reviews)</div>
          <div>Total Lessons: <strong className="text-slate-800">{course.totalLessons}</strong></div>
          <div>Duration: <strong className="text-slate-800">{course.duration}</strong></div>
        </div>

        {/* Progress & Start CTA */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
          <div className="w-full sm:max-w-xs space-y-1 text-xs">
            <div className="flex justify-between text-slate-600 font-medium">
              <span>Your Course Progress</span>
              <span className="text-indigo-700 font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Link
            to={`/courses/${course.id}/lessons/${course.sections?.[0]?.lessons?.[0]?.id || 'les-1'}`}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-md shadow-sm transition self-start sm:self-auto"
          >
            <Play size={14} fill="white" />
            <span>Continue to Lesson</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-sm">
        {[
          { id: 'curriculum', label: 'Curriculum & Modules' },
          { id: 'objectives', label: 'Learning Objectives' },
          { id: 'problems', label: 'Linked Problem Sets' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`pb-3 font-medium transition ${
              activeTab === t.id
                ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Curriculum Module List */}
      {activeTab === 'curriculum' && (
        <div className="space-y-4">
          {course.sections?.map((section) => (
            <div key={section.id} className="edu-card overflow-hidden">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 font-semibold text-xs text-slate-800 uppercase tracking-wider flex justify-between">
                <span>{section.title}</span>
                <span className="font-normal text-slate-500">{section.lessons.length} lessons</span>
              </div>
              <div className="divide-y divide-slate-100">
                {section.lessons.map((lesson, idx) => {
                  const done = isCompleted(lesson.id) || lesson.completed;
                  return (
                    <Link
                      key={lesson.id}
                      to={`/courses/${course.id}/lessons/${lesson.id}`}
                      className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition text-xs group"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                            done
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {done ? '✓' : idx + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 group-hover:text-indigo-600 transition">
                            {lesson.title}
                          </div>
                          <div className="text-[11px] text-slate-500 capitalize">
                            {lesson.type} • {lesson.duration}
                          </div>
                        </div>
                      </div>

                      <ChevronRight size={14} className="text-slate-400 group-hover:text-indigo-600" />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Objectives */}
      {activeTab === 'objectives' && (
        <div className="edu-card p-6 space-y-4 text-xs">
          <h3 className="font-bold text-slate-800 text-sm">Course Learning Goals</h3>
          <ul className="space-y-2 text-slate-700">
            {course.learningObjectives?.map((obj, i) => (
              <li key={i} className="flex items-start space-x-2">
                <CheckCircle size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tab 3: Linked Problems */}
      {activeTab === 'problems' && (
        <div className="edu-card overflow-hidden">
          <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 text-xs font-semibold text-slate-700 uppercase">
            Practice Problems Associated with this Course
          </div>
          <div className="divide-y divide-slate-100">
            {course.relatedProblems?.map((probId) => {
              const prob = mockData.problems.find((p) => p.id === probId);
              if (!prob) return null;
              return (
                <div key={prob.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50">
                  <div>
                    <span className="font-mono font-bold text-indigo-700 mr-2">{prob.id}</span>
                    <strong className="text-slate-800">{prob.title}</strong>
                    <div className="text-slate-500 text-[11px] mt-0.5">Rating: {prob.rating} • {prob.tags.join(', ')}</div>
                  </div>
                  <Link
                    to={`/problems/${prob.id}`}
                    className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 text-indigo-700 font-semibold rounded border border-slate-200"
                  >
                    Solve in Judge &rarr;
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
