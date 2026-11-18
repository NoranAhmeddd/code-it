import React, { useEffect, useState } from "react";
import { NavLink, Link, Outlet, useNavigate, useLocation } from "@/app/router-compat";
import { useApp } from "../context/AppContext";
import { getRatingColor } from "../utils/helpers";
import PlatformSwitchBar from "../components/PlatformSwitchBar";
import {
  Code2,
  Trophy,
  BarChart2,
  User,
  Search,
  GraduationCap,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

export default function MainLayout() {
  const { platformMode, currentUser, userRole } = useApp();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const isCP = platformMode === "competitive";

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/problems?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isCP ? "mode-competitive" : "mode-education"}`}>
      {/* Top Switcher Banner */}
      <PlatformSwitchBar />

      {/* ========================================================
          MODERN COMPETITIVE ARENA HEADER & NAVIGATION
          ======================================================== */}
      {isCP && (
        <ArenaHeader
          search={search}
          setSearch={setSearch}
          onSearch={handleSearch}
          currentUser={currentUser}
          userRole={userRole}
        />
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
                      isActive
                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`
                  }
                >
                  Courses
                </NavLink>
                <NavLink
                  to="/assignments"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-md transition ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`
                  }
                >
                  Assignments
                </NavLink>
                <NavLink
                  to="/classroom"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-md transition ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`
                  }
                >
                  Classrooms
                </NavLink>

                {(userRole === "teacher" || userRole === "admin") && (
                  <NavLink
                    to="/teacher/courses"
                    className={({ isActive }) =>
                      `px-3 py-1.5 rounded-md transition ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700 font-semibold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
                <span className="text-slate-500 capitalize">
                  {userRole} • {currentUser?.university || "Member"}
                </span>
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
        <footer className="arena-glass border-t text-center text-xs text-slate-400 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div>
              <strong className="text-slate-300">CodeArena Competitive System</strong> • Next-Gen
              Competitive Programming Judge
            </div>
            <div className="font-mono text-[11px] text-slate-500">
              Live automated judging &amp; rated competitions
            </div>
          </div>
        </footer>
      ) : (
        <footer className="bg-slate-900 text-slate-400 text-xs py-6 mt-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div>&copy; 2026 Algorithms Academy LMS. Computer science learning platform.</div>
            <div className="flex space-x-4">
              <Link to="/courses" className="hover:text-white transition">
                Courses
              </Link>
              <Link to="/assignments" className="hover:text-white transition">
                Assignments
              </Link>
              <Link to="/classroom" className="hover:text-white transition">
                Cohorts
              </Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

function ArenaHeader({ search, setSearch, onSearch, currentUser, userRole }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  useEffect(() => setOpen(false), [pathname]);
  const profile = `/profile/${currentUser?.username || "tourist"}`;
  const items = [
    { to: "/dashboard", label: "Home" },
    { to: "/contests", label: "Contests" },
    { to: "/problems", label: "Problemset" },
    { to: "/rankings", label: "Standings" },
    { to: "/blogs", label: "Blogs" },
    { to: "/contribute", label: "Contribute" },
    { to: profile, label: "Profile" },
    ...(userRole === "admin" ? [{ to: "/admin", label: "Admin" }] : []),
  ];
  const isActive = (to) => pathname === to || pathname.startsWith(`${to}/`);
  const submit = (e) => {
    onSearch(e);
    setOpen(false);
  };

  return (
    <header className="arena-glass sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        <Link to="/dashboard" className="flex min-w-0 items-center gap-2.5 group shrink-0">
          <div className="arena-logo w-9 h-9 shrink-0 rounded-xl flex items-center justify-center group-hover:rotate-6 group-hover:scale-105 transition">
            <Sparkles size={17} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="arena-gradient-text font-bold text-lg tracking-tight">CodeArena</span>
            <span className="text-[10px] text-slate-400 font-mono tracking-[0.2em] mt-1 hidden sm:block">
              JUDGE · CONTESTS
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-[13px] font-medium">
          {items.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              data-active={isActive(it.to)}
              className="arena-nav-link px-3 py-2 rounded-lg"
            >
              {it.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <form onSubmit={submit} className="relative hidden md:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="arena-input rounded-xl pl-8 pr-3 py-2 text-xs w-40 xl:w-56 focus:w-56 xl:focus:w-64 transition-all"
            />
          </form>
          <Link
            to={profile}
            className="flex items-center gap-2.5 rounded-xl px-1.5 py-1 hover:bg-white/5"
          >
            <div className="text-right hidden sm:block">
              <span
                className={`font-bold block leading-tight text-sm ${getRatingColor(currentUser?.rating)}`}
              >
                {currentUser?.username}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{currentUser?.rating}</span>
            </div>
            <div className="w-9 h-9 shrink-0 rounded-xl overflow-hidden ring-1 ring-white/10 hover:ring-2 hover:ring-blue-400 flex items-center justify-center font-bold">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{currentUser?.username?.slice(0, 1).toUpperCase()}</span>
              )}
            </div>
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center ring-1 ring-white/10 hover:bg-white/5"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="arena-drawer lg:hidden border-t border-white/5 px-4 pb-5 pt-3">
          <form onSubmit={submit} className="relative md:hidden mb-3">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="arena-input w-full rounded-xl pl-9 pr-3 py-2.5 text-sm"
            />
          </form>
          <nav className="grid grid-cols-2 gap-2 text-sm font-medium">
            {items.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                data-active={isActive(it.to)}
                className="arena-nav-link px-3 py-3 rounded-xl ring-1 ring-white/5"
              >
                {it.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
