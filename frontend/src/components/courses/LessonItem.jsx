import { Link } from 'react-router-dom';
import { CheckCircle, Lock, Video, FileText, Zap, Clock } from 'lucide-react';

const TYPE_ICONS = {
  video: { icon: Video, label: 'Video', emoji: '🎥' },
  reading: { icon: FileText, label: 'Reading', emoji: '📄' },
  exercise: { icon: Zap, label: 'Exercise', emoji: '⚡' },
};

export default function LessonItem({ lesson, completed = false, locked = false, courseId }) {
  const typeInfo = TYPE_ICONS[lesson.type] || TYPE_ICONS.reading;

  const content = (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      locked
        ? 'opacity-50 cursor-not-allowed'
        : completed
        ? 'hover:bg-green-900/20'
        : 'hover:bg-gray-700/50 cursor-pointer'
    }`}>
      {/* Type icon */}
      <span className="text-base flex-shrink-0 w-6 text-center" title={typeInfo.label}>
        {typeInfo.emoji}
      </span>

      {/* Title + meta */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate ${completed ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
          {lesson.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {lesson.duration ?? '10 min'}
          </span>
          {lesson.free && !locked && (
            <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">Free</span>
          )}
        </div>
      </div>

      {/* Status icon */}
      <div className="flex-shrink-0">
        {locked ? (
          <Lock className="w-4 h-4 text-gray-600" />
        ) : completed ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
        )}
      </div>
    </div>
  );

  if (locked || !courseId) return content;

  return (
    <Link to={`/courses/${courseId}/lessons/${lesson.id}`} className="block">
      {content}
    </Link>
  );
}
