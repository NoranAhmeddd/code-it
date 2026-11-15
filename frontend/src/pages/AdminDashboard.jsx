import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Users, Code2, Send, Trophy, BookOpen, Server, Plus, Settings, UserCog, Trash2, Edit, CheckCircle
} from 'lucide-react';

// ── Mock Data ────────────────────────────────────────────────────────────────

const userGrowthData = [
  { month: 'Dec', users: 320 },
  { month: 'Jan', users: 410 },
  { month: 'Feb', users: 380 },
  { month: 'Mar', users: 520 },
  { month: 'Apr', users: 490 },
  { month: 'May', users: 610 },
  { month: 'Jun', users: 720 },
  { month: 'Jul', users: 680 },
  { month: 'Aug', users: 750 },
  { month: 'Sep', users: 830 },
  { month: 'Oct', users: 920 },
  { month: 'Nov', users: 1050 },
];

const submissionActivity = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  submissions: Math.floor(1500 + Math.random() * 4000),
}));

const recentUsers = [
  { id: 1, username: 'coder_xyz', email: 'coder@xyz.com', country: 'USA', rating: 1245, joined: 'Nov 12, 2026', status: 'active' },
  { id: 2, username: 'algo_master', email: 'algo@master.dev', country: 'Russia', rating: 1890, joined: 'Nov 11, 2026', status: 'active' },
  { id: 3, username: 'binary_star', email: 'binary@star.io', country: 'China', rating: 2100, joined: 'Nov 11, 2026', status: 'active' },
  { id: 4, username: 'node_ninja', email: 'node@ninja.com', country: 'India', rating: 1340, joined: 'Nov 10, 2026', status: 'active' },
  { id: 5, username: 'graph_guru', email: 'graph@guru.net', country: 'Germany', rating: 1760, joined: 'Nov 10, 2026', status: 'banned' },
  { id: 6, username: 'dp_wizard', email: 'dp@wizard.com', country: 'Japan', rating: 1980, joined: 'Nov 9, 2026', status: 'active' },
  { id: 7, username: 'sort_king', email: 'sort@king.io', country: 'Brazil', rating: 1120, joined: 'Nov 9, 2026', status: 'active' },
  { id: 8, username: 'prime_seeker', email: 'prime@seek.com', country: 'France', rating: 1450, joined: 'Nov 8, 2026', status: 'active' },
  { id: 9, username: 'tree_walker', email: 'tree@walk.dev', country: 'Canada', rating: 1670, joined: 'Nov 8, 2026', status: 'active' },
  { id: 10, username: 'bit_flipper', email: 'bit@flip.com', country: 'Korea', rating: 1880, joined: 'Nov 7, 2026', status: 'active' },
];

const problemsList = [
  { id: 'P001', title: 'Two Sum', difficulty: 800, submissions: 24501, acceptance: '68.2%', author: 'admin' },
  { id: 'P002', title: 'Shortest Path', difficulty: 1400, submissions: 12340, acceptance: '41.3%', author: 'prof_algorithms' },
  { id: 'P003', title: 'Count Inversions', difficulty: 1700, submissions: 8921, acceptance: '34.7%', author: 'tourist' },
  { id: 'P004', title: 'Segment Tree Range Query', difficulty: 2100, submissions: 5432, acceptance: '28.1%', author: 'admin' },
  { id: 'P005', title: 'Matrix Exponentiation', difficulty: 2400, submissions: 3201, acceptance: '22.5%', author: 'editorial_team' },
];

