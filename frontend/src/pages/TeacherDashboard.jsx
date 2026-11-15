import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Users, BookOpen, ClipboardList, TrendingUp, Plus, Eye, Award, CheckCircle, Clock
} from 'lucide-react';

// ── Mock Data ────────────────────────────────────────────────────────────────

const coursePerformanceData = [
  { name: 'DSA Basics', enrolled: 58, completed: 42 },
  { name: 'Graph Theory', enrolled: 45, completed: 30 },
  { name: 'DP Mastery', enrolled: 52, completed: 35 },
  { name: 'Competitive Prog', enrolled: 41, completed: 28 },
  { name: 'Math for CP', enrolled: 38, completed: 29 },
];

const recentActivity = [
  { id: 1, student: 'alice_w', action: 'Submitted to Assignment 3', course: 'DSA Basics', time: '5 min ago' },
  { id: 2, student: 'bob_coder', action: 'Completed Lesson 5', course: 'Graph Theory', time: '12 min ago' },
  { id: 3, student: 'charlie99', action: 'Started Assignment 2', course: 'DP Mastery', time: '25 min ago' },
  { id: 4, student: 'diana_cp', action: 'Submitted to Assignment 1', course: 'Competitive Prog', time: '41 min ago' },
  { id: 5, student: 'evan_x', action: 'Completed Lesson 3', course: 'Math for CP', time: '1 hr ago' },
  { id: 6, student: 'fiona_dev', action: 'Submitted to Assignment 3', course: 'DSA Basics', time: '1 hr ago' },
  { id: 7, student: 'george_k', action: 'Completed Lesson 7', course: 'Graph Theory', time: '2 hrs ago' },
  { id: 8, student: 'helen_j', action: 'Started Lesson 4', course: 'DP Mastery', time: '2 hrs ago' },
  { id: 9, student: 'ivan_p', action: 'Submitted to Assignment 2', course: 'Competitive Prog', time: '3 hrs ago' },
  { id: 10, student: 'julia_m', action: 'Completed Lesson 6', course: 'Math for CP', time: '3 hrs ago' },
  { id: 11, student: 'kevin_r', action: 'Started Assignment 1', course: 'DSA Basics', time: '4 hrs ago' },
  { id: 12, student: 'lisa_v', action: 'Submitted to Assignment 4', course: 'Graph Theory', time: '4 hrs ago' },
  { id: 13, student: 'mike_b', action: 'Completed Lesson 2', course: 'DP Mastery', time: '5 hrs ago' },
  { id: 14, student: 'nancy_o', action: 'Started Lesson 1', course: 'Competitive Prog', time: '5 hrs ago' },
  { id: 15, student: 'oscar_t', action: 'Submitted to Assignment 3', course: 'Math for CP', time: '6 hrs ago' },
];

const assignmentDeadlines = [
  { id: 1, title: 'Assignment 3: Shortest Paths', course: 'Graph Theory', deadline: 'Nov 15, 2026', status: 'active', submissions: '28/45' },
  { id: 2, title: 'Assignment 4: Knapsack DP', course: 'DP Mastery', deadline: 'Nov 18, 2026', status: 'active', submissions: '19/52' },
  { id: 3, title: 'Assignment 2: Sorting', course: 'DSA Basics', deadline: 'Nov 20, 2026', status: 'upcoming', submissions: '0/58' },
  { id: 4, title: 'Assignment 5: Number Theory', course: 'Math for CP', deadline: 'Nov 22, 2026', status: 'upcoming', submissions: '0/38' },
  { id: 5, title: 'Assignment 3: Trees', course: 'Competitive Prog', deadline: 'Nov 25, 2026', status: 'upcoming', submissions: '0/41' },
];

const topStudents = [
  { id: 1, name: 'alice_w', problemsSolved: 312, rating: 1847 },
  { id: 2, name: 'george_k', problemsSolved: 287, rating: 1762 },
  { id: 3, name: 'fiona_dev', problemsSolved: 251, rating: 1654 },
  { id: 4, name: 'charlie99', problemsSolved: 234, rating: 1598 },
  { id: 5, name: 'diana_cp', problemsSolved: 219, rating: 1521 },
];

