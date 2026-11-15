import { Link } from 'react-router-dom';
import { Clock, BookOpen, CheckCircle, AlertTriangle, Trophy } from 'lucide-react';

function getDeadlineInfo(deadline) {
  const now = new Date();
  const due = new Date(deadline);
  const diffMs = due - now;
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffMs < 0) {
    return { label: 'Overdue', style: 'bg-red-500/20 text-red-400 border border-red-500/30' };
  } else if (diffHours < 24) {
    const h = Math.floor(diffHours);
    return { label: `${h}h remaining`, style: 'bg-red-500/20 text-red-400 border border-red-500/30' };
  } else if (diffDays < 3) {
    const d = Math.floor(diffDays);
    return { label: `${d}d remaining`, style: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' };
  } else {
    const d = Math.floor(diffDays);
    return { label: `${d}d remaining`, style: 'bg-green-500/20 text-green-400 border border-green-500/30' };
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AssignmentCard({ assignment, role = 'student' }) {
  const deadlineInfo = getDeadlineInfo(assignment.deadline);
  const solved = assignment.solvedCount ?? 0;
  const total = assignment.problemCount ?? 0;
  const progressPct = total > 0 ? Math.round((solved / total) * 100) : 0;

  return (
    <div className="bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl p-5 transition-all hover:shadow-lg hover:shadow-black/20">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <Link
            to={`/assignments/${assignment.id}`}
            className="font-semibold text-white hover:text-blue-400 transition-colors line-clamp-1"
          >
            {assignment.title}
          </Link>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
            <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{assignment.courseName}</span>
            {role === 'student' && assignment.instructor && (
              <>
                <span className="text-gray-600">·</span>
                <span className="truncate">{assignment.instructor}</span>
              </>
            )}
          </div>
        </div>

        {/* Score (if graded) */}
        {assignment.score != null && (
          <div className="flex items-center gap-1.5 flex-shrink-0 bg-blue-500/10 border border-blue-500/20 rounded-lg px-2.5 py-1">
            <Trophy className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-bold text-blue-400">{assignment.score}/{assignment.maxScore ?? 100}</span>
          </div>
        )}
      </div>

      {/* Deadline */}
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-3.5 h-3.5 text-gray-500" />
        <span className="text-xs text-gray-400">{formatDate(assignment.deadline)}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${deadlineInfo.style}`}>
          {deadlineInfo.label}
        </span>
      </div>

      {/* Progress row */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-green-400" />
            {solved}/{total} problems solved
          </span>
          <span>{progressPct}%</span>
        </div>
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              progressPct === 100 ? 'bg-green-500' : progressPct > 50 ? 'bg-blue-500' : 'bg-yellow-500'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3">
        {role === 'teacher' && (
          <span className="text-xs text-gray-500">
            {assignment.submissionsCount ?? 0} submissions
          </span>
        )}
        <Link
          to={`/assignments/${assignment.id}`}
          className="ml-auto text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium"
        >
          {role === 'teacher' ? 'Review' : progressPct === 100 ? 'View' : 'Continue'}
        </Link>
      </div>
    </div>
  );
}
