import React, { useState } from "react";
import { Link } from "@/app/router-compat";
import mockData from "../data/mockData";
import { formatDate, formatDuration } from "../utils/helpers";
import { Search, Radio, Trophy, ArrowRight, Calendar, Users, Clock } from "lucide-react";

export default function ContestsPage() {
  const [participantSearch, setParticipantSearch] = useState("");

  const activeContests = mockData.contests.filter((c) => c.status === "active");
  const upcomingContests = mockData.contests.filter((c) => c.status === "upcoming");
  const pastContests = mockData.contests.filter((c) => c.status === "past");

  const standings = mockData.contestStandings || [];
  const filteredStandings = standings.filter(
    (s) =>
      s.username.toLowerCase().includes(participantSearch.toLowerCase()) ||
      s.country.toLowerCase().includes(participantSearch.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Page Title */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Rated Contests Arena</h1>
        <p className="text-xs text-slate-400 mt-1">
          Participate in algorithmic showdowns, compete against international coders, and adjust
          your global rating.
        </p>
      </div>

      {/* ========================================================
          PART 1: CURRENT & UPCOMING CONTESTS
          ======================================================== */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-blue-400">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span>Part 1: Current &amp; Upcoming Contests</span>
        </div>

        {/* Live Contest Highlight Card */}
        {activeContests.length > 0 && (
          <div className="space-y-4">
            {activeContests.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-red-500/30 bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 p-6 space-y-5 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-red-900/50 pb-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-mono font-semibold uppercase">
                      <Radio size={13} className="animate-pulse" />
                      <span>Live Contest Underway</span>
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight mt-1">{c.name}</h2>
                    <div className="text-xs text-slate-400">
                      Standard ICPC Penalty Scoring • 5 Algorithmic Problems • 2 Hours Duration
                    </div>
                  </div>

                  <Link
                    to={`/contests/${c.id}`}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition shadow-lg shadow-red-600/30 flex items-center space-x-1.5 self-start sm:self-auto shrink-0"
                  >
                    <span>Enter Contest Arena</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Search Contestants in Contest */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Search Contestants in Live Standings:
                    </span>
                    <div className="relative w-full sm:w-72">
                      <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search contestant handle or country..."
                        value={participantSearch}
                        onChange={(e) => setParticipantSearch(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="cp-card overflow-hidden max-h-52 overflow-y-auto">
                    <table className="cp-table text-xs">
                      <thead>
                        <tr>
                          <th className="w-12 text-center">Rank</th>
                          <th>Contestant</th>
                          <th>Country</th>
                          <th className="w-20 text-center">Solved</th>
                          <th className="w-24 text-center">Penalty</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStandings.slice(0, 10).map((p) => (
                          <tr key={p.userId}>
                            <td className="text-center font-mono font-bold text-slate-400">
                              {p.rank}
                            </td>
                            <td>
                              <Link
                                to={`/profile/${p.username}`}
                                className="font-semibold text-blue-400 hover:underline"
                              >
                                {p.username}
                              </Link>
                            </td>
                            <td className="text-slate-400">{p.country}</td>
                            <td className="text-center font-mono font-bold text-emerald-400">
                              {p.solved}
                            </td>
                            <td className="text-center font-mono text-slate-400">{p.penalty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upcoming Contests Table */}
        <div className="cp-card overflow-hidden">
          <div className="p-4 border-b border-slate-800 text-xs font-bold text-slate-200 uppercase tracking-wider">
            Upcoming Scheduled Contests
          </div>
          <div className="overflow-x-auto">
            <table className="cp-table">
              <thead>
                <tr>
                  <th>Contest Title</th>
                  <th className="text-center">Division</th>
                  <th className="text-center">Start Time</th>
                  <th className="text-center">Duration</th>
                  <th className="text-center">Registered</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {upcomingContests.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link
                        to={`/contests/${c.id}`}
                        className="font-semibold text-white hover:text-blue-400 block transition"
                      >
                        {c.name}
                      </Link>
                      <span className="text-[11px] text-slate-400">{c.description}</span>
                    </td>
                    <td className="text-center">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono">
                        {c.type}
                      </span>
                    </td>
                    <td className="text-center font-mono text-xs text-slate-300">
                      {formatDate(c.startTime)}
                    </td>
                    <td className="text-center font-mono text-xs text-slate-400">
                      {formatDuration(c.duration)}
                    </td>
                    <td className="text-center font-mono text-xs text-slate-300">
                      {c.participantCount?.toLocaleString()} coders
                    </td>
                    <td className="text-right">
                      <Link
                        to={`/contests/${c.id}`}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-md transition shadow-sm inline-block"
                      >
                        Register
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================
          PART 2: PREVIOUS CONTEST ARCHIVE
          ======================================================== */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
          <span className="w-2 h-2 rounded-full bg-slate-500"></span>
          <span>Part 2: Previous Contests Archive &amp; Results</span>
        </div>

        <div className="cp-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="cp-table">
              <thead>
                <tr>
                  <th>Contest Title</th>
                  <th className="text-center">Format</th>
                  <th className="text-center">Date</th>
                  <th className="text-center">Participants</th>
                  <th className="text-center">Your Rank</th>
                  <th className="text-center">Rating Δ</th>
                  <th className="text-right">Standings</th>
                </tr>
              </thead>
              <tbody>
                {pastContests.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link
                        to={`/contests/${c.id}`}
                        className="font-semibold text-slate-200 hover:text-blue-400 transition"
                      >
                        {c.name}
                      </Link>
                    </td>
                    <td className="text-center font-mono text-xs text-slate-400">{c.type}</td>
                    <td className="text-center font-mono text-xs text-slate-400">
                      {formatDate(c.startTime)}
                    </td>
                    <td className="text-center font-mono text-xs text-slate-300">
                      {c.participantCount?.toLocaleString()}
                    </td>
                    <td className="text-center font-mono font-bold text-xs text-slate-200">
                      {c.yourRank ? `#${c.yourRank}` : "—"}
                    </td>
                    <td className="text-center font-mono font-bold text-xs">
                      {c.ratingChange ? (
                        <span className="text-emerald-400">+{c.ratingChange}</span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="text-right">
                      <Link
                        to={`/contests/${c.id}`}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded transition"
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
      </section>
    </div>
  );
}
