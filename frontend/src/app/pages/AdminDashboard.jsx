import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Code2,
  Send,
  Trophy,
  BookOpen,
  Server,
  Plus,
  Settings,
  UserCog,
  Trash2,
  Edit,
  CheckCircle,
  AlertCircle,
  Check,
  X,
  ShieldAlert,
  FileText,
  PenSquare,
  ArrowRight,
  Eye,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { getRatingColor } from "../utils/helpers";
import { getCountryFlag } from "../data/countries";
import { Link } from "@/app/router-compat";

const userGrowthData = [
  { month: "Dec", users: 320 },
  { month: "Jan", users: 410 },
  { month: "Feb", users: 380 },
  { month: "Mar", users: 520 },
  { month: "Apr", users: 490 },
  { month: "May", users: 610 },
  { month: "Jun", users: 720 },
  { month: "Jul", users: 680 },
  { month: "Aug", users: 750 },
  { month: "Sep", users: 830 },
  { month: "Oct", users: 920 },
  { month: "Nov", users: 1050 },
];

const submissionActivity = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  submissions: Math.floor(1500 + Math.random() * 4000),
}));

export default function AdminDashboard() {
  const {
    contributedDivs,
    approveDiv,
    rejectDiv,
    submitDiv,
    contributedProblems,
    approveProblem,
    rejectProblem,
    submitProblem,
    blogs,
    approveBlog,
    rejectBlog,
    submitBlog,
    users: appUsers,
    toggleBanUser,
    updateUserRole,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'divs' | 'problems' | 'blogs' | 'users'
  const [toast, setToast] = useState(null);

  // Modals
  const [showAddDivModal, setShowAddDivModal] = useState(false);
  const [showAddProblemModal, setShowAddProblemModal] = useState(false);
  const [showAddBlogModal, setShowAddBlogModal] = useState(false);
  const [viewBlogModal, setViewBlogModal] = useState(null);

  // New Div Form
  const [newDivName, setNewDivName] = useState("");
  const [newDivLevel, setNewDivLevel] = useState("Div. 2");
  const [newDivDuration, setNewDivDuration] = useState("2 hours");

  // New Problem Form
  const [newProbTitle, setNewProbTitle] = useState("");
  const [newProbDiff, setNewProbDiff] = useState(1600);
  const [newProbDiv, setNewProbDiv] = useState("Div. 2");
  const [newProbStatement, setNewProbStatement] = useState("");

  // New Blog Form
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogCategory, setNewBlogCategory] = useState("Announcements");
  const [newBlogContent, setNewBlogContent] = useState("");

  // User search filter
  const [userSearch, setUserSearch] = useState("");

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  // Div Handlers
  const handleApproveDiv = (id, name) => {
    approveDiv(id);
    showToast(`Contest Div "${name}" approved and published to live contests!`);
  };

  const handleRejectDiv = (id, name) => {
    rejectDiv(id);
    showToast(`Contest Div "${name}" rejected.`);
  };

  const handleCreateDirectDiv = (e) => {
    e.preventDefault();
    if (!newDivName.trim()) return;
    const divId = `DIV-${Date.now().toString().slice(-4)}`;
    submitDiv({
      id: divId,
      name: newDivName.trim(),
      divLevel: newDivLevel,
      duration: newDivDuration,
      scheduledDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      description: `Official ${newDivLevel} round created by Platform Administrator.`,
      problems: ["1A", "2A", "3A"],
      author: "admin",
      authorRating: 3000,
      status: "approved",
      submittedAt: "Today",
    });
    showToast(`New ${newDivLevel} Contest added and published!`);
    setShowAddDivModal(false);
    setNewDivName("");
  };

  // Problem Handlers
  const handleApproveProblem = (id, title) => {
    approveProblem(id);
    showToast(`Problem "${title}" approved and added to active Problemset!`);
  };

  const handleRejectProblem = (id, title) => {
    rejectProblem(id);
    showToast(`Problem "${title}" rejected.`);
  };

  const handleCreateDirectProblem = (e) => {
    e.preventDefault();
    if (!newProbTitle.trim() || !newProbStatement.trim()) return;
    const probId = `P-${Date.now().toString().slice(-4)}`;
    submitProblem({
      id: probId,
      title: newProbTitle.trim(),
      difficulty: Number(newProbDiff),
      divLevel: newProbDiv,
      tags: ["ad-hoc", "math"],
      timeLimit: "2.0s",
      memoryLimit: "256MB",
      statement: newProbStatement.trim(),
      inputFormat: "Standard Input",
      outputFormat: "Standard Output",
      author: "admin",
      authorRating: 3000,
      status: "approved",
      submittedAt: "Today",
    });
    showToast(`Problem "${newProbTitle}" published directly to Problemset!`);
    setShowAddProblemModal(false);
    setNewProbTitle("");
    setNewProbStatement("");
  };

  // Blog Handlers
  const handleApproveBlog = (id, title) => {
    approveBlog(id);
    showToast(`Blog "${title}" approved! It is now live in public Blogs & Home.`);
  };

  const handleRejectBlog = (id, title) => {
    rejectBlog(id);
    showToast(`Blog "${title}" rejected.`);
  };

  const handleCreateDirectBlog = (e) => {
    e.preventDefault();
    if (!newBlogTitle.trim() || !newBlogContent.trim()) return;
    submitBlog({
      id: `blog-${Date.now()}`,
      title: newBlogTitle.trim(),
      category: newBlogCategory,
      author: "admin",
      authorRating: 3000,
      date: "Today",
      summary: newBlogContent.slice(0, 140) + "...",
      content: newBlogContent,
      tags: ["announcement", "official"],
      status: "approved",
      commentsCount: 0,
      comments: [],
    });
    showToast(`Official Announcement "${newBlogTitle}" published!`);
    setShowAddBlogModal(false);
    setNewBlogTitle("");
    setNewBlogContent("");
  };

  // Pending counts
  const pendingDivs = (contributedDivs || []).filter((d) => d.status === "pending");
  const pendingProblems = (contributedProblems || []).filter((p) => p.status === "pending");
  const pendingBlogs = (blogs || []).filter((b) => b.status === "pending");

  const filteredUsers = (appUsers || []).filter((u) => {
    if (!userSearch.trim()) return true;
    return (
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.country && u.country.toLowerCase().includes(userSearch.toLowerCase()))
    );
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
          <CheckCircle size={18} />
          <span className="text-sm font-semibold">{toast}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-white/70 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-red-400 font-semibold uppercase">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
            <span>Platform Administration &amp; Moderation Console</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-0.5">
            Admin Master Dashboard
          </h1>
          <p className="text-xs text-gray-400">
            Review user-contributed Divs, problems, blog submissions, and manage system operations.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-gray-800/80 border border-gray-700/80 p-1 rounded-xl text-xs font-mono">
          {[
            { id: "overview", label: "Overview" },
            { id: "divs", label: `Divs (${pendingDivs.length} Pending)` },
            { id: "problems", label: `Problems (${pendingProblems.length} Pending)` },
            { id: "blogs", label: `Blogs (${pendingBlogs.length} Pending)` },
            { id: "users", label: "Users" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition font-semibold ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white font-bold shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================
          TAB 1: OVERVIEW & ANALYTICS
          ======================================================== */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Top Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 space-y-1">
              <p className="text-gray-400 text-xs uppercase font-mono">Total Users</p>
              <p className="text-xl font-bold font-mono text-blue-400">5,847</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 space-y-1">
              <p className="text-gray-400 text-xs uppercase font-mono">Problemset</p>
              <p className="text-xl font-bold font-mono text-purple-400">1,247</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 space-y-1">
              <p className="text-gray-400 text-xs uppercase font-mono">Submissions</p>
              <p className="text-xl font-bold font-mono text-emerald-400">847,293</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 space-y-1">
              <p className="text-gray-400 text-xs uppercase font-mono">Pending Divs</p>
              <p className="text-xl font-bold font-mono text-amber-400">{pendingDivs.length}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 space-y-1">
              <p className="text-gray-400 text-xs uppercase font-mono">Pending Blogs</p>
              <p className="text-xl font-bold font-mono text-rose-400">{pendingBlogs.length}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 space-y-1">
              <p className="text-gray-400 text-xs uppercase font-mono">Judge Cluster</p>
              <p className="text-xl font-bold font-mono text-emerald-400">Online ✓</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-300 font-mono">
                User Registrations (Last 12 Months)
              </h2>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart
                  data={userGrowthData}
                  margin={{ top: 0, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#9CA3AF", fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#3B82F6"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-300 font-mono">
                Judge Submission Activity (Last 30 Days)
              </h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={submissionActivity}
                  margin={{ top: 0, right: 5, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" tick={{ fill: "#9CA3AF", fontSize: 9 }} interval={4} />
                  <YAxis tick={{ fill: "#9CA3AF", fontSize: 9 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="submissions" fill="#8B5CF6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => setActiveTab("divs")}
              className="bg-gray-800 hover:bg-gray-750 border border-gray-700 p-5 rounded-xl cursor-pointer transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <Trophy size={20} className="text-amber-400" />
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded">
                  {pendingDivs.length} awaiting review
                </span>
              </div>
              <h3 className="font-bold text-white text-sm">Review Contributed Divs</h3>
              <p className="text-xs text-gray-400">
                Inspect community-created contest divisions, approve problems, and publish to live
                calendar.
              </p>
            </div>

            <div
              onClick={() => setActiveTab("problems")}
              className="bg-gray-800 hover:bg-gray-750 border border-gray-700 p-5 rounded-xl cursor-pointer transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <Code2 size={20} className="text-blue-400" />
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded">
                  {pendingProblems.length} awaiting review
                </span>
              </div>
              <h3 className="font-bold text-white text-sm">Review Contributed Problems</h3>
              <p className="text-xs text-gray-400">
                Verify statements, difficulty ratings, time/memory constraints, and test suites.
              </p>
            </div>

            <div
              onClick={() => setActiveTab("blogs")}
              className="bg-gray-800 hover:bg-gray-750 border border-gray-700 p-5 rounded-xl cursor-pointer transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <PenSquare size={20} className="text-rose-400" />
                <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded">
                  {pendingBlogs.length} awaiting review
                </span>
              </div>
              <h3 className="font-bold text-white text-sm">Moderate Blogs &amp; Editorials</h3>
              <p className="text-xs text-gray-400">
                Review user blog submissions before allowing them to be publicly visible on Home.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: DIV / CONTEST REVIEWS & CREATION
          ======================================================== */}
      {activeTab === "divs" && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-700 pb-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <Trophy size={18} className="text-amber-400" />
                  <span>Contest Divisions &amp; Curation Review</span>
                </h2>
                <p className="text-xs text-gray-400">
                  Review submitted Divs from problemsetters. Approved Divs are instantly published
                  to upcoming Contests.
                </p>
              </div>

              <button
                onClick={() => setShowAddDivModal(true)}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition"
              >
                <Plus size={15} />
                <span>Add Div Directly as Admin</span>
              </button>
            </div>

            {/* Divs Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700 font-mono">
                    <th className="py-2.5 pr-4">Div ID</th>
                    <th className="py-2.5 pr-4">Contest Title</th>
                    <th className="py-2.5 pr-4">Tier</th>
                    <th className="py-2.5 pr-4">Setter</th>
                    <th className="py-2.5 pr-4">Duration</th>
                    <th className="py-2.5 pr-4">Problems</th>
                    <th className="py-2.5 pr-4 text-center">Status</th>
                    <th className="py-2.5 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {(contributedDivs || []).map((d) => {
                    const isPending = d.status === "pending";
                    return (
                      <tr key={d.id} className="hover:bg-gray-750/50 transition">
                        <td className="py-3 pr-4 font-mono text-gray-400">{d.id}</td>
                        <td className="py-3 pr-4">
                          <span className="font-bold text-white block text-sm">{d.name}</span>
                          <span className="text-[11px] text-gray-400 line-clamp-1">
                            {d.description}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-mono font-bold text-[10px] border border-blue-800">
                            {d.divLevel}
                          </span>
                        </td>
                        <td className="py-3 pr-4 font-semibold text-gray-300">@{d.author}</td>
                        <td className="py-3 pr-4 font-mono text-gray-400">{d.duration}</td>
                        <td className="py-3 pr-4 font-mono text-gray-300">
                          {(d.problems || []).join(", ")}
                        </td>
                        <td className="py-3 pr-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                              d.status === "approved"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                                : d.status === "rejected"
                                  ? "bg-rose-950 text-rose-400 border border-rose-500/30"
                                  : "bg-amber-950 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {d.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {isPending && (
                              <>
                                <button
                                  onClick={() => handleApproveDiv(d.id, d.name)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs flex items-center space-x-1 transition"
                                >
                                  <Check size={12} />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => handleRejectDiv(d.id, d.name)}
                                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold text-xs flex items-center space-x-1 transition"
                                >
                                  <X size={12} />
                                  <span>Reject</span>
                                </button>
                              </>
                            )}
                            {!isPending && (
                              <span className="text-gray-500 font-mono text-[11px]">
                                Reviewed ✓
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: PROBLEM CONTRIBUTIONS REVIEW & CREATION
          ======================================================== */}
      {activeTab === "problems" && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-700 pb-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <Code2 size={18} className="text-blue-400" />
                  <span>Problemset Submissions Review</span>
                </h2>
                <p className="text-xs text-gray-400">
                  Inspect community-contributed problems. Approved problems are automatically listed
                  in the main Problemset.
                </p>
              </div>

              <button
                onClick={() => setShowAddProblemModal(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition"
              >
                <Plus size={15} />
                <span>Add Problem as Admin</span>
              </button>
            </div>

            {/* Problems Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700 font-mono">
                    <th className="py-2.5 pr-4">ID</th>
                    <th className="py-2.5 pr-4">Title &amp; Statement Preview</th>
                    <th className="py-2.5 pr-4">Division</th>
                    <th className="py-2.5 pr-4 text-center">Difficulty</th>
                    <th className="py-2.5 pr-4">Author</th>
                    <th className="py-2.5 pr-4 text-center">Status</th>
                    <th className="py-2.5 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {(contributedProblems || []).map((p) => {
                    const isPending = p.status === "pending";
                    return (
                      <tr key={p.id} className="hover:bg-gray-750/50 transition">
                        <td className="py-3 pr-4 font-mono text-gray-400">{p.id}</td>
                        <td className="py-3 pr-4 max-w-md">
                          <span className="font-bold text-white block text-sm">{p.title}</span>
                          <span className="text-[11px] text-gray-400 line-clamp-2 mt-0.5">
                            {p.statement}
                          </span>
                          <div className="flex gap-1 mt-1 font-mono text-[10px] text-gray-400">
                            <span>
                              Limits: {p.timeLimit || "2.0s"} / {p.memoryLimit || "256MB"}
                            </span>
                            <span>•</span>
                            <span>Tags: {(p.tags || []).join(", ")}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 font-mono text-gray-300">
                          {p.divLevel || "Div. 2"}
                        </td>
                        <td
                          className={`py-3 pr-4 text-center font-mono font-bold ${getRatingColor(p.difficulty)}`}
                        >
                          {p.difficulty}
                        </td>
                        <td className="py-3 pr-4 font-semibold text-gray-300">@{p.author}</td>
                        <td className="py-3 pr-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                              p.status === "approved"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                                : p.status === "rejected"
                                  ? "bg-rose-950 text-rose-400 border border-rose-500/30"
                                  : "bg-amber-950 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {isPending && (
                              <>
                                <button
                                  onClick={() => handleApproveProblem(p.id, p.title)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs flex items-center space-x-1 transition"
                                >
                                  <Check size={12} />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => handleRejectProblem(p.id, p.title)}
                                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold text-xs flex items-center space-x-1 transition"
                                >
                                  <X size={12} />
                                  <span>Reject</span>
                                </button>
                              </>
                            )}
                            {!isPending && (
                              <span className="text-gray-500 font-mono text-[11px]">
                                Reviewed ✓
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: BLOGS & EDITORIALS MODERATION
          ======================================================== */}
      {activeTab === "blogs" && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-700 pb-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <PenSquare size={18} className="text-rose-400" />
                  <span>Blog Moderation &amp; Editorial Review</span>
                </h2>
                <p className="text-xs text-gray-400">
                  User submitted blogs must be reviewed and approved before becoming visible to the
                  public.
                </p>
              </div>

              <button
                onClick={() => setShowAddBlogModal(true)}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition"
              >
                <Plus size={15} />
                <span>Post Official Blog</span>
              </button>
            </div>

            {/* Blogs Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700 font-mono">
                    <th className="py-2.5 pr-4">ID</th>
                    <th className="py-2.5 pr-4">Title &amp; Summary</th>
                    <th className="py-2.5 pr-4">Category</th>
                    <th className="py-2.5 pr-4">Author</th>
                    <th className="py-2.5 pr-4">Date</th>
                    <th className="py-2.5 pr-4 text-center">Status</th>
                    <th className="py-2.5 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {(blogs || []).map((b) => {
                    const isPending = b.status === "pending";
                    return (
                      <tr key={b.id} className="hover:bg-gray-750/50 transition">
                        <td className="py-3 pr-4 font-mono text-gray-400">{b.id}</td>
                        <td className="py-3 pr-4 max-w-sm">
                          <span className="font-bold text-white block text-sm">{b.title}</span>
                          <span className="text-[11px] text-gray-400 line-clamp-2 mt-0.5">
                            {b.summary}
                          </span>
                        </td>
                        <td className="py-3 pr-4 font-mono">
                          <span className="px-2 py-0.5 rounded bg-gray-700 text-gray-300 text-[10px]">
                            {b.category}
                          </span>
                        </td>
                        <td className="py-3 pr-4 font-semibold text-gray-300">@{b.author}</td>
                        <td className="py-3 pr-4 font-mono text-gray-400">{b.date}</td>
                        <td className="py-3 pr-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                              b.status === "approved"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                                : b.status === "rejected"
                                  ? "bg-rose-950 text-rose-400 border border-rose-500/30"
                                  : "bg-amber-950 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setViewBlogModal(b)}
                              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded font-semibold text-xs flex items-center space-x-1"
                              title="Read full post"
                            >
                              <Eye size={12} />
                              <span>View</span>
                            </button>

                            {isPending && (
                              <>
                                <button
                                  onClick={() => handleApproveBlog(b.id, b.title)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs flex items-center space-x-1 transition"
                                >
                                  <Check size={12} />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => handleRejectBlog(b.id, b.title)}
                                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold text-xs flex items-center space-x-1 transition"
                                >
                                  <X size={12} />
                                  <span>Reject</span>
                                </button>
                              </>
                            )}

                            {!isPending && (
                              <Link
                                to={`/blogs/${b.id}`}
                                className="text-blue-400 hover:underline text-xs font-semibold"
                              >
                                View Live &rarr;
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 5: USER MANAGEMENT
          ======================================================== */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-700 pb-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <UserCog size={18} className="text-teal-400" />
                  <span>User Accounts &amp; Role Management</span>
                </h2>
                <p className="text-xs text-gray-400">
                  Manage user roles (Admin, Teacher, Student), modify account standing, or restrict
                  malicious users.
                </p>
              </div>

              <input
                type="text"
                placeholder="Search user or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 w-full sm:w-60"
              />
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700 font-mono">
                    <th className="py-2.5 pr-4">User</th>
                    <th className="py-2.5 pr-4">Email</th>
                    <th className="py-2.5 pr-4">Country</th>
                    <th className="py-2.5 pr-4 text-center">Rating</th>
                    <th className="py-2.5 pr-4">Current Role</th>
                    <th className="py-2.5 pr-4 text-center">Account Status</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {filteredUsers.map((u) => {
                    const isBanned = u.status === "banned";
                    return (
                      <tr key={u.id} className="hover:bg-gray-750/50 transition">
                        <td className="py-3 pr-4">
                          <Link
                            to={`/profile/${u.username}`}
                            className={`font-bold hover:underline ${getRatingColor(u.rating)}`}
                          >
                            {u.username}
                          </Link>
                          <span className="text-[11px] text-gray-500 block">{u.displayName}</span>
                        </td>
                        <td className="py-3 pr-4 font-mono text-gray-400">{u.email}</td>
                        <td className="py-3 pr-4 text-gray-300">
                          <span className="inline-flex items-center gap-1.5">
                            <span>{getCountryFlag(u.country)}</span>
                            <span>{u.country || "International"}</span>
                          </span>
                        </td>
                        <td
                          className={`py-3 pr-4 text-center font-mono font-bold ${getRatingColor(u.rating)}`}
                        >
                          {u.rating || 1500}
                        </td>
                        <td className="py-3 pr-4">
                          <select
                            value={u.role || "student"}
                            onChange={(e) => {
                              updateUserRole(u.id, e.target.value);
                              showToast(`Updated @${u.username}'s role to ${e.target.value}`);
                            }}
                            className="bg-gray-900 border border-gray-700 text-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500 capitalize"
                          >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="py-3 pr-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                              isBanned
                                ? "bg-rose-950 text-rose-400 border border-rose-500/30"
                                : "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                            }`}
                          >
                            {isBanned ? "Banned" : "Active"}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              toggleBanUser(u.id);
                              showToast(`${isBanned ? "Unbanned" : "Banned"} user @${u.username}`);
                            }}
                            className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                              isBanned
                                ? "bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300"
                                : "bg-rose-900/60 hover:bg-rose-800 text-rose-300"
                            }`}
                          >
                            {isBanned ? "Unban User" : "Ban User"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD DIV DIRECTLY AS ADMIN
          ======================================================== */}
      {showAddDivModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-700 pb-3">
              <h3 className="font-bold text-white text-base">Create Contest Div Directly</h3>
              <button
                onClick={() => setShowAddDivModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateDirectDiv} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-300 block">Contest Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CodeArena Championship Round 45 (Div. 1)"
                  value={newDivName}
                  onChange={(e) => setNewDivName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-300 block">Division Tier</label>
                  <select
                    value={newDivLevel}
                    onChange={(e) => setNewDivLevel(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Div. 1">Div. 1</option>
                    <option value="Div. 2">Div. 2</option>
                    <option value="Div. 3">Div. 3</option>
                    <option value="Div. 4">Div. 4</option>
                    <option value="Div. 1 + Div. 2">Div. 1 + Div. 2</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-300 block">Duration</label>
                  <select
                    value={newDivDuration}
                    onChange={(e) => setNewDivDuration(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="2 hours">2 hours</option>
                    <option value="2.5 hours">2.5 hours</option>
                    <option value="5 hours">5 hours (ICPC)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDivModal(false)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs"
                >
                  Publish Div Immediately
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD PROBLEM DIRECTLY AS ADMIN
          ======================================================== */}
      {showAddProblemModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-700 pb-3">
              <h3 className="font-bold text-white text-base">Add Problem Directly to Problemset</h3>
              <button
                onClick={() => setShowAddProblemModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateDirectProblem} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-300 block">Problem Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tree Path Median Queries"
                  value={newProbTitle}
                  onChange={(e) => setNewProbTitle(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-300 block">Target Div</label>
                  <select
                    value={newProbDiv}
                    onChange={(e) => setNewProbDiv(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white"
                  >
                    <option value="Div. 1">Div. 1</option>
                    <option value="Div. 2">Div. 2</option>
                    <option value="Div. 3">Div. 3</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-gray-300 block">
                    Difficulty ({newProbDiff})
                  </label>
                  <input
                    type="number"
                    min="800"
                    max="3500"
                    step="100"
                    value={newProbDiff}
                    onChange={(e) => setNewProbDiff(Number(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-300 block">Statement *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Problem statement..."
                  value={newProbStatement}
                  onChange={(e) => setNewProbStatement(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProblemModal(false)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs"
                >
                  Publish Problem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD OFFICIAL BLOG
          ======================================================== */}
      {showAddBlogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-700 pb-3">
              <h3 className="font-bold text-white text-base">Post Official Announcement or Blog</h3>
              <button
                onClick={() => setShowAddBlogModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateDirectBlog} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-300 block">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CodeArena System Maintenance & Upgrade"
                  value={newBlogTitle}
                  onChange={(e) => setNewBlogTitle(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-300 block">Category</label>
                <select
                  value={newBlogCategory}
                  onChange={(e) => setNewBlogCategory(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white"
                >
                  <option value="Announcements">Announcements</option>
                  <option value="Editorials">Editorials</option>
                  <option value="Platform">Platform</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-gray-300 block">Content *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Full announcement body..."
                  value={newBlogContent}
                  onChange={(e) => setNewBlogContent(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBlogModal(false)}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs"
                >
                  Publish Immediately
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: VIEW BLOG FULL CONTENT
          ======================================================== */}
      {viewBlogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-700 pb-3">
              <div>
                <h3 className="font-bold text-white text-base">{viewBlogModal.title}</h3>
                <span className="text-xs text-gray-400 font-mono">
                  By @{viewBlogModal.author} • {viewBlogModal.category} • Status:{" "}
                  {viewBlogModal.status}
                </span>
              </div>
              <button
                onClick={() => setViewBlogModal(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="bg-gray-900 p-4 rounded-xl text-xs text-gray-200 leading-relaxed max-h-80 overflow-y-auto whitespace-pre-line border border-gray-700">
              {viewBlogModal.content || viewBlogModal.summary}
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-400 font-mono">ID: {viewBlogModal.id}</span>
              <div className="flex gap-2">
                {viewBlogModal.status === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        handleApproveBlog(viewBlogModal.id, viewBlogModal.title);
                        setViewBlogModal(null);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs"
                    >
                      Approve &amp; Publish
                    </button>
                    <button
                      onClick={() => {
                        handleRejectBlog(viewBlogModal.id, viewBlogModal.title);
                        setViewBlogModal(null);
                      }}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold text-xs"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => setViewBlogModal(null)}
                  className="px-3.5 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded font-semibold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
