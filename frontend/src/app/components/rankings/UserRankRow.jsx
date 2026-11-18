import { Link } from "@/app/router-compat";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { getRatingColor, getRankTitle } from "../../utils/helpers";

export default function UserRankRow({ user, rank, currentUser, showChange = true }) {
  if (!user) return null;
  const isCurrentUser = currentUser && currentUser.username === user.username;
  const ratingClass = getRatingColor(user.rating);

  let changeEl = null;
  if (showChange && user.rankChange !== undefined) {
    if (user.rankChange > 0) {
      changeEl = (
        <span className="flex items-center gap-0.5 text-green-400 text-xs font-semibold">
          <TrendingUp className="w-3 h-3" />▲{user.rankChange}
        </span>
      );
    } else if (user.rankChange < 0) {
      changeEl = (
        <span className="flex items-center gap-0.5 text-red-400 text-xs font-semibold">
          <TrendingDown className="w-3 h-3" />▼{Math.abs(user.rankChange)}
        </span>
      );
    } else {
      changeEl = (
        <span className="flex items-center gap-0.5 text-gray-500 text-xs">
          <Minus className="w-3 h-3" />—
        </span>
      );
    }
  }

  return (
    <tr
      className={`border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors ${isCurrentUser ? "bg-blue-500/10" : ""}`}
    >
      <td className="px-3 py-2.5 text-center">
        {rank === 1 && <span className="text-yellow-400 font-bold">🥇 1</span>}
        {rank === 2 && <span className="text-gray-300 font-bold">🥈 2</span>}
        {rank === 3 && <span className="text-orange-400 font-bold">🥉 3</span>}
        {rank > 3 && <span className="text-gray-400 text-sm">{rank}</span>}
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gray-600`}
            style={{ background: "linear-gradient(135deg, #374151, #4B5563)" }}
          >
            {(user.username || "?")[0].toUpperCase()}
          </div>
          <div>
            <Link
              to={`/profile/${user.username}`}
              className={`font-semibold hover:underline ${ratingClass}`}
            >
              {user.username}
            </Link>
            {isCurrentUser && (
              <span className="ml-1.5 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded-full">
                You
              </span>
            )}
            <div className="text-xs text-gray-500">{getRankTitle(user.rating)}</div>
          </div>
        </div>
      </td>
      <td className="px-3 py-2.5 text-sm">{user.country || "—"}</td>
      <td className={`px-3 py-2.5 font-bold text-sm ${ratingClass}`}>{user.rating ?? "—"}</td>
      <td className="px-3 py-2.5 text-sm text-gray-400">{user.maxRating ?? "—"}</td>
      <td className="px-3 py-2.5 text-sm text-gray-300">
        {user.problemsSolved?.toLocaleString() ?? "—"}
      </td>
      <td className="px-3 py-2.5 text-sm text-gray-400">{user.contestsParticipated ?? "—"}</td>
      {showChange && <td className="px-3 py-2.5">{changeEl}</td>}
    </tr>
  );
}
