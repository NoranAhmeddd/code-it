export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatRelativeTime(dateStr) {
  if (!dateStr) return "";
  const now = Date.now();
  const target = new Date(dateStr).getTime();
  const diff = target - now;
  const abs = Math.abs(diff);
  const mins = Math.floor(abs / 60000);
  const hours = Math.floor(abs / 3600000);
  const days = Math.floor(abs / 86400000);

  let str;
  if (abs < 60000) str = "just now";
  else if (abs < 3600000) str = `${mins} minute${mins !== 1 ? "s" : ""}`;
  else if (abs < 86400000) str = `${hours} hour${hours !== 1 ? "s" : ""}`;
  else str = `${days} day${days !== 1 ? "s" : ""}`;

  if (abs < 60000) return str;
  return diff < 0 ? `${str} ago` : `in ${str}`;
}

export function formatDuration(ms) {
  if (!ms) return "0m";
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function timeUntil(dateStr) {
  if (!dateStr) return "";
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return "now";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (days > 0) return `in ${days} day${days !== 1 ? "s" : ""}`;
  if (hours > 0) return `in ${hours} hour${hours !== 1 ? "s" : ""}`;
  return `in ${mins} minute${mins !== 1 ? "s" : ""}`;
}

export function getRatingColor(rating) {
  if (!rating) return "text-gray-400";
  if (rating < 1200) return "text-gray-400";
  if (rating < 1400) return "text-green-500";
  if (rating < 1600) return "text-teal-400";
  if (rating < 1900) return "text-blue-400";
  if (rating < 2100) return "text-purple-400";
  if (rating < 2300) return "text-yellow-400";
  if (rating < 2400) return "text-orange-400";
  if (rating < 2600) return "text-red-400";
  if (rating < 3000) return "text-red-500";
  return "text-red-500 font-bold";
}

export function getRankTitle(rating) {
  if (!rating) return "Unrated";
  if (rating < 1200) return "Newbie";
  if (rating < 1400) return "Pupil";
  if (rating < 1600) return "Specialist";
  if (rating < 1900) return "Expert";
  if (rating < 2100) return "Candidate Master";
  if (rating < 2300) return "Master";
  if (rating < 2400) return "International Master";
  if (rating < 2600) return "Grandmaster";
  if (rating < 3000) return "International Grandmaster";
  return "Legendary Grandmaster";
}

export function getVerdictColor(verdict) {
  switch (verdict) {
    case "AC":
      return "text-green-400";
    case "WA":
      return "text-red-400";
    case "TLE":
      return "text-yellow-400";
    case "MLE":
      return "text-orange-400";
    case "RE":
      return "text-purple-400";
    case "CE":
      return "text-pink-400";
    default:
      return "text-blue-400";
  }
}

export function getVerdictLabel(verdict) {
  switch (verdict) {
    case "AC":
      return "Accepted";
    case "WA":
      return "Wrong Answer";
    case "TLE":
      return "Time Limit Exceeded";
    case "MLE":
      return "Memory Limit Exceeded";
    case "RE":
      return "Runtime Error";
    case "CE":
      return "Compilation Error";
    case "PE":
      return "Presentation Error";
    case "SK":
      return "Skipped";
    default:
      return "Unknown";
  }
}

export function getVerdictBg(verdict) {
  switch (verdict) {
    case "AC":
      return "bg-green-500/10 border border-green-500/30";
    case "WA":
      return "bg-red-500/10 border border-red-500/30";
    case "TLE":
      return "bg-yellow-500/10 border border-yellow-500/30";
    case "MLE":
      return "bg-orange-500/10 border border-orange-500/30";
    case "RE":
      return "bg-purple-500/10 border border-purple-500/30";
    case "CE":
      return "bg-pink-500/10 border border-pink-500/30";
    default:
      return "bg-blue-500/10 border border-blue-500/30";
  }
}

export function formatNumber(n) {
  if (n === null || n === undefined) return "0";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toLocaleString();
}

export function calculateAcceptRate(accepted, total) {
  if (!total || total === 0) return "0.0%";
  return `${((accepted / total) * 100).toFixed(1)}%`;
}

export function getDifficultyColor(rating) {
  if (!rating) return "text-gray-400";
  if (rating < 1200) return "text-gray-400";
  if (rating < 1600) return "text-green-400";
  if (rating < 2000) return "text-yellow-400";
  if (rating < 2400) return "text-orange-400";
  return "text-red-400";
}

export function getDifficultyLabel(rating) {
  if (!rating) return "Unknown";
  if (rating < 1200) return "Easy";
  if (rating < 1600) return "Easy";
  if (rating < 2000) return "Medium";
  if (rating < 2400) return "Hard";
  return "Expert";
}

export function formatContestDuration(ms) {
  if (!ms) return "0 minutes";
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const parts = [];
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
  return parts.join(" ") || "0 minutes";
}

export function isContestActive(contest) {
  if (!contest) return false;
  const now = Date.now();
  const start = new Date(contest.startTime).getTime();
  const end = start + (contest.duration || 0);
  return now >= start && now <= end;
}

export function isContestUpcoming(contest) {
  if (!contest) return false;
  return new Date(contest.startTime).getTime() > Date.now();
}

export function truncateText(text, maxLen) {
  if (!text) return "";
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen - 3) + "...";
}
