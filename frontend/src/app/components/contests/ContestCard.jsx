import { useState, useEffect } from "react";
import { Link } from "@/app/router-compat";
import { Clock, Users, Trophy, Calendar, CheckCircle } from "lucide-react";
import {
  formatDuration,
  formatDate,
  isContestActive,
  isContestUpcoming,
  getRatingColor,
} from "../../utils/helpers";

const TYPE_BADGE = {
  "Div. 1": "bg-red-500/20 text-red-400 border border-red-500/30",
  "Div. 2": "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  "Div. 3": "bg-green-500/20 text-green-400 border border-green-500/30",
  Educational: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  "ICPC Style": "bg-orange-500/20 text-orange-400 border border-orange-500/30",
};

function Countdown({ targetMs }) {
  const [remaining, setRemaining] = useState(Math.max(0, targetMs - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setRemaining(Math.max(0, targetMs - Date.now())), 1000);
    return () => clearInterval(id);
  }, [targetMs]);
  const totalSecs = Math.floor(remaining / 1000);
  const d = Math.floor(totalSecs / 86400);
  const h = Math.floor((totalSecs % 86400) / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  if (d > 0)
    return (
      <span>
        {d}d {h}h {m}m
      </span>
    );
  return (
    <span>
      {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
    </span>
  );
}

export default function ContestCard({ contest, variant, showRegister = true }) {
  const [registered, setRegistered] = useState(contest?.registered || false);
  if (!contest) return null;

  const badgeClass =
    TYPE_BADGE[contest.type] || "bg-gray-500/20 text-gray-400 border border-gray-500/30";
  const startMs = new Date(contest.startTime).getTime();
  const endMs = startMs + (contest.duration || 0);

  if (variant === "upcoming") {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-blue-500/50 transition-all">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-lg truncate">{contest.name}</h3>
            <span
              className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${badgeClass}`}
            >
              {contest.type}
            </span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span>Starts in: </span>
            <span className="text-yellow-400 font-mono font-semibold">
              <Countdown targetMs={startMs} />
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(contest.startTime)}</span>
            <span className="text-gray-600">·</span>
            <span>Duration: {formatDuration(contest.duration)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            <span>{contest.participants?.toLocaleString() ?? 0} registered</span>
          </div>
        </div>

        <div className="flex gap-2">
          {showRegister && (
            <button
              onClick={() => setRegistered((r) => !r)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                registered
                  ? "bg-green-600 text-white"
                  : "bg-green-500 hover:bg-green-400 text-white"
              }`}
            >
              {registered ? (
                <>
                  <CheckCircle className="w-4 h-4" /> Registered ✓
                </>
              ) : (
                "Register"
              )}
            </button>
          )}
          <Link
            to={`/contests/${contest.id}`}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-700 hover:bg-gray-600 text-gray-200 transition-all"
          >
            View Details
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "active") {
    const elapsed = Math.max(0, Date.now() - startMs);
    const totalDur = contest.duration || 1;
    const progress = Math.min(100, (elapsed / totalDur) * 100);
    return (
      <div className="bg-gray-800 border-2 border-red-500/50 rounded-xl p-5 hover:border-red-500 transition-all">
        <div className="flex items-center gap-3 mb-3">
          <span className="flex items-center gap-1.5 bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-bold animate-pulse">
            🔴 LIVE
          </span>
          <h3 className="text-white font-bold text-lg truncate">{contest.name}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeClass}`}>
            {contest.type}
          </span>
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Elapsed: {formatDuration(elapsed)}</span>
            <span>Remaining: {formatDuration(Math.max(0, endMs - Date.now()))}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Users className="w-4 h-4" />
          <span>{contest.participants?.toLocaleString() ?? 0} participants</span>
        </div>
        <Link
          to={`/contests/${contest.id}`}
          className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all"
        >
          Enter Contest →
        </Link>
      </div>
    );
  }

  // past
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to={`/contests/${contest.id}`}
            className="text-blue-400 hover:text-blue-300 font-semibold"
          >
            {contest.name}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeClass}`}>
              {contest.type}
            </span>
            <span className="text-xs text-gray-500">{formatDate(contest.startTime)}</span>
          </div>
        </div>
        <div className="text-right">
          {contest.ratingChange !== undefined && (
            <span
              className={`font-bold text-sm ${contest.ratingChange >= 0 ? "text-green-400" : "text-red-400"}`}
            >
              {contest.ratingChange >= 0 ? "+" : ""}
              {contest.ratingChange}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
