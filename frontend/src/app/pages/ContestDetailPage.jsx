import React, { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "@/app/router-compat";
import mockData from "../data/mockData";
import { getCountryFlag } from "../data/countries";
import { useApp } from "../context/AppContext";
import { getRatingColor } from "../utils/helpers";
import CodeViewerModal from "../components/CodeViewerModal";
import {
  Trophy,
  Users,
  UserCheck,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Code2,
  FileCode,
  Sparkles,
} from "lucide-react";

export default function ContestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, submissions: globalSubmissions, contests: customContests } = useApp();

  const allContests = customContests?.length ? customContests : mockData.contests;
  const contest = allContests.find((c) => c.id === id) || mockData.contests[0];
  const standings = mockData.contestStandings || [];

  const [activeTab, setActiveTab] = useState("problems"); // 'problems' | 'standings' | 'submissions'
  const [friendsOnly, setFriendsOnly] = useState(false);
  const [selectedSubmissionCode, setSelectedSubmissionCode] = useState(null);

  const problems = [
    { label: "A", id: "1A", title: "Two Sum Optimization", score: 500, solvedCount: 3840 },
    { label: "B", id: "2A", title: "Graph Connectivity Queries", score: 1000, solvedCount: 2910 },
    { label: "C", id: "3A", title: "Segment Tree Range Update", score: 1500, solvedCount: 1820 },
    { label: "D", id: "4A", title: "Knapsack Bounded Items", score: 2000, solvedCount: 940 },
    { label: "E", id: "5A", title: "Suffix Array & LCP", score: 2500, solvedCount: 310 },
  ];

  // Helper to determine user's submission status for a problem
  const getProblemStatus = (problemId) => {
    const subs = (globalSubmissions || mockData.submissions).filter(
      (s) =>
        s.problemId === problemId &&
        (s.username === currentUser?.username ||
          s.userId === currentUser?.id ||
          currentUser?.username === "tourist"),
    );

    if (subs.some((s) => s.verdict === "AC")) {
      return { status: "solved", label: "Accepted", color: "emerald" };
    }
    if (subs.some((s) => s.verdict === "QUEUE" || s.verdict === "PENDING")) {
      return { status: "queue", label: "In Queue", color: "amber" };
    }
    const wrongSub = subs.find((s) => ["WA", "TLE", "MLE", "RE", "CE"].includes(s.verdict));
    if (wrongSub) {
      return {
        status: "wrong",
        label:
          wrongSub.verdict === "WA"
            ? "Wrong Answer"
            : wrongSub.verdict === "TLE"
              ? "Time Limit"
              : "Failed",
        color: "rose",
      };
    }
    return { status: "unattempted", label: "Not Attempted", color: "slate" };
  };

  // Filter standings by friends
  const filteredStandings = useMemo(() => {
    if (!friendsOnly) return standings;
    const friendHandles = currentUser?.friends || ["jiangly", "ksun48", "Um_nik", "Benq"];
    return standings.filter(
      (row) => row.username === currentUser?.username || friendHandles.includes(row.username),
    );
  }, [friendsOnly, standings, currentUser]);

  const userContestSubmissions = useMemo(() => {
    const list = globalSubmissions || mockData.submissions;
    return list.filter((s) => problems.some((p) => p.id === s.problemId));
  }, [globalSubmissions]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Contest Console Header */}
      <div className="cp-card p-6 bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-mono text-blue-400 font-semibold uppercase">
            <span>{contest.type || "Div. 1 + Div. 2"} Rated Contest</span>
            <span>•</span>
            <span>ICPC Rules (20m Penalty)</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">{contest.name}</h1>
          <div className="text-xs text-slate-400">
            5 Algorithmic Problems • Live System Pretesting &amp; Rating Calculations
          </div>
        </div>

        {/* Live Timer */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-left sm:text-right shrink-0">
          <div className="text-[11px] text-slate-400 font-mono uppercase">
            Contest Remaining Time
          </div>
          <div className="text-2xl font-extrabold font-mono text-rose-500 mt-0.5">01:04:22</div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 gap-4">
        <div className="flex space-x-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("problems")}
            className={`px-4 py-2.5 rounded-t-lg transition flex items-center space-x-1.5 ${
              activeTab === "problems"
                ? "bg-blue-600 text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Code2 size={14} />
            <span>Contest Problems</span>
          </button>

          <button
            onClick={() => setActiveTab("standings")}
            className={`px-4 py-2.5 rounded-t-lg transition flex items-center space-x-1.5 ${
              activeTab === "standings"
                ? "bg-blue-600 text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Trophy size={14} />
            <span>Standings {friendsOnly && "(Friends Only)"}</span>
          </button>

          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-4 py-2.5 rounded-t-lg transition flex items-center space-x-1.5 ${
              activeTab === "submissions"
                ? "bg-blue-600 text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <FileCode size={14} />
            <span>My Contest Submissions ({userContestSubmissions.length})</span>
          </button>
        </div>

        {activeTab === "standings" && (
          <div className="flex items-center space-x-2 pb-1 text-xs">
            <button
              onClick={() => setFriendsOnly(!friendsOnly)}
              className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center space-x-1.5 transition ${
                friendsOnly
                  ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/40 shadow-sm"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              {friendsOnly ? <UserCheck size={14} /> : <Users size={14} />}
              <span>{friendsOnly ? "Showing Friends Standings ✓" : "Friends Standings"}</span>
            </button>
          </div>
        )}
      </div>

      {/* ========================================================
          VIEW 1: PROBLEMS TABLE (Direct link to problem & color-coded status checks)
          ======================================================== */}
      {activeTab === "problems" && (
        <div className="space-y-4">
          <div className="cp-card overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200 uppercase tracking-wider font-mono">
                Problems Set ({problems.length} challenges)
              </span>
              <span className="text-slate-400 text-xs">
                Click any problem to open the editor directly and start coding
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="cp-table">
                <thead>
                  <tr>
                    <th className="w-16 text-center">Status</th>
                    <th className="w-16 text-center">#</th>
                    <th>Problem Name</th>
                    <th className="w-28 text-center">Score</th>
                    <th className="w-32 text-center">Solved</th>
                    <th className="w-32 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {problems.map((p) => {
                    const st = getProblemStatus(p.id);

                    return (
                      <tr
                        key={p.label}
                        onClick={() => navigate(`/problems/${p.id}`)}
                        className="cursor-pointer hover:bg-slate-800/40 transition group"
                      >
                        {/* Status Check Icon: Green (Solved), Yellow (In Queue), Red (Wrong) */}
                        <td className="text-center" onClick={(e) => e.stopPropagation()}>
                          {st.status === "solved" && (
                            <div
                              className="inline-flex items-center justify-center p-1.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40"
                              title="Solved / Accepted (AC)"
                            >
                              <CheckCircle size={17} />
                            </div>
                          )}

                          {st.status === "queue" && (
                            <div
                              className="inline-flex items-center justify-center p-1.5 rounded-full bg-amber-950/80 text-amber-400 border border-amber-500/40"
                              title="In Queue / Running tests..."
                            >
                              <Clock size={17} className="animate-spin" />
                            </div>
                          )}

                          {st.status === "wrong" && (
                            <div
                              className="inline-flex items-center justify-center p-1.5 rounded-full bg-rose-950/80 text-rose-400 border border-rose-500/40"
                              title={`${st.label} (WA / TLE / MLE)`}
                            >
                              <XCircle size={17} />
                            </div>
                          )}

                          {st.status === "unattempted" && (
                            <span className="text-slate-600 font-mono text-sm">—</span>
                          )}
                        </td>

                        {/* Problem Code */}
                        <td className="text-center font-mono font-bold text-slate-300">
                          {p.label}
                        </td>

                        {/* Problem Title — Taking user straight to the problem */}
                        <td>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white group-hover:text-blue-400 transition text-sm">
                              {p.title}
                            </span>
                            {st.status !== "unattempted" && (
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                                  st.status === "solved"
                                    ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                                    : st.status === "queue"
                                      ? "bg-amber-950/60 text-amber-400 border border-amber-500/30"
                                      : "bg-rose-950/60 text-rose-400 border border-rose-500/30"
                                }`}
                              >
                                {st.label}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono">
                            Time: 2.0s • Memory: 256MB • Standard I/O
                          </span>
                        </td>

                        {/* Score */}
                        <td className="text-center font-mono font-bold text-blue-400 text-xs">
                          {p.score} pts
                        </td>

                        {/* Solved Count */}
                        <td className="text-center font-mono text-xs text-slate-400">
                          x{p.solvedCount.toLocaleString()}
                        </td>

                        {/* Action Link directly to Problem */}
                        <td className="text-right">
                          <Link
                            to={`/problems/${p.id}`}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-600 group-hover:bg-blue-500 text-white rounded text-xs font-semibold transition shadow-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>Solve</span>
                            <ArrowRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Legend Notice */}
          <div className="flex flex-wrap items-center justify-between p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-400">
            <div className="flex items-center space-x-4">
              <span className="font-mono text-slate-300 font-semibold">Status Indicators:</span>
              <div className="flex items-center space-x-1.5 text-emerald-400">
                <CheckCircle size={14} />
                <span>Solved (Green)</span>
              </div>
              <div className="flex items-center space-x-1.5 text-amber-400">
                <Clock size={14} />
                <span>In Queue (Yellow)</span>
              </div>
              <div className="flex items-center space-x-1.5 text-rose-400">
                <XCircle size={14} />
                <span>Wrong / TLE / WA (Red)</span>
              </div>
            </div>
            <span className="font-mono text-[11px] text-slate-500">
              Live verdict synchronized with judge engine
            </span>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW 2: STANDINGS TABLE (With Friends Standings Option)
          ======================================================== */}
      {activeTab === "standings" && (
        <div className="cp-card overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-200 uppercase tracking-wider font-mono">
              {friendsOnly ? "Friends Standings Leaderboard" : "Global Contest Standings"}
            </span>
            <span className="text-slate-400 font-mono">
              {filteredStandings.length} participant{filteredStandings.length !== 1 ? "s" : ""}{" "}
              listed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="cp-table">
              <thead>
                <tr>
                  <th className="w-12 text-center">Rank</th>
                  <th>Competitor</th>
                  <th className="w-16 text-center">Solved</th>
                  <th className="w-20 text-center">Penalty</th>
                  <th className="w-16 text-center">A</th>
                  <th className="w-16 text-center">B</th>
                  <th className="w-16 text-center">C</th>
                  <th className="w-16 text-center">D</th>
                  <th className="w-16 text-center">E</th>
                </tr>
              </thead>
              <tbody>
                {filteredStandings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-slate-400 text-xs">
                      No friends found in this contest standings.
                      <button
                        onClick={() => setFriendsOnly(false)}
                        className="ml-2 text-blue-400 hover:underline font-bold"
                      >
                        Show All Standings
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredStandings.map((row) => (
                    <tr
                      key={row.userId}
                      className={
                        row.username === currentUser?.username
                          ? "bg-blue-950/25 border-l-2 border-l-blue-500"
                          : ""
                      }
                    >
                      <td className="text-center font-mono font-bold text-slate-400">
                        #{row.rank}
                      </td>

                      <td>
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/profile/${row.username}`}
                            className={`font-bold hover:underline ${getRatingColor(row.rating)}`}
                          >
                            {row.username}
                          </Link>
                          {currentUser?.friends?.includes(row.username) && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                              Friend
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-normal">
                            <span>{getCountryFlag(row.country)}</span>
                            <span>{row.country}</span>
                          </span>
                        </div>
                      </td>

                      <td className="text-center font-bold font-mono text-emerald-400 text-sm">
                        {row.solved}
                      </td>

                      <td className="text-center font-mono text-xs text-slate-400">
                        {row.penalty}
                      </td>

                      {/* Results per problem */}
                      {["A", "B", "C", "D", "E"].map((letter) => {
                        const res = row.problemResults?.[letter];
                        if (!res) {
                          return (
                            <td key={letter} className="text-center text-slate-600 font-mono">
                              —
                            </td>
                          );
                        }
                        if (res.verdict === "AC") {
                          return (
                            <td
                              key={letter}
                              className="text-center font-mono text-xs bg-emerald-950/20 text-emerald-400"
                            >
                              <span className="font-bold block">
                                +{res.attempts > 1 ? res.attempts - 1 : ""}
                              </span>
                              <span className="text-[10px] text-slate-500 block">{res.time}</span>
                            </td>
                          );
                        }
                        return (
                          <td
                            key={letter}
                            className="text-center font-mono text-xs bg-rose-950/20 text-rose-400 font-bold"
                          >
                            -{res.attempts}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW 3: CONTEST SUBMISSIONS
          ======================================================== */}
      {activeTab === "submissions" && (
        <div className="cp-card overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-200 uppercase tracking-wider font-mono">
              Submissions in this Contest
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="cp-table">
              <thead>
                <tr>
                  <th># ID</th>
                  <th>Problem</th>
                  <th>Lang</th>
                  <th className="text-center">Verdict</th>
                  <th className="text-center">Time</th>
                  <th className="text-center">Memory</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {userContestSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                      No contest submissions recorded yet. Click on any problem to solve it!
                    </td>
                  </tr>
                ) : (
                  userContestSubmissions.map((s) => {
                    const isAC = s.verdict === "AC";
                    const isQueue = s.verdict === "QUEUE" || s.verdict === "PENDING";
                    const isWrong = ["WA", "TLE", "MLE", "RE", "CE"].includes(s.verdict);

                    return (
                      <tr key={s.id}>
                        <td className="font-mono text-xs text-slate-400">{s.id}</td>
                        <td>
                          <Link
                            to={`/problems/${s.problemId}`}
                            className="font-bold text-slate-200 hover:text-blue-400 transition"
                          >
                            {s.problemId}. {s.problemTitle}
                          </Link>
                        </td>
                        <td className="font-mono text-xs text-slate-300">{s.language || "C++"}</td>
                        <td className="text-center">
                          {isAC && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle size={12} />
                              <span>Accepted</span>
                            </span>
                          )}
                          {isQueue && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/60 text-amber-400 border border-amber-500/30">
                              <Clock size={12} className="animate-spin" />
                              <span>In Queue</span>
                            </span>
                          )}
                          {isWrong && (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950/60 text-rose-400 border border-rose-500/30">
                              <XCircle size={12} />
                              <span>{s.verdict}</span>
                            </span>
                          )}
                        </td>
                        <td className="text-center font-mono text-xs text-slate-300">
                          {s.time || 0} ms
                        </td>
                        <td className="text-center font-mono text-xs text-slate-300">
                          {s.memory || 0} KB
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setSelectedSubmissionCode(s)}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold transition shadow-sm"
                            >
                              View Code
                            </button>
                            <Link
                              to={`/problems/${s.problemId}`}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-semibold transition"
                            >
                              Open Problem
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enlarged VSCode Syntax Highlighted Code Viewer Modal */}
      {selectedSubmissionCode && (
        <CodeViewerModal
          submission={selectedSubmissionCode}
          onClose={() => setSelectedSubmissionCode(null)}
        />
      )}
    </div>
  );
}
