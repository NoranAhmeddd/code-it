import React from "react";
import { useParams, Link } from "@/app/router-compat";
import mockData from "../data/mockData";
import { formatDate, timeUntil } from "../utils/helpers";
import { CheckCircle, ChevronLeft, ExternalLink, FileText } from "lucide-react";

export default function AssignmentDetailPage() {
  const { id } = useParams();
  const asg = mockData.assignments.find((a) => a.id === id) || mockData.assignments[0];
  const solvedSet = new Set(asg.submittedProblems || []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <Link
        to="/assignments"
        className="inline-flex items-center space-x-1 text-xs text-indigo-600 hover:underline font-semibold"
      >
        <ChevronLeft size={15} />
        <span>Return to Assignments List</span>
      </Link>

      {/* Assignment Overview Card */}
      <div className="edu-card p-6 md:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded">
            {asg.courseTitle}
          </span>
          <span className="text-slate-500 font-mono">
            Deadline: {formatDate(asg.deadline)} ({timeUntil(asg.deadline)})
          </span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900">{asg.title}</h1>

        <p className="text-sm text-slate-700 leading-relaxed">{asg.description}</p>

        <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div>
            Teacher: <strong className="text-slate-800">{asg.teacherName}</strong>
          </div>
          <div>
            Max Score: <strong className="text-slate-800">{asg.maxScore} pts</strong>
          </div>
          {asg.score !== undefined && (
            <div>
              Awarded Score:{" "}
              <strong className="text-emerald-700 font-bold">
                {asg.score} / {asg.maxScore}
              </strong>
            </div>
          )}
        </div>

        {asg.feedback && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 italic">
            <strong>Teacher Feedback:</strong> "{asg.feedback}"
          </div>
        )}
      </div>

      {/* Assigned Problems List */}
      <div className="edu-card overflow-hidden">
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 font-semibold text-xs text-slate-800 uppercase flex justify-between">
          <span>Assigned Problems ({asg.problems?.length || 0})</span>
          <span className="text-slate-500 font-normal">
            {solvedSet.size} of {asg.problems?.length || 0} Solved
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {asg.problems?.map((probId, idx) => {
            const prob = mockData.problems.find((p) => p.id === probId);
            const isSolved = solvedSet.has(probId);

            return (
              <div
                key={probId}
                className="p-4 flex items-center justify-between hover:bg-slate-50 text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center font-bold ${
                      isSolved ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {isSolved ? "✓" : idx + 1}
                  </div>

                  <div>
                    <span className="font-mono font-bold text-indigo-700 mr-2">{probId}</span>
                    <strong className="text-slate-800">{prob?.title || `Problem ${probId}`}</strong>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Rating: {prob?.rating} • {prob?.tags.join(", ")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`font-semibold ${isSolved ? "text-emerald-700" : "text-slate-400"}`}
                  >
                    {isSolved ? "Accepted" : "Not Solved"}
                  </span>

                  <Link
                    to={`/problems/${probId}`}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded shadow-sm inline-flex items-center space-x-1"
                  >
                    <span>Solve in Code Editor</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
