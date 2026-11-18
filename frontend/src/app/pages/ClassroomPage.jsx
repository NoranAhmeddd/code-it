import React, { useState } from "react";
import { Link } from "@/app/router-compat";
import mockData from "../data/mockData";
import { Users, MessageSquare, BookOpen, ClipboardList, Send } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ClassroomPage() {
  const { userRole } = useApp();
  const [selectedClassroomId, setSelectedClassroomId] = useState(
    mockData.classrooms[0]?.id || "cls-1",
  );
  const [activeTab, setActiveTab] = useState("announcements");
  const [announcements, setAnnouncements] = useState(mockData.classrooms[0]?.announcements || []);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const currentClassroom =
    mockData.classrooms.find((c) => c.id === selectedClassroomId) || mockData.classrooms[0];

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const ann = {
      id: `ann-${Date.now()}`,
      title: newTitle,
      content: newContent,
      date: new Date().toISOString().split("T")[0],
    };

    setAnnouncements([ann, ...announcements]);
    setNewTitle("");
    setNewContent("");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header and Cohort Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider">
            Academic Cohort &amp; Classroom
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">{currentClassroom.name}</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Instructor: <strong>{currentClassroom.teacherName}</strong> •{" "}
            {currentClassroom.studentCount} enrolled students
          </p>
        </div>

        <select
          value={selectedClassroomId}
          onChange={(e) => {
            setSelectedClassroomId(e.target.value);
            const cls = mockData.classrooms.find((c) => c.id === e.target.value);
            if (cls) setAnnouncements(cls.announcements);
          }}
          className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-indigo-600"
        >
          {mockData.classrooms.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-sm">
        {[
          { id: "announcements", label: "Announcements" },
          { id: "leaderboard", label: "Cohort Standings" },
          { id: "curriculum", label: "Assigned Curriculum" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`pb-3 font-medium transition ${
              activeTab === t.id
                ? "text-indigo-600 border-b-2 border-indigo-600 font-semibold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Announcements */}
      {activeTab === "announcements" && (
        <div className="space-y-6">
          {(userRole === "teacher" || userRole === "admin") && (
            <form onSubmit={handlePostAnnouncement} className="edu-card p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Post Teacher Announcement
              </h3>
              <input
                type="text"
                placeholder="Topic / Header..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
              />
              <textarea
                rows={2}
                placeholder="Message to students..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded transition"
                >
                  Post Announcement
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {announcements.map((ann) => (
              <div key={ann.id} className="edu-card p-5 space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-500 font-mono">
                  <span className="font-semibold text-indigo-700">Class Notice</span>
                  <span>{ann.date}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{ann.title}</h3>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {ann.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cohort Leaderboard */}
      {activeTab === "leaderboard" && (
        <div className="edu-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4 w-16 text-center">Rank</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4 text-center">CP Rating</th>
                <th className="py-3 px-4 text-center">Problems Solved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentClassroom.leaderboard?.map((s) => (
                <tr key={s.userId} className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-center font-bold text-slate-500">{s.rank}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    <Link
                      to={`/profile/${s.username}`}
                      className="hover:text-indigo-600 hover:underline"
                    >
                      {s.username}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-indigo-700">
                    {s.rating}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-emerald-700 font-semibold">
                    {s.problemsSolved}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assigned Curriculum */}
      {activeTab === "curriculum" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentClassroom.assignedCourses?.map((cId) => {
            const course = mockData.courses.find((c) => c.id === cId);
            if (!course) return null;
            return (
              <div key={course.id} className="edu-card p-5 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                    {course.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2">{course.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{course.description}</p>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">{course.totalLessons} lessons</span>
                  <Link
                    to={`/courses/${course.id}`}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium"
                  >
                    Open Course
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
