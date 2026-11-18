import React from "react";
import { Link } from "@/app/router-compat";
import { CheckCircle } from "lucide-react";

function getDifficultyConfig(rating) {
  if (!rating) return { label: "?", color: "text-gray-400", bg: "bg-gray-700" };
  if (rating < 1200) return { label: "Newbie", color: "text-gray-400", bg: "bg-gray-700" };
  if (rating < 1400) return { label: "Pupil", color: "text-green-400", bg: "bg-green-900/40" };
  if (rating < 1600) return { label: "Spec.", color: "text-teal-400", bg: "bg-teal-900/40" };
  if (rating < 1900) return { label: "Expert", color: "text-blue-400", bg: "bg-blue-900/40" };
  if (rating < 2100) return { label: "CandMas", color: "text-purple-400", bg: "bg-purple-900/40" };
  if (rating < 2300) return { label: "Master", color: "text-yellow-400", bg: "bg-yellow-900/40" };
  if (rating < 2600) return { label: "IGM", color: "text-orange-400", bg: "bg-orange-900/40" };
  return { label: "LGM", color: "text-red-400", bg: "bg-red-900/40" };
}

function formatAcceptRate(rate) {
  if (rate === null || rate === undefined) return "—";
  return `${Number(rate).toFixed(1)}%`;
}

export default function ProblemCard({ problem, showStatus = false, compact = false }) {
  if (!problem) return null;

  const diff = getDifficultyConfig(problem.rating || problem.difficulty);
  const tags = (problem.tags || []).slice(0, 2);
  const hasMoreTags = (problem.tags || []).length > 2;

  const acceptRate = problem.acceptRate ?? problem.accept_rate ?? null;
  const rateNum = acceptRate !== null ? parseFloat(acceptRate) : null;
  const rateColor =
    rateNum === null
      ? "text-gray-400"
      : rateNum >= 50
        ? "text-green-400"
        : rateNum >= 30
          ? "text-yellow-400"
          : "text-red-400";

  return (
    <Link
      to={`/problems/${problem.id}`}
      className={`block rounded-lg border border-gray-700 bg-gray-800 hover:border-blue-500/50 hover:bg-gray-750 transition-colors ${compact ? "p-3" : "p-4"}`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: title + tags */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            {problem.problemId && (
              <span className="text-xs text-gray-500 font-mono">{problem.problemId}</span>
            )}
            <span
              className={`font-semibold text-white truncate ${compact ? "text-sm" : "text-base"}`}
            >
              {problem.title}
            </span>
            {showStatus && problem.status === "solved" && (
              <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
            )}
          </div>

          {!compact && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((tag) => (
                <span key={tag} className="px-1.5 py-0.5 rounded text-xs bg-gray-700 text-gray-300">
                  {tag}
                </span>
              ))}
              {hasMoreTags && (
                <span className="px-1.5 py-0.5 rounded text-xs bg-gray-700 text-gray-400">
                  +{(problem.tags || []).length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: difficulty + rate */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${diff.bg} ${diff.color}`}>
            {problem.rating || diff.label}
          </span>
          {rateNum !== null && (
            <span className={`text-xs font-mono ${rateColor}`}>{formatAcceptRate(rateNum)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
