import React, { useState } from "react";
import { Link } from "@/app/router-compat";
import mockData from "../data/mockData";
import { Search, BookOpen, Clock, Users, Star, ChevronRight } from "lucide-react";

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const categories = [
    "All",
    "Fundamentals",
    "Data Structures",
    "Graph Theory",
    "Dynamic Programming",
  ];

  const filtered = mockData.courses.filter((c) => {
    if (selectedCategory !== "All" && c.category !== selectedCategory) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8 space-y-6">
      {/* Standard LMS Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">Course Catalog</h1>
        <p className="text-sm text-slate-600 mt-1">
          Structured academic courses covering competitive programming, data structures, and
          algorithmic proofs.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search course title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
          />
        </div>
      </div>

      {/* Standard Academic Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((course) => (
          <div
            key={course.id}
            className="edu-card-interactive flex flex-col justify-between p-5 space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {course.category}
                </span>
                <span className="text-slate-500 capitalize">{course.difficulty}</span>
              </div>

              <h2 className="text-base font-bold text-slate-900 leading-snug">{course.title}</h2>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {course.description}
              </p>

              <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>
                  Instructor: <strong className="text-slate-700">{course.instructor}</strong>
                </span>
                <span className="flex items-center space-x-1 text-amber-600 font-semibold">
                  <Star size={13} fill="#d97706" />
                  <span>{course.rating}</span>
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">
                {course.totalLessons} lessons • {course.duration}
              </span>
              <Link
                to={`/courses/${course.id}`}
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded shadow-sm transition"
              >
                <span>View Syllabus</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