const activeContests = [
  { id: 1, name: 'Codeforces Round #910 (Div. 2)', type: 'ICPC', status: 'Live', participants: 8234, startTime: 'Nov 12, 2026 18:00' },
  { id: 2, name: 'Weekly Challenge #48', type: 'Individual', status: 'Upcoming', participants: 0, startTime: 'Nov 14, 2026 14:00' },
  { id: 3, name: 'Div. 3 Warm-Up', type: 'ICPC', status: 'Upcoming', participants: 0, startTime: 'Nov 16, 2026 10:00' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getDifficultyColor(rating) {
  if (rating < 1200) return 'text-gray-400';
  if (rating < 1400) return 'text-green-400';
  if (rating < 1600) return 'text-teal-400';
  if (rating < 1900) return 'text-blue-400';
  if (rating < 2100) return 'text-purple-400';
  if (rating < 2400) return 'text-yellow-400';
  return 'text-red-400';
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ message, onClose }) {
  return (
    <div className="fixed bottom-6 right-6 bg-blue-700 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50 animate-bounce">
      <CheckCircle size={18} />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-white/70 hover:text-white">✕</button>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
        {sub && <p className="text-gray-500 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [toast, setToast] = useState(null);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Platform overview and management</p>
      </div>

      {/* Top Stats — 2 rows of 3 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard icon={Users} label="Total Users" value="5,847" color="bg-blue-600" />
        <StatCard icon={Code2} label="Total Problems" value="1,247" color="bg-purple-600" />
        <StatCard icon={Send} label="Total Submissions" value="847,293" color="bg-green-600" />
        <StatCard icon={Trophy} label="Active Contests" value="1" color="bg-yellow-600" sub="1 live now" />
        <StatCard icon={BookOpen} label="Total Courses" value="48" color="bg-teal-600" />
        <StatCard icon={Server} label="Server Status" value="Online ✓" color="bg-emerald-600" sub="All systems operational" />
      </div>

      {/* Charts + Admin Actions */}
      <div className="flex gap-6 mb-6">
        {/* Charts */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6">
            {/* User Growth */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
              <h2 className="text-base font-semibold mb-4">User Growth (Last 12 Months)</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={userGrowthData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} labelStyle={{ color: '#F9FAFB' }} />
                  <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} dot={false} name="New Users" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Submission Activity */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
              <h2 className="text-base font-semibold mb-4">Submission Activity (Last 30 Days)</h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={submissionActivity} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 9 }} interval={4} />
                  <YAxis tick={{ fill: '#9CA3AF', fontSize: 9 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} labelStyle={{ color: '#F9FAFB' }} />
                  <Bar dataKey="submissions" fill="#8B5CF6" radius={[2, 2, 0, 0]} name="Submissions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Admin Actions Sidebar */}
        <div className="w-56 bg-gray-800 rounded-xl border border-gray-700 p-5 flex flex-col gap-3 h-fit">
          <h2 className="text-base font-semibold mb-1">Admin Actions</h2>
          <button
            onClick={() => showToast('Feature in development')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full">
            <Plus size={15} /> Add Problem
          </button>
          <button
            onClick={() => showToast('Feature in development')}
            className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full">
            <Trophy size={15} /> Create Contest
          </button>
          <button
            onClick={() => showToast('Feature in development')}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full">
            <UserCog size={15} /> Manage Users
          </button>
          <button
            onClick={() => showToast('Feature in development')}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full">
            <Settings size={15} /> Platform Settings
          </button>
        </div>
      </div>

      {/* Tables Section */}
      <div className="flex flex-col gap-6">

        {/* Recent Users */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <h2 className="text-base font-semibold mb-4">Recent Registrations</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  {['Username', 'Email', 'Country', 'Rating', 'Joined', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left pb-2 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentUsers.map(u => (
                  <tr key={u.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="py-2 pr-4 font-medium text-blue-400">{u.username}</td>
                    <td className="py-2 pr-4 text-gray-400">{u.email}</td>
                    <td className="py-2 pr-4 text-gray-300">{u.country}</td>
                    <td className="py-2 pr-4 font-mono text-white">{u.rating}</td>
                    <td className="py-2 pr-4 text-gray-400">{u.joined}</td>
                    <td className="py-2 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        u.status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-2 flex gap-2">
                      <button onClick={() => showToast('Feature in development')} className="text-blue-400 hover:text-blue-300 text-xs">Edit</button>
                      <button onClick={() => showToast('Feature in development')} className="text-red-400 hover:text-red-300 text-xs">Ban</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Problem Management */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold">Problem Management</h2>
            <button onClick={() => showToast('Feature in development')} className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
              <Plus size={14} /> Add Problem
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  {['ID', 'Title', 'Difficulty', 'Submissions', 'Acceptance', 'Author', 'Actions'].map(h => (
                    <th key={h} className="text-left pb-2 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {problemsList.map(p => (
                  <tr key={p.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="py-2 pr-4 font-mono text-gray-500 text-xs">{p.id}</td>
                    <td className="py-2 pr-4 text-blue-400">{p.title}</td>
                    <td className={`py-2 pr-4 font-semibold ${getDifficultyColor(p.difficulty)}`}>{p.difficulty}</td>
                    <td className="py-2 pr-4 text-gray-300">{p.submissions.toLocaleString()}</td>
                    <td className="py-2 pr-4 text-green-400">{p.acceptance}</td>
                    <td className="py-2 pr-4 text-gray-400">{p.author}</td>
                    <td className="py-2 flex gap-2">
                      <button onClick={() => showToast('Feature in development')} className="text-blue-400 hover:text-blue-300">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => showToast('Feature in development')} className="text-red-400 hover:text-red-300">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Contests */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold">Active Contests</h2>
            <button onClick={() => showToast('Feature in development')} className="text-sm bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
              <Plus size={14} /> New Contest
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {activeContests.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/40 hover:bg-gray-700/60 transition-colors">
                <div>
                  <p className="text-white font-medium text-sm">{c.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{c.type} · {c.startTime}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    c.status === 'Live' ? 'bg-green-900/50 text-green-400 animate-pulse' : 'bg-blue-900/50 text-blue-400'
                  }`}>
                    {c.status}
                  </span>
                  <span className="text-gray-400 text-sm flex items-center gap-1">
                    <Users size={13} /> {c.participants.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