const coursesSummary = [
  { id: 1, name: 'DSA Basics', students: 58, completion: 72 },
  { id: 2, name: 'Graph Theory', students: 45, completion: 67 },
  { id: 3, name: 'DP Mastery', students: 52, completion: 67 },
  { id: 4, name: 'Competitive Prog', students: 41, completion: 68 },
  { id: 5, name: 'Math for CP', students: 38, completion: 76 },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-gray-800 rounded-xl p-5 flex items-center gap-4 border border-gray-700">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Teacher Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back, Dr. Ahmed Hassan</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Total Students" value="234" color="bg-blue-600" />
        <StatCard icon={BookOpen} label="Active Courses" value="5" color="bg-green-600" />
        <StatCard icon={ClipboardList} label="Active Assignments" value="8" color="bg-purple-600" />
        <StatCard icon={TrendingUp} label="Avg Completion Rate" value="73%" color="bg-orange-600" />
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6">
        {/* Left column — 60% */}
        <div className="flex-[3] flex flex-col gap-6">

          {/* Course Performance Chart */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
            <h2 className="text-lg font-semibold mb-4">Course Performance</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={coursePerformanceData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#F9FAFB' }}
                />
                <Legend wrapperStyle={{ color: '#9CA3AF', fontSize: 12 }} />
                <Bar dataKey="enrolled" name="Enrolled" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#22C55E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Student Activity */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
            <h2 className="text-lg font-semibold mb-4">Recent Student Activity</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="text-left pb-2 pr-4">Student</th>
                    <th className="text-left pb-2 pr-4">Action</th>
                    <th className="text-left pb-2 pr-4">Course</th>
                    <th className="text-left pb-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map(a => (
                    <tr key={a.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                      <td className="py-2 pr-4">
                        <Link to={`/teacher/students/${a.student}`} className="text-blue-400 hover:underline font-medium">
                          {a.student}
                        </Link>
                      </td>
                      <td className="py-2 pr-4 text-gray-300">{a.action}</td>
                      <td className="py-2 pr-4 text-gray-400">{a.course}</td>
                      <td className="py-2 text-gray-500 whitespace-nowrap">{a.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Assignment Deadlines */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
            <h2 className="text-lg font-semibold mb-4">Upcoming Assignment Deadlines</h2>
            <div className="flex flex-col gap-3">
              {assignmentDeadlines.map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/40 hover:bg-gray-700/60 transition-colors">
                  <div>
                    <p className="text-white font-medium text-sm">{a.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{a.course}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Clock size={13} /> {a.deadline}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      a.status === 'active' ? 'bg-green-900/60 text-green-400' : 'bg-gray-700 text-gray-400'
                    }`}>
                      {a.status}
                    </span>
                    <span className="text-gray-300 font-mono text-xs">{a.submissions}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — 40% */}
        <div className="flex-[2] flex flex-col gap-6">

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-2">
              <Link to="/teacher/courses"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                <Plus size={16} /> Create New Course
              </Link>
              <Link to="/teacher/assignments"
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                <ClipboardList size={16} /> Create Assignment
              </Link>
              <Link to="/teacher/students"
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                <Users size={16} /> View All Students
              </Link>
              <Link to="/teacher/assignments"
                className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                <Eye size={16} /> Grade Submissions
              </Link>
            </div>
          </div>

          {/* Top Performing Students */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award size={18} className="text-yellow-400" /> Top Performing Students
            </h2>
            <div className="flex flex-col gap-3">
              {topStudents.map((s, i) => (
                <div key={s.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold w-5 ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-orange-400' : 'text-gray-500'}`}>
                      #{i + 1}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold text-white">
                      {s.name[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-blue-400">{s.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{s.problemsSolved} solved</p>
                    <p className="text-xs text-gray-400">Rating: {s.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Courses Summary */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
            <h2 className="text-lg font-semibold mb-4">Courses Summary</h2>
            <div className="flex flex-col gap-3">
              {coursesSummary.map(c => (
                <div key={c.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{c.name}</span>
                    <span className="text-gray-400">{c.students} students · {c.completion}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-green-500 h-1.5 rounded-full"
                      style={{ width: `${c.completion}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
