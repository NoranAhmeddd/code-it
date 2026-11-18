import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import mockData from '../data/mockData';
import { getCountryFlag } from '../data/countries';
import { getRatingColor } from '../utils/helpers';
import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const { setPlatformMode } = useApp();

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#222] font-sans">
      {/* Codeforces Style Classic Top Header */}
      <header className="bg-white border-b border-[#b9b9b9]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-end space-x-0.5 h-8">
              <div className="w-3 h-5 bg-yellow-500 rounded-xs"></div>
              <div className="w-3 h-7 bg-blue-600 rounded-xs"></div>
              <div className="w-3 h-8 bg-red-600 rounded-xs"></div>
            </div>
            <div>
              <span className="font-extrabold text-2xl text-[#1b2a4a] tracking-tight">
                CODE<span className="text-[#3b5998]">ARENA</span>
              </span>
              <div className="text-[10px] text-gray-500 font-serif">
                Competitive Programming Online Judge &amp; University LMS
              </div>
            </div>
          </div>

          {/* Quick Dual Platform Direct Jump */}
          <div className="flex items-center space-x-3">
            <Link
              to="/dashboard"
              onClick={() => setPlatformMode('competitive')}
              className="px-4 py-2 bg-[#3182ce] hover:bg-[#2b6cb0] text-white font-bold text-xs rounded transition shadow-sm"
            >
              Enter Competitive Arena &rarr;
            </Link>
            <Link
              to="/courses"
              onClick={() => setPlatformMode('education')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded transition shadow-sm"
            >
              Go to LMS Education &rarr;
            </Link>
          </div>
        </div>

        {/* Menu bar */}
        <div className="bg-[#f0f0f0] border-t border-[#b9b9b9]">
          <div className="max-w-7xl mx-auto px-4 flex items-center space-x-1 text-xs font-semibold text-gray-700">
            <Link to="/dashboard" className="px-4 py-2 border-r border-[#d0d0d0] hover:bg-white">
              HOME
            </Link>
            <Link to="/contests" className="px-4 py-2 border-r border-[#d0d0d0] hover:bg-white">
              CONTESTS
            </Link>
            <Link to="/problems" className="px-4 py-2 border-r border-[#d0d0d0] hover:bg-white">
              PROBLEMSET
            </Link>
            <Link to="/courses" className="px-4 py-2 border-r border-[#d0d0d0] hover:bg-white">
              COURSES (LMS)
            </Link>
            <Link to="/rankings" className="px-4 py-2 border-r border-[#d0d0d0] hover:bg-white">
              LEADERBOARD
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Dual Mode Switcher Announcement Box */}
        <div className="cf-roundbox p-6 bg-white border-2 border-[#3182ce] space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0055aa] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Two Purpose-Built Interfaces in One Unified System
              </span>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">
                A Codeforces-Caliber Judge Connected to an Academic LMS
              </h1>
              <p className="text-xs text-gray-700 mt-1 max-w-3xl leading-relaxed">
                Seamlessly toggle at the very top of any page between the <strong>Competitive Judge</strong> (dense problem tables, rating progression curves, ICPC live standings, code submissions) and the <strong>Educational LMS</strong> (structured courses, curriculum videos, assignments, and cohort progress).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Link
                to="/dashboard"
                onClick={() => setPlatformMode('competitive')}
                className="px-4 py-2.5 bg-[#0055aa] hover:bg-[#004088] text-white text-xs font-bold rounded text-center shadow-sm"
              >
                1. Open Competitive Judge
              </Link>
              <Link
                to="/courses"
                onClick={() => setPlatformMode('education')}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded text-center shadow-sm"
              >
                2. Open Standard LMS
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Column Landing Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2 Cols: Live Problems & Contests */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Problems Table */}
            <div className="cf-roundbox overflow-hidden">
              <div className="bg-[#f0f0f0] border-b border-[#b9b9b9] px-4 py-2 flex justify-between items-center text-xs font-bold text-gray-800">
                <span>RECENT PROBLEMS ARCHIVE</span>
                <Link to="/problems" className="text-[#0055aa] hover:underline font-normal">
                  View all 1,247 problems &rarr;
                </Link>
              </div>
              <table className="cf-table text-xs">
                <thead>
                  <tr>
                    <th className="w-16">#</th>
                    <th>Problem Name</th>
                    <th className="w-24 text-center">Rating</th>
                    <th>Tags</th>
                    <th className="w-20 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.problems.slice(0, 7).map((p) => (
                    <tr key={p.id}>
                      <td className="text-center font-mono font-bold text-[#0055aa]">{p.id}</td>
                      <td>
                        <Link to={`/problems/${p.id}`} className="text-[#0055aa] font-semibold hover:underline">
                          {p.title}
                        </Link>
                      </td>
                      <td className="text-center font-mono font-bold">
                        <span className={getRatingColor(p.rating)}>{p.rating}</span>
                      </td>
                      <td className="text-gray-600 text-[11px]">{p.tags.join(', ')}</td>
                      <td className="text-center">
                        <Link
                          to={`/problems/${p.id}`}
                          className="px-2 py-0.5 bg-[#e6f0fa] hover:bg-[#d0dfef] text-[#0055aa] rounded text-xs font-semibold"
                        >
                          Submit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Featured Educational Courses Grid */}
            <div className="cf-roundbox p-5 space-y-3">
              <div className="flex justify-between items-center border-b border-[#e1e4e8] pb-2 text-xs font-bold text-gray-800">
                <span>ACADEMIC COURSEWARE (LMS)</span>
                <Link to="/courses" className="text-[#0055aa] hover:underline font-normal">
                  Explore full syllabus &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {mockData.courses.slice(0, 4).map((c) => (
                  <div key={c.id} className="p-3 border border-[#d0d0d0] rounded bg-[#fafafa] space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold uppercase text-[#0055aa]">{c.category}</span>
                    <h3 className="font-bold text-gray-900">{c.title}</h3>
                    <p className="text-gray-600 line-clamp-2 text-[11px]">{c.description}</p>
                    <div className="pt-2 flex justify-between items-center text-gray-500 text-[11px]">
                      <span>{c.totalLessons} lessons</span>
                      <Link to={`/courses/${c.id}`} className="text-[#0055aa] font-semibold hover:underline">
                        Syllabus &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Codeforces Sideboxes */}
          <div className="space-y-6">
            {/* Top Programmers Box */}
            <div className="cf-roundbox overflow-hidden">
              <div className="bg-[#f0f0f0] border-b border-[#b9b9b9] px-3 py-1.5 text-xs font-bold text-gray-800">
                TOP RATED COMPETITORS
              </div>
              <table className="cf-table text-xs">
                <thead>
                  <tr>
                    <th className="w-8">#</th>
                    <th>User</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.users.slice(0, 8).map((u, i) => (
                    <tr key={u.id}>
                      <td className="text-center font-mono text-gray-500">{i + 1}</td>
                      <td>
                        <Link
                          to={`/profile/${u.username}`}
                          className={`font-semibold hover:underline ${getRatingColor(u.rating)}`}
                        >
                          {u.username}
                        </Link>
                        <span className="text-gray-500 text-[11px] ml-2 inline-flex items-center gap-1">
                          <span>{getCountryFlag(u.country)}</span>
                          <span>{u.country}</span>
                        </span>
                      </td>
                      <td className="font-mono font-bold text-gray-800">{u.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Upcoming Contest Card */}
            <div className="cf-roundbox p-4 space-y-2 text-xs">
              <div className="font-bold text-gray-800 uppercase border-b border-[#e1e4e8] pb-1">
                UPCOMING CONTEST
              </div>
              <Link to="/contests" className="font-bold text-[#0055aa] hover:underline block text-sm leading-snug">
                {mockData.contests[0]?.name}
              </Link>
              <div className="text-gray-600 font-mono text-[11px]">
                Type: {mockData.contests[0]?.type} • Duration: 2 hours
              </div>
              <Link
                to={`/contests/${mockData.contests[0]?.id}`}
                className="block text-center w-full py-1.5 bg-[#3182ce] hover:bg-[#2b6cb0] text-white font-bold rounded transition"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
