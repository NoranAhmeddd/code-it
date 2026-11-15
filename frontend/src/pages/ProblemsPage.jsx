import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import mockData from '../data/mockData';
import { getRatingColor } from '../utils/helpers';
import { Search, Filter, Tag, CheckCircle } from 'lucide-react';

export default function ProblemsPage() {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const allTags = [
    'All',
    'DP',
    'Graphs',
    'Greedy',
    'Binary Search',
    'Data Structures',
    'Math',
    'Strings',
    'Trees',
    'Two Pointers',
    'Segment Tree',
  ];

  const filtered = mockData.problems.filter((p) => {
    if (search) {
      const q = search.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.id.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (selectedTag !== 'All' && !p.tags.includes(selectedTag)) {
      return false;
    }
    if (selectedDifficulty !== 'All' && p.difficulty !== selectedDifficulty) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Problem Archive
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Curated archive of competitive programming challenges categorized by algorithmic tags and rating tiers.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search problem or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Tiers</option>
            <option value="easy">Easy (800-1400)</option>
            <option value="medium">Medium (1400-2000)</option>
            <option value="hard">Hard (2000+)</option>
          </select>
        </div>
      </div>

      {/* Filter Tag Pills */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-xs text-slate-400 font-mono mr-1">Filter Tags:</span>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
              selectedTag === tag
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Sleek Modern Problem Table */}
      <div className="cp-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="cp-table">
            <thead>
              <tr>
                <th className="w-16 text-center">ID</th>
                <th>Problem Title</th>
                <th className="w-28 text-center">Rating Tier</th>
                <th>Tags</th>
                <th className="w-36 text-center">Submissions</th>
                <th className="w-24 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((prob) => (
                <tr key={prob.id}>
                  <td className="text-center font-mono font-bold text-blue-400">
                    {prob.id}
                  </td>

                  <td>
                    <Link
                      to={`/problems/${prob.id}`}
                      className="font-semibold text-white hover:text-blue-400 block transition"
                    >
                      {prob.title}
                    </Link>
                    <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {prob.statement}
                    </span>
                  </td>

                  <td className="text-center font-mono font-bold text-sm">
                    <span className={getRatingColor(prob.rating)}>
                      {prob.rating}
                    </span>
                  </td>

                  <td>
                    <div className="flex flex-wrap gap-1 text-[11px]">
                      {prob.tags.map((t) => (
                        <span
                          key={t}
                          onClick={() => setSelectedTag(t)}
                          className="cursor-pointer text-slate-300 bg-slate-800/80 hover:bg-slate-700 px-2 py-0.5 rounded border border-slate-700 text-[10px] font-mono transition"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="text-center text-xs font-mono text-slate-300">
                    <span>{prob.accepted?.toLocaleString()}</span>
                    <span className="text-slate-500 text-[10px] block">/ {prob.submissions?.toLocaleString()}</span>
                  </td>

                  <td className="text-right">
                    <Link
                      to={`/problems/${prob.id}`}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold shadow-sm transition inline-block"
                    >
                      Solve
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
