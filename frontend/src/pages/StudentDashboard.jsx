import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import mockData from '../data/mockData';
import { getRatingColor, formatDate } from '../utils/helpers';
import { useApp } from '../context/AppContext';
import {
  Search,
  MessageSquare,
  Trophy,
  Flame,
  ArrowRight,
  TrendingUp,
  Radio,
  ExternalLink,
} from 'lucide-react';

export default function StudentDashboard() {
  const { currentUser, blogs } = useApp();
  const navigate = useNavigate();

  const user = currentUser || mockData.users[0];
  const upcomingContest = mockData.contests.find((c) => c.status === 'upcoming') || mockData.contests[0];
  const activeContest = mockData.contests.find((c) => c.status === 'active');
  const pastContests = mockData.contests.filter((c) => c.status === 'past').slice(0, 5);

  const [userQuery, setUserQuery] = useState('');
  const [searchError, setSearchError] = useState('');

  const handleUserSearch = (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    const target = mockData.users.find(
      (u) => u.username.toLowerCase() === userQuery.trim().toLowerCase()
    );
    if (target) {
      navigate(`/profile/${target.username}`);
    } else {
      setSearchError(`User "${userQuery.trim()}" not found.`);
      setTimeout(() => setSearchError(''), 3000);
    }
  };

  const adminBlogs = (blogs && blogs.length > 0 ? blogs : mockData.blogs || []).filter(
    (b) => b.status === 'approved'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* 1. Top Highlights Bar: User Rating + Active Contests */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="cp-card p-5 flex items-center justify-between border-l-4 border-l-blue-500">
          <div>
            <div className="text-[11px] font-mono uppercase text-slate-400">Current Rating</div>
            <div className={`text-2xl font-extrabold font-mono mt-0.5 ${getRatingColor(user.rating)}`}>
              {user.rating}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">{user.rank}</div>
          </div>
          <Trophy size={28} className="text-blue-500/40" />
        </div>

        <div className="cp-card p-5 flex items-center justify-between border-l-4 border-l-emerald-500">
          <div>
            <div className="text-[11px] font-mono uppercase text-slate-400">Global Ranking</div>
            <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-0.5">
              #{user.globalRank || 1}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Top 0.05% Worldwide</div>
          </div>
          <TrendingUp size={28} className="text-emerald-500/40" />
        </div>

        <div className="cp-card p-5 flex items-center justify-between border-l-4 border-l-amber-500">
          <div>
            <div className="text-[11px] font-mono uppercase text-slate-400">Active Streak</div>
            <div className="text-2xl font-extrabold font-mono text-amber-400 mt-0.5">
              {user.streak || 47} Days
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Consecutive solves</div>
          </div>
          <Flame size={28} className="text-amber-500/40" />
        </div>

        <div className="cp-card p-5 flex items-center justify-between border-l-4 border-l-purple-500">
          <div>
            <div className="text-[11px] font-mono uppercase text-slate-400">Problems Solved</div>
            <div className="text-2xl font-extrabold font-mono text-purple-400 mt-0.5">
              {user.problemsSolved?.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">In {user.contestsParticipated} contests</div>
          </div>
          <div className="text-purple-400 font-mono font-bold text-lg">AC</div>
        </div>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Live Contest Banner */}
          {activeContest ? (
            <div className="rounded-xl border border-red-500/40 bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 p-6 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-mono font-semibold uppercase">
                    <Radio size={13} className="animate-pulse" />
                    <span>Live Contest Underway</span>
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight mt-2">
                    {activeContest.name}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Remaining duration: 1 hour 4 minutes • {activeContest.participantCount} active competitors
                  </p>
                </div>

                <Link
                  to={`/contests/${activeContest.id}`}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition shadow-lg shadow-red-600/30 flex items-center space-x-1.5 self-start sm:self-auto shrink-0"
                >
                  <span>Enter Contest Console</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="cp-card p-4 text-xs text-slate-400 flex items-center justify-between">
              <span>No live contest running currently.</span>
              <Link to="/contests" className="text-blue-400 hover:underline font-semibold">
                Check contest calendar &rarr;
              </Link>
            </div>
          )}

          {/* Admin Editorial Blogs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Official Announcements &amp; Editorials
              </h2>
              <Link to="/blogs" className="text-[11px] text-blue-400 hover:underline font-mono">
                View All Blogs &rarr;
              </Link>
            </div>

            <div className="space-y-4">
              {adminBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="cp-card p-6 space-y-3 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-bold border border-red-500/20 text-[10px] uppercase">
                        {blog.author}
                      </span>
                      <span>•</span>
                      <span>{blog.date}</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-500">#{blog.id}</span>
                  </div>

                  <Link
                    to={`/blogs/${blog.id}`}
                    className="text-base font-bold text-white hover:text-blue-400 transition leading-snug block"
                  >
                    {blog.title}
                  </Link>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {blog.summary}
                  </p>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <Link
                      to={`/blogs/${blog.id}`}
                      className="text-blue-400 hover:underline font-medium flex items-center space-x-1"
                    >
                      <span>Read Editorial Discussion</span>
                      <ArrowRight size={12} />
                    </Link>
                    <span className="flex items-center space-x-1 text-slate-500">
                      <MessageSquare size={13} />
                      <span>{blog.commentsCount || (blog.comments || []).length} comments</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Contests Quick Overview Table */}
          <div className="cp-card overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200 uppercase tracking-wider">
                Recent Past Contests
              </span>
              <Link to="/contests" className="text-blue-400 hover:underline font-semibold">
                View All Contests &rarr;
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="cp-table">
                <thead>
                  <tr>
                    <th>Contest Name</th>
                    <th className="text-center">Type</th>
                    <th className="text-center">Date</th>
                    <th className="text-center">Participants</th>
                    <th className="text-center">Results</th>
                  </tr>
                </thead>
                <tbody>
                  {pastContests.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <Link to={`/contests/${c.id}`} className="font-semibold text-blue-400 hover:underline">
                          {c.name}
                        </Link>
                      </td>
                      <td className="text-center font-mono text-xs text-slate-400">{c.type}</td>
                      <td className="text-center font-mono text-xs text-slate-400">{formatDate(c.startTime)}</td>
                      <td className="text-center font-mono text-xs text-slate-300">{c.participantCount?.toLocaleString()}</td>
                      <td className="text-center">
                        <Link
                          to={`/contests/${c.id}`}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded transition"
                        >
                          Standings
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Sidebar Column (1/3 width) */}
        <div className="space-y-6">

          {/* User Search Card */}
          <div className="cp-card p-5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2 flex items-center space-x-2">
              <Search size={14} className="text-blue-400" />
              <span>Find Coder Profile</span>
            </div>

            <form onSubmit={handleUserSearch} className="space-y-3">
              <input
                type="text"
                placeholder="Enter handle (tourist, jiangly...)"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />

              {searchError && (
                <div className="text-[11px] text-red-400 font-semibold">{searchError}</div>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition shadow-md shadow-blue-600/20"
              >
                Search Coder &rarr;
              </button>
            </form>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
              Popular handles:{' '}
              {['tourist', 'jiangly', 'ksun48', 'Um_nik'].map((h) => (
                <Link key={h} to={`/profile/${h}`} className="text-blue-400 hover:underline mr-1 font-mono">
                  {h},
                </Link>
              ))}
            </div>
          </div>

          {/* Next Scheduled Contest */}
          <div className="cp-card p-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Next Rated Round</span>
              <Trophy size={14} className="text-amber-400" />
            </div>

            <div>
              <Link
                to={`/contests/${upcomingContest.id}`}
                className="text-sm font-bold text-white hover:text-blue-400 leading-snug block transition"
              >
                {upcomingContest.name}
              </Link>
              <div className="text-xs text-slate-400 mt-1">
                Start: <strong className="text-slate-200">{formatDate(upcomingContest.startTime)}</strong>
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                Type: {upcomingContest.type} • 2h duration
              </div>
            </div>

            <Link
              to={`/contests/${upcomingContest.id}`}
              className="block w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center rounded-lg transition shadow-md shadow-emerald-600/20"
            >
              Register for Contest
            </Link>
          </div>

          {/* Top Competitors Leaderboard */}
          <div className="cp-card overflow-hidden">
            <div className="p-4 border-b border-slate-800 text-xs font-bold text-slate-300 uppercase tracking-wider">
              Top Ranked Coders
            </div>
            <table className="cp-table text-xs">
              <thead>
                <tr>
                  <th className="w-10">#</th>
                  <th>Handle</th>
                  <th className="text-right">Rating</th>
                </tr>
              </thead>
              <tbody>
                {mockData.users.slice(0, 7).map((u, i) => (
                  <tr key={u.id}>
                    <td className="font-mono text-slate-500 text-center">{i + 1}</td>
                    <td>
                      <Link
                        to={`/profile/${u.username}`}
                        className={`font-semibold hover:underline ${getRatingColor(u.rating)}`}
                      >
                        {u.username}
                      </Link>
                    </td>
                    <td className="text-right font-mono font-bold text-slate-200">{u.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}
