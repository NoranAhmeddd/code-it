import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getRatingColor } from '../utils/helpers';
import PlatformSwitchBar from '../components/PlatformSwitchBar';
import {
  Code2,
  Trophy,
  BarChart2,
  User,
  Search,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export default function MainLayout() {
  const { platformMode, currentUser, userRole } = useApp();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const isCP = platformMode === 'competitive';

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/problems?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isCP ? 'mode-competitive' : 'mode-education'}`}>
      {/* Top Switcher Banner */}
      <PlatformSwitchBar />

      {/* ========================================================
          MODERN COMPETITIVE ARENA HEADER & NAVIGATION
          ======================================================== */}
      {isCP && (
        <header className="bg-[#0f172a] border-b border-slate-800 text-slate-100 shadow-sm sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="flex items-center space-x-2.5 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
                  <Sparkles size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent">
                    CodeArena
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider -mt-0.5">
                    JUDGE &amp; CONTESTS
                  </span>
                </div>
              </Link>

              {/* Navigation Links */}
              <nav className="flex items-center space-x-1 text-xs font-semibold">
                {[
                  { to: '/dashboard', label: 'Home' },
                  { to: '/contests', label: 'Contests' },
                  { to: '/problems', label: 'Problemset' },
                  { to: '/rankings', label: 'Standings' },
                  { to: '/blogs', label: 'Blogs' },
                  { to: '/contribute', label: 'Contribute' },
                  { to: `/profile/${currentUser?.username || 'tourist'}`, label: 'Profile' },
                ].map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-md transition ${
                        isActive
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}

                {userRole === 'admin' && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-md transition ${
                        isActive
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30 font-bold'
                          : 'text-red-400 hover:bg-red-950/40'
                      }`
                    }
                  >
                    Admin
                  </NavLink>
                )}
              </nav>
            </div>

            {/* Right: Search & User Handle */}
            <div className="flex items-center space-x-4 text-xs">
              <form onSubmit={handleSearch} className="relative hidden md:block">
                <Search size={14} className="absolute left-2.5 top-2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search problem or tag..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48 lg:w-64 transition"
                />
              </form>

              <div className="flex items-center space-x-3 border-l border-slate-800 pl-4">
                <div className="text-right">
                  <Link
                    to={`/profile/${currentUser?.username || 'tourist'}`}
                    className={`font-bold hover:underline block leading-tight ${getRatingColor(currentUser?.rating)}`}
                  >
                    {currentUser?.username}
                  </Link>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {currentUser?.rating} ({currentUser?.rank})
                  </span>
                </div>

                <Link
                  to={`/profile/${currentUser?.username || 'tourist'}`}
                  className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center font-bold text-slate-300 hover:ring-2 hover:ring-blue-500 transition"
                >
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{currentUser?.username?.slice(0, 1).toUpperCase()}</span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* ========================================================
          STANDARD EDUCATIONAL LMS HEADER & NAVIGATION
          ======================================================== */}
      {!isCP && (
        <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link to="/courses" className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                  <GraduationCap size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-slate-900 tracking-tight leading-none">
                    Algorithms Academy
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">
                    Learning Management System
                  </span>
                </div>
              </Link>

              <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
                <NavLink
                  to="/courses"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-md transition ${
                      isActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  Courses
                </NavLink>
                <NavLink
                  to="/assignments"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-md transition ${
                      isActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  Assignments
                </NavLink>
                <NavLink
                  to="/classroom"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-md transition ${
                      isActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  Classrooms
                </NavLink>

                {(userRole === 'teacher' || userRole === 'admin') && (
                  <NavLink
                    to="/teacher/courses"
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-md transition ${
                        isActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`
                    }
                  >
                    Teacher Hub
                  </NavLink>
                )}
              </nav>
            </div>

            <div className="flex items-center space-x-4 text-xs">
              <div className="hidden sm:flex flex-col text-right">
                <span className="font-semibold text-slate-800">{currentUser?.displayName}</span>
                <span className="text-slate-500 capitalize">{userRole} • {currentUser?.university || 'Member'}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-700 text-white font-semibold flex items-center justify-center text-xs shadow-sm">
                {currentUser?.displayName?.slice(0, 1)}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Page Area */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Dual Footer */}
      {isCP ? (
        <footer className="bg-[#0b0f19] border-t border-slate-800 text-center text-xs text-slate-500 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div>
              <strong className="text-slate-300">CodeArena Competitive System</strong> • Next-Gen Competitive Programming Judge
            </div>
            <div className="font-mono text-[11px] text-slate-500">
              Live automated judging &amp; rated competitions
            </div>
          </div>
        </footer>
      ) : (
        <footer className="bg-slate-900 text-slate-400 text-xs py-6 mt-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div>
              &copy; 2026 Algorithms Academy LMS. Computer science learning platform.
            </div>
            <div className="flex space-x-4">
              <Link to="/courses" className="hover:text-white transition">Courses</Link>
              <Link to="/assignments" className="hover:text-white transition">Assignments</Link>
              <Link to="/classroom" className="hover:text-white transition">Cohorts</Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
