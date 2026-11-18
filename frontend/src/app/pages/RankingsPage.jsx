import React, { useState } from "react";
import { Link } from "@/app/router-compat";
import mockData from "../data/mockData";
import { getCountryFlag } from "../data/countries";
import { getRatingColor } from "../utils/helpers";
import { Search, Trophy } from "lucide-react";

export default function RankingsPage() {
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");

  const users = [...mockData.users].sort((a, b) => b.rating - a.rating);
  const countries = ["All", ...Array.from(new Set(users.map((u) => u.country))).filter(Boolean)];

  const filtered = users.filter((u) => {
    if (search && !u.username.toLowerCase().includes(search.toLowerCase())) return false;
    if (countryFilter !== "All" && u.country !== countryFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Global Rating Standings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Official Elo competitive programming leaderboard updated after each rated round.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search handle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Modern High-Density Table */}
      <div className="cp-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="cp-table">
            <thead>
              <tr>
                <th className="w-16 text-center">Rank</th>
                <th>Coder Handle</th>
                <th>Country &amp; Affiliation</th>
                <th className="text-center">Current Rating</th>
                <th className="text-center">Max Rating</th>
                <th className="text-center">Problems Solved</th>
                <th className="text-right">Contests</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} className={u.id === "u1" ? "bg-blue-950/20" : ""}>
                  <td className="text-center font-mono font-bold text-slate-400">
                    {i === 0 ? "🥇 1" : i === 1 ? "🥈 2" : i === 2 ? "🥉 3" : i + 1}
                  </td>

                  <td>
                    <Link
                      to={`/profile/${u.username}`}
                      className={`font-bold hover:underline ${getRatingColor(u.rating)}`}
                    >
                      {u.username}
                    </Link>
                    <span className="text-[11px] text-slate-500 ml-2">({u.displayName})</span>
                  </td>

                  <td className="text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <span>{getCountryFlag(u.country)}</span>
                      <span>{u.country}</span>
                    </span>
                    {u.university && <span className="text-slate-500"> • {u.university}</span>}
                  </td>

                  <td className="text-center font-mono font-bold text-sm">
                    <span className={getRatingColor(u.rating)}>{u.rating}</span>
                  </td>

                  <td className="text-center font-mono text-xs text-slate-500">{u.maxRating}</td>

                  <td className="text-center font-mono text-xs text-slate-200">
                    {u.problemsSolved?.toLocaleString()}
                  </td>

                  <td className="text-right font-mono text-xs text-slate-300">
                    {u.contestsParticipated} rounds
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
