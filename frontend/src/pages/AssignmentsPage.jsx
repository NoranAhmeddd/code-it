import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import mockData from '../data/mockData';
import { formatDate, timeUntil } from '../utils/helpers';
import { ClipboardList, Calendar, CheckCircle, Clock, ChevronRight } from 'lucide-react';

export default function AssignmentsPage() {
  const [filter, setFilter] = useState('all');

  const assignments = mockData.assignments || [];

  const filtered = assignments.filter((a) => {
    if (filter === 'active' && a.status !== 'active') return false;
    if (filter === 'completed' && a.status !== 'completed') return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* LMS Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">
          Assignments &amp; Problem Sets
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Complete mandatory exercises assigned by instructors. Solutions are verified through the CodeArena automated judge.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 text-xs font-semibold">
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded capitalize transition ${
              filter === f
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
            }`}
          >
            {f} Sets
          </button>
        ))}
      </div>

      {/* Assignment Cards List */}
      <div className="space-y-4">
        {filtered.map((asg) => {
          const solvedCount = asg.submittedProblems?.length || 0;
          const totalCount = asg.problems?.length || 1;
          const progressPercent = Math.round((solvedCount / totalCount) * 100);
          const isDone = asg.status === 'completed' || solvedCount === totalCount;

          return (
            <div
              key={asg.id}
              className="edu-card-interactive p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                    {asg.courseTitle}
                  </span>
                  <span className="text-xs text-slate-500">• Instructor: {asg.teacherName}</span>
                </div>

                <h2 className="text-base font-bold text-slate-900">
                  {asg.title}
                </h2>

                <p className="text-xs text-slate-600 line-clamp-1">
                  {asg.description}
                </p>

                <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1 font-mono">
                  <span>Due: {formatDate(asg.deadline)} ({timeUntil(asg.deadline)})</span>
                  <span>•</span>
                  <span>Problems: {solvedCount} of {totalCount} Solved</span>
                  {asg.score !== undefined && (
                    <span className="text-emerald-700 font-bold">• Score: {asg.score}/{asg.maxScore}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 self-end sm:self-center">
                <Link
                  to={`/assignments/${asg.id}`}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded shadow-sm transition inline-flex items-center space-x-1"
                >
                  <span>Open Assignment</span>
                  <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
