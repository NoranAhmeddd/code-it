import React, { useState } from "react";
import { Link } from "@/app/router-compat";
import mockData from "../data/mockData";
import { Users, Search, ExternalLink } from "lucide-react";
import { getRatingColor } from "../utils/helpers";

export default function TeacherStudentsPage() {
  const [search, setSearch] = useState("");
  const students = mockData.users.filter((u) => u.id !== "u13");

  const filtered = students.filter(
    (s) =>
      s.username.toLowerCase().includes(search.toLowerCase()) ||
      s.displayName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">Cohort Students &amp; Performance</h1>
        <p className="text-sm text-slate-600 mt-1">
          Review enrolled student progress across courses, homework assignments, and practice
          contest ratings.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-xs">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search student handle or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400"
          />
        </div>
        <span className="text-xs text-slate-500 font-mono">
          {filtered.length} students enrolled
        </span>
      </div>

      {/* Table */}
      <div className="edu-card overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">University / Organization</th>
              <th className="py-3 px-4 text-center">CP Rating</th>
              <th className="py-3 px-4 text-center">Problems Solved</th>
              <th className="py-3 px-4 text-center">Course Grade Avg</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{s.username}</div>
                  <div className="text-[11px] text-slate-500">{s.displayName}</div>
                </td>
                <td className="py-3 px-4 text-slate-600">
                  {s.university || "Independent Student"}
                </td>
                <td className="py-3 px-4 text-center font-mono font-bold">
                  <span className={getRatingColor(s.rating)}>{s.rating}</span>
                </td>
                <td className="py-3 px-4 text-center font-mono text-slate-700">
                  {s.problemsSolved?.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-center font-mono text-emerald-700 font-semibold">
                  {Math.floor(82 + (s.rating % 18))}%
                </td>
                <td className="py-3 px-4 text-right">
                  <Link
                    to={`/profile/${s.username}`}
                    className="text-indigo-600 hover:underline font-semibold"
                  >
                    View Record
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
