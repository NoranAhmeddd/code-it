import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import mockData from '../data/mockData';
import { BookOpen, Plus, Edit, Users, FileText, ExternalLink, X } from 'lucide-react';

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState(mockData.courses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Data Structures');
  const [newDifficulty, setNewDifficulty] = useState('intermediate');
  const [newDesc, setNewDesc] = useState('');

  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newCourse = {
      id: `c-custom-${Date.now()}`,
      title: newTitle,
      instructor: 'Dr. Ahmed Hassan',
      instructorId: 'u13',
      difficulty: newDifficulty,
      totalLessons: 12,
      enrolledStudents: 1,
      rating: 5.0,
      ratingCount: 1,
      description: newDesc || 'Comprehensive competitive programming curriculum.',
      category: newCategory,
      tags: [newCategory],
      sections: [
        {
          id: 'sec-init',
          title: 'Section 1: Introduction & Fundamentals',
          lessons: [
            { id: `les-${Date.now()}`, title: 'Course Overview and Setup', duration: '20 min', type: 'video', completed: false },
          ],
        },
      ],
      relatedProblems: ['1A', '2A'],
    };

    setCourses([newCourse, ...courses]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Instructor Studio: Course Management
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Author and organize courses, video modules, lecture notes, and linked judge problems.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded shadow-sm transition"
        >
          <Plus size={15} />
          <span>New Course</span>
        </button>
      </div>

      {/* Grid of Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="edu-card-interactive p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                  {course.category}
                </span>
                <span className="text-slate-500 capitalize">{course.difficulty}</span>
              </div>

              <h2 className="text-base font-bold text-slate-900 leading-snug">
                {course.title}
              </h2>

              <p className="text-xs text-slate-600 line-clamp-3">
                {course.description}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{course.enrolledStudents} students</span>
                <span>{course.totalLessons} lessons</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link
                to={`/courses/${course.id}`}
                className="text-indigo-600 hover:underline font-semibold"
              >
                View Syllabus
              </Link>
              <button className="text-slate-600 hover:text-slate-900 font-medium">
                Edit Content
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Add New Course</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Graph Algorithms & Shortest Paths"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-slate-800 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full border border-slate-300 rounded p-2 text-slate-800"
                  >
                    <option value="Fundamentals">Fundamentals</option>
                    <option value="Data Structures">Data Structures</option>
                    <option value="Graph Theory">Graph Theory</option>
                    <option value="Dynamic Programming">Dynamic Programming</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value)}
                    className="w-full border border-slate-300 rounded p-2 text-slate-800"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Course Description</label>
                <textarea
                  rows={3}
                  placeholder="Outline syllabus topics and objectives..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium shadow-sm"
                >
                  Create &amp; Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
