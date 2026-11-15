import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import mockData from '../data/mockData';
import { formatDate } from '../utils/helpers';
import { ClipboardList, Plus, Calendar, ExternalLink, X } from 'lucide-react';

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState(mockData.assignments);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(mockData.courses[0]?.id || '');
  const [deadline, setDeadline] = useState('');
  const [selectedProblems, setSelectedProblems] = useState(['1A', '2A']);
  const [maxScore, setMaxScore] = useState(100);

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const course = mockData.courses.find((c) => c.id === courseId);

    const newAsg = {
      id: `asg-${Date.now()}`,
      title,
      courseId,
      courseTitle: course?.title || 'Competitive Programming Course',
      teacherId: 'u13',
      teacherName: 'Dr. Ahmed Hassan',
      deadline: deadline || new Date(Date.now() + 86400000 * 7).toISOString(),
      problems: selectedProblems,
      maxScore: Number(maxScore),
      description: 'Solve the attached problems to test understanding of course material.',
      status: 'active',
      submittedProblems: [],
    };

    setAssignments([newAsg, ...assignments]);
    setIsModalOpen(false);
    setTitle('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Instructor Studio: Assignment Creator
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Build assignments linked to problem sets, configure automated judge scoring, and track deadlines.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded shadow-sm transition"
        >
          <Plus size={15} />
          <span>New Assignment</span>
        </button>
      </div>

      {/* Standard Table */}
      <div className="edu-card overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Title &amp; Target Course</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4 text-center">Problems</th>
              <th className="py-3 px-4 text-center">Max Score</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assignments.map((asg) => (
              <tr key={asg.id} className="hover:bg-slate-50">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{asg.title}</div>
                  <div className="text-[11px] text-slate-500">{asg.courseTitle}</div>
                </td>
                <td className="py-3 px-4 text-slate-600 font-mono">
                  {formatDate(asg.deadline)}
                </td>
                <td className="py-3 px-4 text-center font-mono font-semibold text-indigo-700">
                  {asg.problems?.length} Problems
                </td>
                <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">
                  {asg.maxScore} pts
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded capitalize text-[11px]">
                    {asg.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <Link
                    to={`/assignments/${asg.id}`}
                    className="text-indigo-600 hover:underline font-semibold"
                  >
                    View Set
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Create Assignment</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Problem Set 5: Disjoint Set Union"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Course</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-slate-800"
                >
                  {mockData.courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full border border-slate-300 rounded p-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Max Score</label>
                  <input
                    type="number"
                    value={maxScore}
                    onChange={(e) => setMaxScore(e.target.value)}
                    className="w-full border border-slate-300 rounded p-2 text-slate-800"
                  />
                </div>
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
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
