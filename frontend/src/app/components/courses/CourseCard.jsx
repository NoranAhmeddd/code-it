import { Link } from "@/app/router-compat";
import { Users, BookOpen, Star, Play, ChevronRight } from "lucide-react";

const CATEGORY_GRADIENTS = {
  "Data Structures": "from-blue-600 to-blue-800",
  Algorithms: "from-green-600 to-green-800",
  "Graph Theory": "from-purple-600 to-purple-800",
  "Dynamic Programming": "from-orange-600 to-orange-800",
  Fundamentals: "from-teal-600 to-teal-800",
  Advanced: "from-red-600 to-red-800",
  ICPC: "from-yellow-600 to-yellow-800",
};

const DIFFICULTY_STYLES = {
  Beginner: "bg-green-500/20 text-green-400 border border-green-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  Advanced: "bg-red-500/20 text-red-400 border border-red-500/30",
};

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function CourseCard({
  course,
  showProgress = false,
  enrolled = false,
  compact = false,
}) {
  const gradient = CATEGORY_GRADIENTS[course.category] || "from-gray-600 to-gray-800";
  const progress = course.progress ?? 0;

  if (compact) {
    return (
      <Link
        to={`/courses/${course.id}`}
        className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors group"
      >
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate group-hover:text-blue-400 transition-colors">
            {course.title}
          </p>
          <p className="text-xs text-gray-400">{course.lessons} lessons</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
      </Link>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all hover:shadow-xl hover:shadow-black/30 flex flex-col group">
      {/* Thumbnail */}
      <div
        className={`relative h-36 bg-gradient-to-br ${gradient} flex items-center justify-center`}
      >
        <BookOpen className="w-12 h-12 text-white/30" />
        {/* Difficulty badge */}
        <span
          className={`absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-medium ${DIFFICULTY_STYLES[course.difficulty] || DIFFICULTY_STYLES.Intermediate}`}
        >
          {course.difficulty}
        </span>
        {/* Category tag */}
        <span className="absolute bottom-3 left-3 text-xs px-2 py-0.5 rounded-full bg-black/40 text-white/80 backdrop-blur-sm">
          {course.category}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-bold text-white text-sm leading-snug line-clamp-2 mb-2 group-hover:text-blue-400 transition-colors">
          {course.title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {getInitials(course.instructor)}
          </div>
          <span className="text-xs text-gray-400 truncate">{course.instructor}</span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1">{course.description}</p>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {course.lessons ?? 0} lessons
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {(course.students ?? 0).toLocaleString()}
          </span>
          <span className="flex items-center gap-1 text-yellow-400">
            <Star className="w-3.5 h-3.5 fill-yellow-400" />
            {course.rating ?? "4.8"}
          </span>
        </div>

        {/* Progress bar if enrolled */}
        {showProgress && enrolled && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* CTA Button */}
        <Link
          to={`/courses/${course.id}`}
          className={`mt-auto flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
            enrolled
              ? "bg-blue-600 hover:bg-blue-500 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-gray-200"
          }`}
        >
          <Play className="w-4 h-4" />
          {enrolled ? "Continue" : "Enroll"}
        </Link>
      </div>
    </div>
  );
}
